import type { VercelRequest, VercelResponse } from '@vercel/node';
import redis, { getMetadata } from '../lib/redis.js';
import { validateShareCode } from '@fileduck/shared';
import { fetchDownloadBuffer } from '../lib/download-buffer.js';
import { Octokit } from '@octokit/rest';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow GET and HEAD (HEAD should return headers only)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Track active transfer
    if (redis) {
      await redis.incr('metrics:active_transfers');
    }

    // Support direct asset proxying via ?assetUrl=<url>
    const assetUrl = (req.query.assetUrl || req.query.url) as string;

    if (assetUrl) {
      const parsed = new URL(assetUrl);
      if (!parsed.hostname.includes('github.com') || !parsed.pathname.includes('/duckyoo9/fileduck-storage/releases/')) {
        return res.status(403).json({ error: 'Proxy only allows assets from duckyoo9/fileduck-storage releases' });
      }
      // Try direct fetch first (follow redirects). If that fails with 404 or similar, try GitHub API asset endpoint
      const token = process.env.GITHUB_TOKEN;
      const headers: Record<string, string> = {
        'User-Agent': 'fileduck-proxy/1.0'
      };
      if (token) headers['Authorization'] = `token ${token}`;
      if (req.headers.range) headers['Range'] = req.headers.range as string;

      let upstream = await fetch(assetUrl, { headers, redirect: 'follow' });

      // If direct fetch returned 404 or other error, try GitHub API asset URL (resolves release -> asset id)
      if (!upstream.ok && token) {
        try {
          const octokit = new Octokit({ auth: token });
          const parts = parsed.pathname.split('/').filter(Boolean);
          // Expect: /{owner}/{repo}/releases/download/{tag}/{filename}
          const owner = parts[0];
          const repo = parts[1];
          const tag = parts[4];
          const filename = parts.slice(5).join('/');

          // Get release by tag
          const release = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag }).catch(() => null);
          if (release && release.data && release.data.id) {
            const releaseId = release.data.id;
            const assets = await octokit.rest.repos.listReleaseAssets({ owner, repo, release_id: releaseId, per_page: 100 });
            const match = assets.data.find(a => a.name === filename || a.name.startsWith(filename));
            if (match) {
              // Use Octokit to request the asset reliably. Octokit may return Buffer/data which
              // we convert to a stream to avoid buffering huge files in memory where possible.
              try {
                const assetId = match.id;
                const owner = parts[0];
                const repo = parts[1];

                const assetResponse = await octokit.request('GET /repos/{owner}/{repo}/releases/assets/{asset_id}', {
                  owner,
                  repo,
                  asset_id: assetId,
                  headers: { accept: 'application/octet-stream' },
                });

                // octokit may return Buffer, ArrayBuffer, string or a stream-like object.
                const data = assetResponse.data as any;

                if (Buffer.isBuffer(data) || data instanceof ArrayBuffer || data instanceof Uint8Array) {
                  const buf = Buffer.isBuffer(data) ? data : Buffer.from(new Uint8Array(data as ArrayBuffer));
                  // Send buffer directly to client with headers from assetResponse if available
                  const hdrs = (assetResponse as any).headers || {};
                  if (hdrs['content-type']) res.setHeader('Content-Type', hdrs['content-type']);
                  res.setHeader('Content-Length', String(buf.length));
                  if (hdrs['content-disposition']) res.setHeader('Content-Disposition', hdrs['content-disposition']);
                  // If HEAD request, respond with headers only
                  if (req.method === 'HEAD') return res.status(200).end();

                  if (redis) {
                    await redis.incrby('metrics:download_bytes_total', buf.length);
                  }
                  return res.status(200).send(buf);
                } else if (typeof data?.pipe === 'function') {
                  // Node stream - pipe directly to response
                  try {
                    const { pipeline } = await import('stream');
                    const { promisify } = await import('util');
                    await promisify(pipeline)(data, res as any);
                    return;
                  } catch (streamErr) {
                    console.warn('[Proxy] streaming asset via node stream failed, falling back to fetch:', streamErr);
                  }
                } else {
                  // Fallback: try fetching the asset API URL directly
                  const assetApiUrl = match.url; // API URL for asset
                  const apiHeaders: Record<string, string> = {
                    'User-Agent': 'fileduck-proxy/1.0',
                    'Accept': 'application/octet-stream'
                  };
                  if (token) apiHeaders['Authorization'] = `token ${token}`;
                  if (req.headers.range) apiHeaders['Range'] = req.headers.range as string;

                  upstream = await fetch(assetApiUrl, { headers: apiHeaders, redirect: 'follow' });
                }
              } catch (assetErr) {
                console.warn('[Proxy] Octokit asset fetch failed, falling back to direct asset API fetch:', assetErr?.message || assetErr);
                const assetApiUrl = match.url;
                const apiHeaders: Record<string, string> = {
                  'User-Agent': 'fileduck-proxy/1.0',
                  'Accept': 'application/octet-stream'
                };
                if (token) apiHeaders['Authorization'] = `token ${token}`;
                if (req.headers.range) apiHeaders['Range'] = req.headers.range as string;

                upstream = await fetch(assetApiUrl, { headers: apiHeaders, redirect: 'follow' });
              }
            }
          }
        } catch (apiErr) {
          console.warn('[Proxy] GitHub API fallback failed:', apiErr?.message || apiErr);
        }
      }

      if (!upstream.ok) {
        const text = await upstream.text().catch(() => '');
        // Map common upstream status to friendly message
        if (upstream.status === 404) {
          return res.status(410).json({ error: 'File not found or removed', code: 'EXPIRED_OR_DELETED', details: text });
        }
        return res.status(upstream.status).send(text);
      }

      // Forward useful headers
      const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
      if (contentType) res.setHeader('Content-Type', contentType);
      const contentDisposition = upstream.headers.get('content-disposition') || `attachment; filename="${decodeURIComponent(parsed.pathname.split('/').pop() || 'file')}"`;
      if (contentDisposition) res.setHeader('Content-Disposition', contentDisposition);
      const upstreamContentLength = upstream.headers.get('content-length');
      if (upstreamContentLength) res.setHeader('Content-Length', upstreamContentLength);
      const upstreamAcceptRanges = upstream.headers.get('accept-ranges');
      if (upstreamAcceptRanges) res.setHeader('Accept-Ranges', upstreamAcceptRanges);

      // If the client sent HEAD, respond with headers only
      if (req.method === 'HEAD') {
        return res.status(200).end();
      }

      // Stream the response body directly without buffering entire file
      if (upstream.body) {
        const { pipeline } = await import('stream');
        const { promisify } = await import('util');
        const pipelineAsync = promisify(pipeline as any);

        let nodeStream: any = upstream.body as any;
        try {
          const { Readable } = await import('stream');
          if (typeof (Readable as any).fromWeb === 'function' && typeof upstream.body.getReader === 'function') {
            nodeStream = (Readable as any).fromWeb(upstream.body as any);
          }
        } catch (e) {
          // ignore, use upstream.body as-is
        }

        try {
          await pipelineAsync(nodeStream, res);
          // If successful, track metrics
          if (redis && upstreamContentLength) {
            await redis.incrby('metrics:download_bytes_total', parseInt(upstreamContentLength));
          }
        } catch (err) {
          console.error('[Proxy] Stream pipeline failed:', err);
          try { res.end(); } catch (_) { }
        }

        return;
      }

      const arrayBuf = await upstream.arrayBuffer();
      const buf = Buffer.from(new Uint8Array(arrayBuf as ArrayBuffer));
      res.setHeader('Content-Length', buf.length.toString());

      if (redis) {
        await redis.incrby('metrics:download_bytes_total', buf.length);
      }
      return res.status(200).send(buf);
    }

    // Legacy flow: proxy using share code -> fetch metadata & buffer
    const shareCode = req.query.code as string;

    if (!shareCode || !validateShareCode(shareCode)) {
      return res.status(400).json({ error: 'Invalid share code' });
    }

    const metadata = await getMetadata(shareCode);
    if (!metadata) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!metadata.downloadUrl && !metadata.githubReleaseId) {
      return res.status(400).json({ error: 'No download URL available' });
    }

    // Check if it's a GitHub URL
    if (metadata.downloadUrl && !metadata.downloadUrl.includes('github.com')) {
      // Redirect to the URL directly for non-GitHub URLs
      return res.redirect(302, metadata.downloadUrl);
    }

    const buffer = await fetchDownloadBuffer(metadata);

    if (!buffer) {
      return res.status(404).json({
        error: 'Failed to fetch file from storage',
        status: 404,
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', metadata.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(metadata.filename)}"`);
    res.setHeader('Content-Length', buffer.length.toString());

    console.log(`[Proxy] Sending ${buffer.length} bytes for ${metadata.filename}`);

    if (redis) {
      await redis.incrby('metrics:download_bytes_total', buffer.length);
    }

    return res.status(200).send(buffer);
  } catch (error: any) {
    console.error('[Proxy] Error:', error);
    return res.status(500).json({
      error: 'Failed to proxy download',
      details: error.message
    });
  } finally {
    // Decrement active transfers
    if (redis) {
      await redis.decr('metrics:active_transfers');
    }
  }
}


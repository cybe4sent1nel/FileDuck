import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - lib files are compiled separately
import redis from '../lib/redis.js';
// @ts-ignore
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '../lib/github-storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  try {
    // Check Redis connection
    await redis.ping();

    // Check Storage (GitHub) connection
    let storageStatus = 'unhealthy';
    try {
      const repo = await octokit.repos.get({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      });
      if (repo.status === 200) storageStatus = 'operational';
    } catch (e: any) {
      console.warn('Storage health check failed:', e.message || e);
    }

    // Check Scanner health
    let scannerStatus = 'operational';
    const scannerUrl = process.env.SCANNER_URL || 'http://localhost:4000/health';
    try {
      const scannerResponse = await fetch(scannerUrl, { signal: AbortSignal.timeout(2000) });
      if (!scannerResponse.ok) scannerStatus = 'degraded';
    } catch (e: any) {
      console.warn('Scanner health check failed:', e.message || e);
      scannerStatus = 'offline';
    }

    // Real metrics from Redis
    const activeTransfers = parseInt(await redis.get('metrics:active_transfers') || '0');
    const uploadBytesTotal = parseInt(await redis.get('metrics:upload_bytes_total') || '0');
    const downloadBytesTotal = parseInt(await redis.get('metrics:download_bytes_total') || '0');

    // Calculate "speed" using delta tracking in Redis
    const now = Date.now();
    const lastMetrics = await redis.get('metrics:last_capture');
    let uploadSpeed = '0.0 MB/s';
    let downloadSpeed = '0.0 MB/s';

    if (lastMetrics) {
      const { time, upload, download } = JSON.parse(lastMetrics as string);
      const deltaT = (now - time) / 1000; // seconds
      if (deltaT > 0) {
        const deltaUpload = Math.max(0, uploadBytesTotal - upload);
        const deltaDownload = Math.max(0, downloadBytesTotal - download);
        uploadSpeed = `${(deltaUpload / (1024 * 1024) / deltaT).toFixed(1)} MB/s`;
        downloadSpeed = `${(deltaDownload / (1024 * 1024) / deltaT).toFixed(1)} MB/s`;
      }
    }

    // Store current state for next calculation
    await redis.set('metrics:last_capture', JSON.stringify({
      time: now,
      upload: uploadBytesTotal,
      download: downloadBytesTotal
    }), { ex: 3600 });

    const totalFiles = (await redis.keys('file:*')).length || 0;

    const apiLatency = Date.now() - startTime;

    const metrics = {
      upload_speed: uploadSpeed,
      download_speed: downloadSpeed,
      active_transfers: Math.max(0, activeTransfers),
      total_files: totalFiles,
      api_latency: `${apiLatency}ms`,
    };

    return res.status(200).json({
      status: (storageStatus === 'operational' && scannerStatus === 'operational') ? 'healthy' : 'degraded',
      timestamp: now,
      services: {
        api: 'healthy',
        s3: storageStatus,
        storage: storageStatus,
        redis: 'connected',
        scanner: scannerStatus,
        cdn: 'active',
      },
      metrics,
    });
  } catch (error: any) {
    console.error('CRITICAL: Health check failed:', error);
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

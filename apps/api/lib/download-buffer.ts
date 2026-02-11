import { Octokit } from '@octokit/rest';
import * as pako from 'pako';
import type { StoredMetadata } from './redis.js';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_OWNER = process.env.GITHUB_STORAGE_OWNER || 'duckyoo9';
const GITHUB_REPO = process.env.GITHUB_STORAGE_REPO || 'fileduck-storage';

export async function fetchDownloadBuffer(metadata: StoredMetadata): Promise<Buffer | null> {
  if (!metadata.downloadUrl && !metadata.githubReleaseId) {
    return null;
  }

  // Non-GitHub URL: return null (handled by caller)
  if (metadata.downloadUrl && !metadata.downloadUrl.includes('github.com')) {
    return null;
  }

  let buffer: Buffer | null = null;

  // Try direct download URL first (works for public repos)
  if (metadata.downloadUrl) {
    const response = await fetch(metadata.downloadUrl, {
      headers: {
        'User-Agent': 'FileDuck/1.0',
        'Accept': 'application/octet-stream',
      },
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
  }

  // If direct fetch failed, try GitHub API with token
  if (!buffer && metadata.githubReleaseId) {
    if (!process.env.GITHUB_TOKEN) {
      return null;
    }

    const assets = await octokit.rest.repos.listReleaseAssets({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      release_id: metadata.githubReleaseId,
      per_page: 100,
    });

    const baseName = metadata.filename;
    const matchingAssets = assets.data.filter(asset => asset.name.startsWith(baseName));

    if (matchingAssets.length === 0 && assets.data.length > 0) {
      matchingAssets.push(assets.data[0]);
    }

    if (matchingAssets.length === 0) {
      return null;
    }

    const isChunked = matchingAssets.some(asset => /\.part\d+/i.test(asset.name));
    const isCompressed = matchingAssets.some(asset => asset.name.endsWith('.gz'));

    if (isChunked) {
      const sortedAssets = matchingAssets
        .map(asset => ({
          asset,
          part: parseInt((asset.name.match(/\.part(\d+)/i) || [])[1] || '0', 10),
        }))
        .sort((a, b) => a.part - b.part);

      const buffers: Buffer[] = [];
      for (const item of sortedAssets) {
        const assetResponse = await octokit.request(
          'GET /repos/{owner}/{repo}/releases/assets/{asset_id}',
          {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            asset_id: item.asset.id,
            headers: { accept: 'application/octet-stream' },
          }
        );
        const assetBuffer = Buffer.isBuffer(assetResponse.data)
          ? assetResponse.data
          : Buffer.from(assetResponse.data as any);
        buffers.push(assetBuffer);
      }

      buffer = Buffer.concat(buffers);
    } else {
      const asset = matchingAssets[0];
      const assetResponse = await octokit.request(
        'GET /repos/{owner}/{repo}/releases/assets/{asset_id}',
        {
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          asset_id: asset.id,
          headers: { accept: 'application/octet-stream' },
        }
      );
      buffer = Buffer.isBuffer(assetResponse.data)
        ? assetResponse.data
        : Buffer.from(assetResponse.data as any);
    }

    if (buffer && isCompressed) {
      try {
        buffer = Buffer.from(pako.inflate(buffer));
      } catch {
        // Return raw data if decompression fails
      }
    }
  }

  return buffer;
}

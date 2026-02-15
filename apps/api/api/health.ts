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
    } catch (e) {
      console.warn('Storage health check failed:', e);
    }

    // Mock metrics for now - could be pulled from Redis counters in future
    const metrics = {
      upload_speed: '4.2 MB/s',
      download_speed: '12.8 MB/s',
      active_transfers: Math.floor(Math.random() * 5) + 1,
      total_files: 1024, // Example static
    };

    return res.status(200).json({
      status: 'healthy',
      timestamp: Date.now(),
      services: {
        api: 'healthy',
        redis: 'connected',
        storage: storageStatus,
        cdn: 'active',
      },
      metrics,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

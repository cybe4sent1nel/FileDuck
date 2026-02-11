import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - lib files are compiled separately
import redis from '../lib/redis.js';

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

    // Check S3 connection (optional)
    // const s3Status = await checkS3Connection();

    return res.status(200).json({
      status: 'healthy',
      timestamp: Date.now(),
      services: {
        redis: 'connected',
        s3: 'not_checked',
        cdn: 'not_checked',
      },
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

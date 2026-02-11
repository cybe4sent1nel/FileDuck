import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateShareCode } from '@fileduck/shared';
import { getMetadata } from '../lib/redis.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shareCode } = req.body;

    // Validation
    if (!shareCode || !validateShareCode(shareCode)) {
      return res.status(400).json({
        error: 'Invalid share code format',
        code: 'INVALID_CODE',
      });
    }

    // Get metadata from Redis
    const metadata = await getMetadata(shareCode);

    if (!metadata) {
      return res.status(404).json({
        error: 'Share code not found or expired',
        code: 'NOT_FOUND',
      });
    }

    // Return relevant metadata (don't expose sensitive info like s3Key)
    return res.status(200).json({
      filename: metadata.filename,
      size: metadata.size,
      expiresAt: metadata.expiresAt,
      maxUses: metadata.maxUses,
      usesLeft: metadata.usesLeft,
      uploadedAt: metadata.uploadedAt,
      scanStatus: metadata.scanStatus,
    });
  } catch (error: any) {
    console.error('Get metadata error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}

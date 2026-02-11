import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMetadata, decrementUses } from '../lib/redis.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shareCode } = req.body;

    if (!shareCode) {
      return res.status(400).json({
        error: 'Missing shareCode',
        code: 'INVALID_REQUEST',
      });
    }

    // Get current metadata
    const metadata = await getMetadata(shareCode);

    if (!metadata) {
      return res.status(404).json({
        error: 'File not found',
        code: 'NOT_FOUND',
      });
    }

    // Decrement uses atomically
    const updatedMetadata = await decrementUses(shareCode);

    if (!updatedMetadata) {
      return res.status(500).json({
        error: 'Failed to process download',
        code: 'SERVER_ERROR',
      });
    }

    console.log(`✅ Download confirmed for ${metadata.filename}, uses left: ${updatedMetadata.usesLeft}`);

    // SECURITY: Auto-delete if download limit reached
    if (updatedMetadata.usesLeft <= 0 && metadata.githubReleaseId) {
      try {
        // Import cleanup function
        const { cleanupSpecificFile } = await import('../lib/cleanup.js');
        await cleanupSpecificFile(shareCode);
        console.log(`Auto-deleted file ${metadata.filename} - download limit reached`);
      } catch (error: any) {
        console.error('Failed to auto-delete after download limit:', error);
      }
    }

    return res.status(200).json({
      success: true,
      usesLeft: updatedMetadata.usesLeft,
      message: updatedMetadata.usesLeft === 0 ? 'File has been deleted' : 'Download confirmed',
    });
  } catch (error: any) {
    console.error('Confirm download error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      details: error.message,
    });
  }
}

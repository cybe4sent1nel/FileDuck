import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMetadata, deleteMetadata } from '../lib/redis.js';
import { cleanupSpecificFile } from '../lib/cleanup.js';

/**
 * DELETE /api/delete-file
 * Delete file from storage and Redis
 */
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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shareCode } = req.body;

    console.log('🗑️ Delete request for shareCode:', shareCode);

    if (!shareCode) {
      return res.status(400).json({
        error: 'Missing shareCode',
        code: 'INVALID_REQUEST',
      });
    }

    // Get metadata to check if file exists
    const metadata = await getMetadata(shareCode);
    console.log('📋 Metadata found:', { 
      filename: metadata?.filename, 
      githubReleaseId: metadata?.githubReleaseId,
      isDeleted: metadata?.isDeleted 
    });
    
    if (!metadata) {
      console.log('❌ File not found in Redis');
      return res.status(404).json({
        error: 'File not found',
        code: 'NOT_FOUND',
      });
    }

    // Delete from storage (GitHub Releases or S3)
    console.log('🚀 Attempting to delete from storage...');
    const deletedFromStorage = await cleanupSpecificFile(shareCode);
    console.log('✅ Deleted from storage:', deletedFromStorage);

    // Delete from Redis
    console.log('🗑️ Deleting from Redis...');
    await deleteMetadata(shareCode);
    console.log('✅ Deleted from Redis');

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      deletedFromStorage,
      filename: metadata.filename,
    });
  } catch (error: any) {
    console.error('Delete file error:', error);
    return res.status(500).json({
      error: 'Failed to delete file',
      code: 'SERVER_ERROR',
      details: error.message,
    });
  }
}

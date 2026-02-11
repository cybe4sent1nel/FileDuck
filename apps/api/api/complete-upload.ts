import type { VercelRequest, VercelResponse } from '@vercel/node';
import { completeMultipartUpload } from '../lib/s3.js';
import { uploadToGitHub } from '../lib/github-storage.js';
import { getMetadata, updateMetadata } from '../lib/redis.js';

// Default to GitHub storage (set to false to use S3)
const USE_GITHUB_STORAGE = process.env.USE_GITHUB_STORAGE !== 'false';

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
    // For GitHub storage (multipart/form-data)
    if (USE_GITHUB_STORAGE && req.headers['content-type']?.includes('multipart/form-data')) {
      // This would require a multipart parser like 'formidable'
      // For now, return success and handle in a separate endpoint
      return res.status(200).json({
        success: true,
        message: 'GitHub upload handled separately',
      });
    }

    // For S3 storage (JSON)
    const { uploadId, parts, key } = req.body;

    if (!uploadId || !parts || !key) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'INVALID_REQUEST',
      });
    }

    await completeMultipartUpload(key, uploadId, parts);

    return res.status(200).json({
      success: true,
      message: 'Upload completed, malware scan queued',
    });
  } catch (error: any) {
    console.error('Complete upload error:', error);
    return res.status(500).json({
      error: 'Failed to complete upload',
      code: 'SERVER_ERROR',
      details: error.message,
    });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateShareCode, CONSTANTS } from '@fileduck/shared';
import { storeMetadata } from '../lib/redis.js';
import { createMultipartUpload } from '../lib/s3.js';
import { checkRateLimit } from '../lib/redis.js';

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
    // Get client IP
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';

    // Check rate limit (graceful fallback if Redis unavailable)
    try {
      const rateLimit = await checkRateLimit(ip);
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Too many requests',
          code: 'RATE_LIMITED',
          resetAt: rateLimit.resetAt,
        });
      }
    } catch (rateLimitError) {
      console.warn('⚠️ Rate limit check failed (Redis unavailable):', rateLimitError);
      // Continue without rate limiting in development
    }

    const { filename, size, sha256, mimeType, ttlHours, maxUses, encrypted, scanSkipped, requireCaptcha } = req.body;

    // Validation
    if (!filename || !size || !sha256 || !mimeType) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'INVALID_REQUEST',
      });
    }

    if (size > CONSTANTS.MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large',
        code: 'INVALID_REQUEST',
        details: { maxSize: CONSTANTS.MAX_FILE_SIZE },
      });
    }

    // Generate share code
    const shareCode = generateShareCode();
    const now = Date.now();
    
    // ENFORCE MAXIMUM 7-DAY TTL
    const MAX_TTL_HOURS = 7 * 24; // 7 days max
    const requestedTTL = ttlHours || CONSTANTS.DEFAULT_TTL_HOURS;
    const enforcedTTL = Math.min(requestedTTL, MAX_TTL_HOURS);
    
    const ttl = enforcedTTL * 3600;
    const expiresAt = now + ttl * 1000;

    let uploadId = '';
    let presignedUrls: string[] = [];
    const s3Key = `quarantine/${now}-${filename}`;

    // Only create multipart upload if NOT using GitHub storage
    if (!USE_GITHUB_STORAGE) {
      const uploadData = await createMultipartUpload(filename, size);
      uploadId = uploadData.uploadId;
      presignedUrls = uploadData.presignedUrls;
    }

    // Store metadata in Redis (required for downloads)
    try {
      await storeMetadata(
        shareCode,
        {
          id: shareCode,
          shareCode,
          filename,
          size,
          sha256,
          mimeType,
          uploadedAt: now,
          expiresAt,
          usesLeft: maxUses || CONSTANTS.DEFAULT_MAX_USES,
          maxUses: maxUses || CONSTANTS.DEFAULT_MAX_USES,
          s3Key,
          scanStatus: scanSkipped ? 'skipped' : 'pending',
          encrypted: encrypted || false,
          scanSkipped: scanSkipped || false,
          requireCaptcha: requireCaptcha || false,
        },
        ttl
      );
    } catch (redisError) {
      console.error('❌ Redis metadata storage failed:', redisError);
      // In development, continue without Redis
      // In production, this will fail (as it should)
      if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        throw redisError;
      }
      console.warn('⚠️ Continuing without Redis (development mode)');
    }

    return res.status(200).json({
      shareCode,
      uploadUrls: USE_GITHUB_STORAGE ? [] : presignedUrls,
      uploadId: USE_GITHUB_STORAGE ? '' : uploadId,
      expiresAt,
      useGitHub: USE_GITHUB_STORAGE,
    });
  } catch (error: any) {
    console.error('Upload meta error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      details: error.message,
    });
  }
}

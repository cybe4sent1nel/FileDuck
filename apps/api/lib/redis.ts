import { Redis } from '@upstash/redis';

// Initialize Upstash Redis with REST API (works on Vercel)
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use REST API endpoints for Vercel/serverless
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('✓ Upstash Redis connected via REST API');
  } else if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    // Fallback to regular URL (legacy support)
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    console.log('✓ Upstash Redis connected');
  } else {
    console.warn('⚠ Redis not configured - operations will be skipped');
  }
} catch (error) {
  console.error('❌ Redis initialization failed:', error);
  redis = null;
}

// Helper to check if Redis is available
const isRedisAvailable = () => redis !== null;

export interface StoredMetadata {
  id: string;
  shareCode: string;
  filename: string;
  size: number;
  sha256: string;
  mimeType: string;
  uploadedAt: number;
  expiresAt: number;
  usesLeft: number;
  maxUses: number;
  s3Key: string;
  scanStatus: 'pending' | 'scanning' | 'clean' | 'infected' | 'error' | 'skipped';
  encrypted: boolean;
  scanSkipped?: boolean;
  requireCaptcha?: boolean; // If true, always require captcha for downloads
  downloadUrl?: string; // For GitHub storage
  githubReleaseId?: number; // For GitHub storage cleanup
  githubMetadata?: any; // GitHub upload metadata (chunks, compression, etc.)
  isDeleted?: boolean; // For soft delete tracking
  deletedAt?: number; // Timestamp when deleted
}

export async function storeMetadata(
  shareCode: string,
  metadata: StoredMetadata,
  ttlSeconds: number
): Promise<void> {
  if (!redis) {
    const errorMsg = 'Redis not configured - cannot store metadata';
    console.error('❌', errorMsg);
    // Throw error so caller can handle it appropriately
    throw new Error(errorMsg);
  }
  
  try {
    await redis.setex(shareCode, ttlSeconds, JSON.stringify(metadata));
    console.log(`✓ Metadata stored for ${shareCode}, TTL: ${ttlSeconds}s`);
  } catch (error) {
    console.error('Failed to store metadata:', error);
    throw error;
  }
}

export async function getMetadata(shareCode: string): Promise<StoredMetadata | null> {
  if (!redis) {
    console.warn('Redis not available, cannot get metadata for:', shareCode);
    return null;
  }
  
  try {
    const data = await redis.get(shareCode);
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) as StoredMetadata : data as StoredMetadata;
  } catch (error) {
    console.error('Failed to get metadata:', error);
    return null;
  }
}

export async function decrementUses(shareCode: string): Promise<StoredMetadata | null> {
  if (!redis) return null;
  
  try {
    const metadata = await getMetadata(shareCode);
    if (!metadata) return null;

    if (metadata.usesLeft <= 1) {
      // Last use - delete the key
      await redis.del(shareCode);
      return { ...metadata, usesLeft: 0 };
    }

    // Decrement uses
    metadata.usesLeft--;
    const ttl = await redis.ttl(shareCode);
    await redis.setex(shareCode, ttl > 0 ? ttl : 86400, JSON.stringify(metadata));

    return metadata;
  } catch (error) {
    console.error('Failed to decrement uses:', error);
    return null;
  }
}

export async function updateScanStatus(
  shareCode: string,
  status: 'pending' | 'scanning' | 'clean' | 'infected' | 'error'
): Promise<void> {
  if (!redis) return;
  
  try {
    const metadata = await getMetadata(shareCode);
    if (!metadata) return;

    metadata.scanStatus = status;
    const ttl = await redis.ttl(shareCode);
    await redis.setex(shareCode, ttl > 0 ? ttl : 86400, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to update scan status:', error);
  }
}

export async function updateMetadata(
  shareCode: string,
  updates: Partial<StoredMetadata>
): Promise<void> {
  if (!redis) return;
  
  try {
    const metadata = await getMetadata(shareCode);
    if (!metadata) return;

    const updatedMetadata = { ...metadata, ...updates };
    const ttl = await redis.ttl(shareCode);
    await redis.setex(shareCode, ttl > 0 ? ttl : 86400, JSON.stringify(updatedMetadata));
  } catch (error) {
    console.error('Failed to update metadata:', error);
  }
}

// Rate limiting
export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  if (!redis) {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 };
  }
  
  try {
    const key = `ratelimit:${ip}`;
    const now = Date.now();
    const window = 60 * 1000; // 1 minute
    const maxRequests = 10;

    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.pexpire(key, window);
    }

    const ttl = await redis.pttl(key);
    const resetAt = now + (ttl > 0 ? ttl : window);

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60000 };
  }
}

export async function trackFailedAttempt(ip: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `failed:${ip}`;
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, 3600); // 1 hour
    }

    return count;
  } catch (error) {
    console.error('Failed to track failed attempt:', error);
    return 0;
  }
}

/**
 * Delete metadata from Redis
 */
export async function deleteMetadata(shareCode: string): Promise<boolean> {
  if (!redis) {
    console.warn('Redis not available, cannot delete metadata for:', shareCode);
    return false;
  }
  
  try {
    const result = await redis.del(shareCode);
    console.log(`✓ Metadata deleted for ${shareCode}`);
    return result > 0;
  } catch (error) {
    console.error('Failed to delete metadata:', error);
    return false;
  }
}

/**
 * Get all keys matching a pattern (for cleanup operations)
 */
export async function getAllKeys(pattern: string = '*'): Promise<string[]> {
  if (!redis) {
    console.warn('Redis not available, cannot get keys');
    return [];
  }
  
  try {
    const keys = await redis.keys(pattern);
    return keys;
  } catch (error) {
    console.error('Failed to get keys:', error);
    return [];
  }
}

export default redis;

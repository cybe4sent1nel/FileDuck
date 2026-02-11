/**
 * File Cleanup Utilities
 * Handles deletion of expired files from GitHub Releases
 */

import { Octokit } from '@octokit/rest';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_OWNER = process.env.GITHUB_STORAGE_OWNER || 'duckyoo9';
const GITHUB_REPO = process.env.GITHUB_STORAGE_REPO || 'fileduck-storage';

interface FileMetadata {
  shareCode: string;
  filename: string;
  size: number;
  createdAt: number;
  expiresAt: number;
  maxUses: number;
  usesLeft: number;
  githubReleaseId?: number;
  isDeleted?: boolean;
  s3Key?: string;
  downloadUrl?: string;
}

/**
 * Delete specific file from GitHub Releases
 */
export async function cleanupSpecificFile(shareCode: string): Promise<boolean> {
  try {
    console.log(`🔍 Looking for file with shareCode: ${shareCode}`);
    
    // Try both key formats for backward compatibility
    let metadata = await redis.get<FileMetadata>(shareCode);
    
    if (!metadata) {
      metadata = await redis.get<FileMetadata>(`file:${shareCode}`);
      console.log(`📋 Tried file:${shareCode} format, found:`, !!metadata);
    }
    
    if (!metadata || metadata.isDeleted) {
      console.log(`❌ File ${shareCode} already deleted or not found`);
      return false;
    }

    console.log(`📦 File metadata:`, {
      filename: metadata.filename,
      githubReleaseId: metadata.githubReleaseId,
      isDeleted: metadata.isDeleted
    });

    if (metadata.githubReleaseId) {
      try {
        console.log(`🗑️ Attempting to delete GitHub release ${metadata.githubReleaseId}...`);
        
        // Delete from GitHub Releases
        await octokit.repos.deleteRelease({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          release_id: metadata.githubReleaseId,
        });

        console.log(`✅ Deleted GitHub release ${metadata.githubReleaseId} for file ${metadata.filename}`);
      } catch (error: any) {
        // If release not found (404), that's okay - it's already deleted
        if (error.status !== 404) {
          throw error;
        }
      }

      // Mark as deleted in Redis (keep metadata for history)
      await redis.set(shareCode, {
        ...metadata,
        isDeleted: true,
        deletedAt: Date.now(),
      }, { ex: 86400 }); // Keep for 24 hours for audit

      return true;
    }

    return false;
  } catch (error: any) {
    console.error(`Failed to cleanup file ${shareCode}:`, error);
    return false;
  }
}

/**
 * Clean up all expired files
 */
export async function cleanupExpiredFiles(): Promise<string[]> {
  const deletedFiles: string[] = [];
  const now = Date.now();

  try {
    // Get all file metadata from Redis
    // Try to get all keys (both with and without 'file:' prefix)
    const allKeys = await redis.keys('*');
    
    for (const key of allKeys) {
      // Skip rate limit and failed attempt keys
      if (key.startsWith('ratelimit:') || key.startsWith('failed:')) {
        continue;
      }
      
      const metadata = await redis.get<FileMetadata>(key);
      
      if (!metadata || metadata.isDeleted) {
        continue;
      }

      // Check if file should be deleted
      const shouldDelete = 
        metadata.expiresAt < now || // Expired by time
        metadata.usesLeft <= 0; // Download limit reached

      if (shouldDelete) {
        const shareCode = key.replace('file:', ''); // Handle both formats
        const success = await cleanupSpecificFile(shareCode);
        
        if (success) {
          deletedFiles.push(metadata.filename);
        }
      }
    }

    console.log(`Cleanup complete: ${deletedFiles.length} files deleted`);
    return deletedFiles;
  } catch (error: any) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

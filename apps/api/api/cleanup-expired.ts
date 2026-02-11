/**
 * Cleanup Expired Files from GitHub Releases
 * Automatically deletes files after 7 days or when download limit reached
 */

import { Redis } from '@upstash/redis';
import { Octokit } from '@octokit/rest';

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
}

/**
 * Main cleanup function - deletes expired files from GitHub
 */
export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deletedFiles = await cleanupExpiredFiles();

    return res.status(200).json({
      success: true,
      deletedCount: deletedFiles.length,
      deletedFiles: deletedFiles,
    });
  } catch (error: any) {
    console.error('Cleanup failed:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Clean up expired files from GitHub Releases
 */
async function cleanupExpiredFiles(): Promise<string[]> {
  const deletedFiles: string[] = [];
  const now = Date.now();

  try {
    // Get all file metadata from Redis
    const allKeys = await redis.keys('file:*');
    
    for (const key of allKeys) {
      const metadata = await redis.get<FileMetadata>(key);
      
      if (!metadata || metadata.isDeleted) {
        continue;
      }

      // Check if file should be deleted
      const shouldDelete = 
        metadata.expiresAt < now || // Expired by time
        metadata.usesLeft <= 0; // Download limit reached

      if (shouldDelete && metadata.githubReleaseId) {
        try {
          // Delete from GitHub Releases
          await octokit.repos.deleteRelease({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            release_id: metadata.githubReleaseId,
          });

          console.log(`Deleted GitHub release ${metadata.githubReleaseId} for file ${metadata.filename}`);

          // Mark as deleted in Redis (keep metadata for history)
          await redis.set(key, {
            ...metadata,
            isDeleted: true,
            deletedAt: now,
          });

          deletedFiles.push(metadata.filename);
        } catch (error: any) {
          console.error(`Failed to delete release ${metadata.githubReleaseId}:`, error.message);
          
          // If release not found (404), mark as deleted anyway
          if (error.status === 404) {
            await redis.set(key, {
              ...metadata,
              isDeleted: true,
              deletedAt: now,
            });
            deletedFiles.push(metadata.filename);
          }
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

/**
 * Manual cleanup function for testing
 */
export async function cleanupSpecificFile(shareCode: string): Promise<boolean> {
  try {
    const metadata = await redis.get<FileMetadata>(`file:${shareCode}`);
    
    if (!metadata || metadata.isDeleted) {
      return false;
    }

    if (metadata.githubReleaseId) {
      await octokit.repos.deleteRelease({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        release_id: metadata.githubReleaseId,
      });

      await redis.set(`file:${shareCode}`, {
        ...metadata,
        isDeleted: true,
        deletedAt: Date.now(),
      });

      return true;
    }

    return false;
  } catch (error: any) {
    console.error(`Failed to cleanup file ${shareCode}:`, error);
    return false;
  }
}

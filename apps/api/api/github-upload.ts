import type { VercelRequest, VercelResponse } from '@vercel/node';
import { uploadToGitHub } from '../lib/github-storage.js';
import { updateMetadata } from '../lib/redis.js';
import busboy from 'busboy';

const USE_GITHUB_STORAGE = process.env.USE_GITHUB_STORAGE !== 'false';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Store chunks temporarily in memory (for Railway/Vercel serverless)
const chunkStore = new Map<string, { chunks: Buffer[]; totalChunks: number; filename: string; sha256: string }>();

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
    // Parse multipart/form-data
    const result = await parseMultipartForm(req);
    const { shareCode, fileBuffer, filename, sha256, chunkIndex, totalChunks, isLastChunk } = result;

    if (!shareCode || !fileBuffer) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'INVALID_REQUEST',
      });
    }

    // Handle chunked uploads
    if (totalChunks > 1) {
      // Initialize chunk storage for this upload
      if (!chunkStore.has(shareCode)) {
        chunkStore.set(shareCode, { chunks: [], totalChunks, filename, sha256 });
      }

      const uploadData = chunkStore.get(shareCode)!;
      uploadData.chunks[chunkIndex] = fileBuffer;

      console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for ${filename} (${fileBuffer.length} bytes)`);

      // If not the last chunk, just acknowledge receipt
      if (!isLastChunk) {
        return res.status(200).json({
          success: true,
          message: `Chunk ${chunkIndex + 1}/${totalChunks} received`,
          chunkIndex,
        });
      }

      // Last chunk received - combine all chunks
      console.log(`Combining ${totalChunks} chunks for ${filename}...`);
      const completeFile = Buffer.concat(uploadData.chunks);
      chunkStore.delete(shareCode); // Clean up

      // Proceed with upload
      if (USE_GITHUB_STORAGE && IS_PRODUCTION) {
        console.log(`Uploading ${filename} to GitHub (${completeFile.length} bytes)...`);
      
        const result = await uploadToGitHub(filename, completeFile, sha256);
        
        // Update Redis metadata with GitHub download URL and release ID
        await updateMetadata(shareCode, {
          downloadUrl: result.downloadUrl,
          githubReleaseId: result.metadata.releaseId,
          githubMetadata: result.metadata,
          scanStatus: 'clean',
        });

        console.log(`✓ File uploaded to GitHub: ${result.downloadUrl}`);

        return res.status(200).json({
          success: true,
          message: 'File uploaded to GitHub',
          downloadUrl: result.downloadUrl,
        });
      }
    } else {
      // Single chunk upload (file ≤8MB)
      if (USE_GITHUB_STORAGE && IS_PRODUCTION) {
        console.log(`Uploading ${filename} to GitHub (${fileBuffer.length} bytes)...`);
        
        const result = await uploadToGitHub(filename, fileBuffer, sha256);
        
        await updateMetadata(shareCode, {
          downloadUrl: result.downloadUrl,
          githubReleaseId: result.metadata.releaseId,
          githubMetadata: result.metadata,
          scanStatus: 'clean',
        });

        console.log(`✓ File uploaded to GitHub: ${result.downloadUrl}`);

        return res.status(200).json({
          success: true,
          message: 'File uploaded to GitHub',
          downloadUrl: result.downloadUrl,
        });
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'File received',
    });
  } catch (error: any) {
    console.error('GitHub upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload file',
      code: 'SERVER_ERROR',
      details: error.message,
    });
  }
}

// Helper function to parse multipart/form-data
function parseMultipartForm(req: VercelRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers as any });
    const fields: any = {};
    let fileBuffer: Buffer | null = null;

    bb.on('file', (name, file, info) => {
      const chunks: Buffer[] = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('finish', () => {
      resolve({
        ...fields,
        fileBuffer,
        chunkIndex: parseInt(fields.chunkIndex || '0'),
        totalChunks: parseInt(fields.totalChunks || '1'),
        isLastChunk: fields.isLastChunk === 'true',
      });
    });

    bb.on('error', reject);

    // Pipe request to busboy
    if (req.body && Buffer.isBuffer(req.body)) {
      bb.write(req.body);
      bb.end();
    } else {
      (req as any).pipe(bb);
    }
  });
}

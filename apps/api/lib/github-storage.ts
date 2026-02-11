import { Octokit } from '@octokit/rest';
import axios from 'axios';
import * as pako from 'pako';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const GITHUB_OWNER = process.env.GITHUB_STORAGE_OWNER || 'duckyoo9';
const GITHUB_REPO = process.env.GITHUB_STORAGE_REPO || 'fileduck-storage';
const CHUNK_SIZE = parseInt(process.env.GITHUB_CHUNK_SIZE || '1900000000'); // 1.9GB chunks (safe under 2GB)
const ENABLE_COMPRESSION = process.env.GITHUB_ENABLE_COMPRESSION !== 'false'; // Enabled by default

// Rate limiting to avoid GitHub API abuse detection
let uploadCount = 0;
let lastHourReset = Date.now();
const MAX_UPLOADS_PER_HOUR = parseInt(process.env.GITHUB_MAX_RELEASES_PER_HOUR || '10');

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - lastHourReset > 3600000) {
    uploadCount = 0;
    lastHourReset = now;
  }
  
  if (uploadCount >= MAX_UPLOADS_PER_HOUR) {
    return false;
  }
  
  uploadCount++;
  return true;
}

// Add random delays to avoid detection patterns
async function randomDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Upload file to GitHub with compression and chunking support
 */
export async function uploadToGitHub(
  filename: string,
  fileBuffer: Buffer,
  sha256: string
): Promise<{ downloadUrl: string; metadata: any }> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    // Add random delay to avoid detection
    await randomDelay();

    const fileSize = fileBuffer.length;
    const needsChunking = fileSize > CHUNK_SIZE;
    const shouldCompress = ENABLE_COMPRESSION && fileSize > 10 * 1024 * 1024; // Compress files > 10MB

    let processedBuffer = fileBuffer;
    let isCompressed = false;

    // Compress if beneficial using pako (deflate algorithm - works for all file types)
    if (shouldCompress) {
      console.log(`🗜️ Compressing file: ${filename} (${fileSize} bytes)`);
      try {
        // Use pako with maximum compression level (9)
        const compressed = Buffer.from(pako.deflate(fileBuffer, { level: 9 }));
        const compressionRatio = compressed.length / fileBuffer.length;
        
        // Only use compression if it saves at least 5%
        if (compressionRatio < 0.95) {
          processedBuffer = compressed;
          isCompressed = true;
          console.log(`✓ Compression saved ${((1 - compressionRatio) * 100).toFixed(1)}% (${fileBuffer.length} → ${compressed.length} bytes)`);
        } else {
          console.log(`⚠️ Compression ineffective (${(compressionRatio * 100).toFixed(1)}%), using original`);
        }
      } catch (error) {
        console.warn('⚠️ Compression failed, using original file:', error);
      }
    }

    if (!needsChunking) {
      // Single file upload
      return await uploadSingleFile(filename, processedBuffer, sha256, isCompressed);
    } else {
      // Multi-chunk upload
      return await uploadChunkedFile(filename, processedBuffer, sha256, isCompressed);
    }
  } catch (error: any) {
    console.error('GitHub upload error:', error);
    throw new Error(`Failed to upload to GitHub: ${error.message}`);
  }
}

async function uploadSingleFile(
  filename: string,
  fileBuffer: Buffer,
  sha256: string,
  isCompressed: boolean
): Promise<{ downloadUrl: string; metadata: any }> {
  const tag = `file-${Date.now()}-${sha256.substring(0, 8)}`;
  const actualFilename = isCompressed ? `${filename}.gz` : filename;
  
  const release = await octokit.repos.createRelease({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    tag_name: tag,
    name: filename,
    body: `SHA-256: ${sha256}\nSize: ${fileBuffer.length} bytes\nCompressed: ${isCompressed}\nUploaded: ${new Date().toISOString()}`,
    draft: false,
    prerelease: false,
  });

  const uploadResponse = await octokit.repos.uploadReleaseAsset({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    release_id: release.data.id,
    name: actualFilename,
    data: fileBuffer as unknown as string,
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': fileBuffer.length,
    },
  });
  
  // Verify the asset was uploaded
  if (!uploadResponse.data.browser_download_url) {
    throw new Error('GitHub asset upload failed - no download URL returned');
  }
  
  console.log(`✓ Asset uploaded: ${uploadResponse.data.browser_download_url}`);

  return {
    downloadUrl: uploadResponse.data.browser_download_url,
    metadata: {
      releaseId: release.data.id,
      tag,
      compressed: isCompressed,
      chunks: 1,
      originalFilename: filename,
    },
  };
}

async function uploadChunkedFile(
  filename: string,
  fileBuffer: Buffer,
  sha256: string,
  isCompressed: boolean
): Promise<{ downloadUrl: string; metadata: any }> {
  const tag = `chunked-${Date.now()}-${sha256.substring(0, 8)}`;
  const totalChunks = Math.ceil(fileBuffer.length / CHUNK_SIZE);
  
  console.log(`Uploading ${filename} in ${totalChunks} chunks`);

  const release = await octokit.repos.createRelease({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    tag_name: tag,
    name: `${filename} (Chunked)`,
    body: `SHA-256: ${sha256}\nTotal Size: ${fileBuffer.length} bytes\nChunks: ${totalChunks}\nCompressed: ${isCompressed}\nUploaded: ${new Date().toISOString()}`,
    draft: false,
    prerelease: false,
  });

  const chunkUrls: string[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileBuffer.length);
    const chunk = fileBuffer.slice(start, end);
    
    const chunkFilename = `${filename}.part${String(i + 1).padStart(3, '0')}${isCompressed ? '.gz' : ''}`;
    
    console.log(`Uploading chunk ${i + 1}/${totalChunks}: ${chunkFilename}`);

    // Add delay between chunks to avoid rate limiting
    if (i > 0) await randomDelay();

    const uploadResponse = await octokit.repos.uploadReleaseAsset({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      release_id: release.data.id,
      name: chunkFilename,
      data: chunk as any,
    });

    chunkUrls.push(uploadResponse.data.browser_download_url);
  }

  return {
    downloadUrl: chunkUrls[0], // First chunk URL as primary
    metadata: {
      releaseId: release.data.id,
      tag,
      compressed: isCompressed,
      chunks: totalChunks,
      chunkUrls,
      originalFilename: filename,
    },
  };
}

/**
 * Download file from GitHub (handles chunks and decompression)
 */
export async function downloadFromGitHub(
  downloadUrl: string,
  metadata: any
): Promise<Buffer> {
  try {
    if (metadata.chunks === 1) {
      // Single file download
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
      });
      let buffer = Buffer.from(response.data);
      
      // Decompress with pako if needed
      if (metadata.compressed) {
        console.log(`🗜️ Decompressing file (${buffer.length} bytes)`);
        try {
          buffer = Buffer.from(pako.inflate(buffer));
          console.log(`✓ Decompressed to ${buffer.length} bytes`);
        } catch (error) {
          console.error('⚠️ Decompression failed:', error);
          throw new Error('Failed to decompress file');
        }
      }
      
      return buffer;
    } else {
      // Multi-chunk download
      const chunks: Buffer[] = [];
      
      for (const chunkUrl of metadata.chunkUrls) {
        const response = await axios.get(chunkUrl, {
          responseType: 'arraybuffer',
        });
        chunks.push(Buffer.from(response.data));
      }
      
      let fullBuffer = Buffer.concat(chunks);
      
      // Decompress with pako if needed
      if (metadata.compressed) {
        console.log(`🗜️ Decompressing chunked file (${fullBuffer.length} bytes)`);
        try {
          fullBuffer = Buffer.from(pako.inflate(fullBuffer));
          console.log(`✓ Decompressed to ${fullBuffer.length} bytes`);
        } catch (error) {
          console.error('⚠️ Decompression failed:', error);
          throw new Error('Failed to decompress file');
        }
      }
      
      return fullBuffer;
    }
  } catch (error: any) {
    console.error('GitHub download error:', error);
    throw new Error(`Failed to download from GitHub: ${error.message}`);
  }
}

/**
 * Delete file from GitHub
 */
export async function deleteFromGitHub(releaseId: number): Promise<void> {
  try {
    await octokit.repos.deleteRelease({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      release_id: releaseId,
    });
  } catch (error: any) {
    console.error('GitHub delete error:', error);
    throw new Error(`Failed to delete from GitHub: ${error.message}`);
  }
}

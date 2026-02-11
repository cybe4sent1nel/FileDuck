import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';
import { validateShareCode } from '@fileduck/shared';
import { getMetadata } from '../lib/redis.js';
import { fetchDownloadBuffer } from '../lib/download-buffer.js';
import { generateSignedCDNUrl } from '../lib/cdn.js';
import { getPresignedDownloadUrl } from '../lib/s3.js';

const RAILWAY_SCANNER_URL = 'https://fileduck-scanner-production.up.railway.app';
const USE_CDN = process.env.USE_CDN === 'true';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shareCode } = req.body || {};

    if (!shareCode || !validateShareCode(shareCode)) {
      return res.status(400).json({ error: 'Invalid share code' });
    }

    const metadata = await getMetadata(shareCode);
    if (!metadata) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (metadata.expiresAt < Date.now()) {
      return res.status(410).json({ error: 'Share code has expired' });
    }

    // Verify scanner health
    try {
      await axios.get(`${RAILWAY_SCANNER_URL}/health`, { timeout: 5000 });
    } catch (healthError) {
      return res.status(503).json({
        error: 'Scanner unavailable',
        code: 'SCAN_UNAVAILABLE',
        message: 'Safety scan is temporarily unavailable. Please try again later.',
      });
    }

    let fileBuffer: Buffer | null = null;

    // GitHub/private repo path
    if (metadata.downloadUrl?.includes('github.com') || metadata.githubReleaseId) {
      fileBuffer = await fetchDownloadBuffer(metadata);
    } else {
      // Non-GitHub storage
      const downloadUrl = metadata.downloadUrl
        ? metadata.downloadUrl
        : USE_CDN
        ? generateSignedCDNUrl(metadata.s3Key)
        : await getPresignedDownloadUrl(metadata.s3Key);

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        return res.status(404).json({ error: 'Failed to fetch file for scanning' });
      }

      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    }

    if (!fileBuffer) {
      return res.status(404).json({ error: 'Failed to fetch file for scanning' });
    }

    // Send to scanner service
    const formData = new FormData();
    formData.append('file', Readable.from(fileBuffer), {
      filename: metadata.filename,
      contentType: metadata.mimeType || 'application/octet-stream',
      knownLength: fileBuffer.length,
    });
    formData.append('sha256', metadata.sha256);

    const scannerResponse = await axios.post(`${RAILWAY_SCANNER_URL}/scan`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 300000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return res.status(200).json({
      ...scannerResponse.data,
      scannedOnDemand: true,
    });
  } catch (error: any) {
    console.error('On-demand scan error:', error);
    return res.status(500).json({
      error: 'Scan failed',
      message: error.message,
    });
  }
}

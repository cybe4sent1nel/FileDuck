import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import { scanFileWithClamAV } from './clamav';
import { initScanner, scanFile } from './scanner';
import { Redis } from '@upstash/redis';
import { moveToPublicBucket, deleteFromQuarantine } from './s3-ops';
import fs from 'fs/promises';

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: '/tmp/' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const PORT = process.env.SCANNER_PORT || 4000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'malware-scanner' });
});

// Pre-upload scan endpoint (for files before they're uploaded to S3)
app.post('/scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log(`Pre-upload scan for file: ${req.file.originalname}`);

    // Scan with ClamAV
    const clamavResult = await scanFileWithClamAV(req.file.path);

    // Cleanup temp file
    await fs.unlink(req.file.path).catch(console.error);

    // Build response
    const result = {
      clean: !clamavResult.infected,
      decision: clamavResult.infected ? 'infected' : 'clean',
      clamav: clamavResult,
      score: clamavResult.infected ? 100 : 0,
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Pre-upload scan error:', error);
    
    // Cleanup temp file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    return res.status(500).json({
      error: 'Scan failed',
      details: error.message,
    });
  }
});

// Post-upload scan endpoint (called by API or queue processor for files already in S3)
app.post('/scan-s3', async (req, res) => {
  try {
    const { shareCode, s3Key, sha256 } = req.body;

    if (!shareCode || !s3Key || !sha256) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`Starting scan for ${shareCode}...`);

    // Update status to scanning
    await updateScanStatus(shareCode, 'scanning');

    // Perform scan
    const result = await scanFile(s3Key, sha256);

    console.log(`Scan result for ${shareCode}:`, result);

    if (result.clean) {
      // Move to public bucket
      const publicKey = await moveToPublicBucket(s3Key);
      await updateScanStatus(shareCode, 'clean', publicKey);

      return res.json({
        success: true,
        status: 'clean',
        result,
      });
    } else {
      // Delete infected file
      await deleteFromQuarantine(s3Key);
      await updateScanStatus(shareCode, 'infected');

      // Log security event
      console.warn(`MALWARE DETECTED: ${shareCode} - ${result.clamav.virus || 'Unknown'}`);

      return res.json({
        success: true,
        status: 'infected',
        result,
      });
    }
  } catch (error: any) {
    console.error('Scan error:', error);
    
    // Update status to error
    if (req.body.shareCode) {
      await updateScanStatus(req.body.shareCode, 'error');
    }

    return res.status(500).json({
      error: 'Scan failed',
      details: error.message,
    });
  }
});

async function updateScanStatus(
  shareCode: string,
  status: 'pending' | 'scanning' | 'clean' | 'infected' | 'error',
  newS3Key?: string
): Promise<void> {
  try {
    const data = await redis.get(shareCode);
    if (!data) return;

    const metadata = typeof data === 'string' ? JSON.parse(data) : data;
    metadata.scanStatus = status;
    
    if (newS3Key) {
      metadata.s3Key = newS3Key;
    }

    const ttl = await redis.ttl(shareCode);
    await redis.setex(shareCode, ttl > 0 ? ttl : 86400, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to update scan status:', error);
  }
}

// Start server
async function start() {
  try {
    // Initialize ClamAV
    await initScanner();

    app.listen(PORT, () => {
      console.log(`Scanner service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start scanner:', error);
    process.exit(1);
  }
}

start();

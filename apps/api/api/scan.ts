import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';
import crypto from 'crypto';
import FormData from 'form-data';

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || '';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';
const VIRUSTOTAL_THRESHOLD = 3; // If 3+ engines detect malware, flag as infected
const VIRUSTOTAL_MAX_SIZE = 32 * 1024 * 1024; // 32MB - VirusTotal free tier limit

const METADEFENDER_API_KEY = process.env.METADEFENDER_API_KEY || '';
const METADEFENDER_API_URL = 'https://api.metadefender.com/v4';
const METADEFENDER_MAX_SIZE = 100 * 1024 * 1024; // 100MB - MetaDefender free tier limit

// Railway scanner service
const RAILWAY_SCANNER_URL = 'https://fileduck-scanner-production.up.railway.app';

interface ScanResponse {
  clean: boolean;
  decision: 'clean' | 'infected' | 'suspicious' | 'skipped';
  clamav: {
    infected: boolean;
    virus?: string;
  };
  virustotal?: {
    positives: number;
    total: number;
  };
  score: number;
  skipped?: boolean;
  reason?: string;
  maxScanSize?: number;
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll use formidable
  },
};

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
    // Parse multipart form data
    // VirusTotal Free API limit is 32MB
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // Allow up to 100MB upload (will check actual size for scanning)
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const sha256Provided = Array.isArray(fields.sha256) ? fields.sha256[0] : fields.sha256;
    const skipScan = Array.isArray(fields.skipScan) ? fields.skipScan[0] === 'true' : fields.skipScan === 'true';

    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // If skipScan is requested, return immediately
    if (skipScan) {
      fs.unlinkSync(file.filepath);
      return res.status(200).json({
        status: 'skipped',
        decision: 'skipped',
        message: 'File scanning skipped by user',
        sha256: sha256Provided
      });
    }

    // Check file size and determine which scanner to use
    if (file.size > METADEFENDER_MAX_SIZE) {
      fs.unlinkSync(file.filepath);
      return res.status(413).json({ 
        error: 'File too large for scanning',
        message: 'Maximum file size for scanning is 100MB. Larger files will be uploaded without scanning.',
        maxSize: METADEFENDER_MAX_SIZE
      });
    }

    // Verify SHA256 hash
    const fileBuffer = fs.readFileSync(file.filepath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    if (sha256Provided && hash !== sha256Provided) {
      // Cleanup temp file
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'SHA256 hash mismatch' });
    }

    // For files >32MB, use ClamAV (Railway scanner)
    if (file.size > VIRUSTOTAL_MAX_SIZE) {
      try {
        // Verify Railway scanner health before sending
        await axios.get(`${RAILWAY_SCANNER_URL}/health`, { timeout: 5000 });

        // Forward file to Railway scanner service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath), {
          filename: file.originalFilename || 'file',
          contentType: file.mimetype || 'application/octet-stream'
        });
        
        if (sha256Provided) {
          formData.append('sha256', sha256Provided);
        }

        console.log(`Forwarding file to Railway ClamAV scanner...`);
        
        const scannerResponse = await axios.post(`${RAILWAY_SCANNER_URL}/scan`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 300000, // 5 minutes timeout for large files
        });

        // Cleanup temp file
        fs.unlinkSync(file.filepath);

        // Return the scanner response
        return res.status(200).json(scannerResponse.data);
      } catch (scannerError: any) {
        console.error('Railway ClamAV scanner error:', scannerError);

        // Cleanup temp file
        fs.unlinkSync(file.filepath);

        return res.status(503).json({
          error: 'Scanner unavailable',
          code: 'SCANNER_UNAVAILABLE',
          message: 'Large-file scanner is unavailable. Upload will proceed without scanning.',
        });
      }
    }

    // For files ≤32MB, use VirusTotal (fallback if VT key missing)
    let vtResult = null;
    let mdResult = null;

    console.log('Scanning file with VirusTotal...');
    vtResult = await scanWithVirusTotal(hash, file.filepath);

    // If VirusTotal is not configured or fails, try MetaDefender as fallback
    if (!vtResult) {
      console.log('VirusTotal unavailable, falling back to MetaDefender...');
      mdResult = await scanWithMetaDefender(file.filepath, hash);
    }

    // Cleanup temp file
    fs.unlinkSync(file.filepath);

    // Determine decision
    let decision: 'clean' | 'infected' | 'suspicious' = 'clean';
    let score = 0;

    if (vtResult) {
      score = vtResult.positives;
      if (vtResult.positives >= VIRUSTOTAL_THRESHOLD) {
        decision = 'infected';
      } else if (vtResult.positives > 0) {
        decision = 'suspicious';
      }
    } else if (mdResult) {
      score = mdResult.positives;
      if (mdResult.positives >= 3) { // Similar threshold
        decision = 'infected';
      } else if (mdResult.positives > 0) {
        decision = 'suspicious';
      }
    }

    const response: ScanResponse = {
      clean: decision === 'clean',
      decision,
      clamav: {
        infected: false, // ClamAV not available on serverless
      },
      virustotal: vtResult ? {
        positives: vtResult.positives,
        total: vtResult.total,
      } : mdResult ? {
        positives: mdResult.positives,
        total: mdResult.total,
      } : undefined,
      score,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Scan error:', error);
    return res.status(500).json({
      error: 'Scan failed',
      message: error.message,
    });
  }
}

async function scanWithVirusTotal(sha256: string, filePath: string): Promise<{ positives: number; total: number } | null> {
  if (!VIRUSTOTAL_API_KEY) {
    console.warn('VirusTotal API key not configured, skipping scan');
    return null;
  }

  try {
    // First, check if file hash is already known
    const hashReport = await getHashReport(sha256);
    if (hashReport) {
      return hashReport;
    }

    // File not in VT database, upload for scanning
    console.log('File not in VirusTotal database, uploading for scan...');
    const uploadResult = await uploadFileToVirusTotal(filePath);
    
    if (!uploadResult) {
      return null;
    }

    // Poll for results with timeout
    const analysisResult = await pollAnalysis(uploadResult.scanId, 30000); // 30 second timeout
    return analysisResult;
  } catch (error: any) {
    console.error('VirusTotal scan error:', error);
    return null; // Don't fail the entire scan if VT is down
  }
}

async function getHashReport(sha256: string): Promise<{ positives: number; total: number } | null> {
  try {
    const response = await axios.get(`${VIRUSTOTAL_API_URL}/files/${sha256}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      timeout: 10000,
    });

    const data = response.data.data;
    const stats = data.attributes.last_analysis_stats;

    return {
      positives: stats.malicious,
      total: stats.malicious + stats.undetected + stats.suspicious + stats.harmless,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      // File not found in VT database
      return null;
    }
    throw error;
  }
}

async function uploadFileToVirusTotal(filePath: string): Promise<{ scanId: string } | null> {
  try {
    // Get upload URL
    const urlResponse = await axios.get(`${VIRUSTOTAL_API_URL}/files/upload_url`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      timeout: 10000,
    });

    const uploadUrl = urlResponse.data.data;

    // Upload file
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const uploadResponse = await axios.post(uploadUrl, form, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000, // 2 minutes for upload
    });

    return {
      scanId: uploadResponse.data.data.id,
    };
  } catch (error: any) {
    console.error('VirusTotal upload error:', error);
    return null;
  }
}

async function pollAnalysis(analysisId: string, timeoutMs: number = 30000): Promise<{ positives: number; total: number } | null> {
  const startTime = Date.now();
  const pollInterval = 3000; // 3 seconds

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await axios.get(`${VIRUSTOTAL_API_URL}/analyses/${analysisId}`, {
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
        },
        timeout: 10000,
      });

      const data = response.data.data;
      const status = data.attributes.status;

      if (status === 'completed') {
        const stats = data.attributes.stats;
        return {
          positives: stats.malicious,
          total: stats.malicious + stats.undetected + stats.suspicious + stats.harmless,
        };
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error: any) {
      console.error('VirusTotal polling error:', error);
      return null;
    }
  }

  // Timeout reached
  console.warn('VirusTotal analysis timeout');
  return null;
}

async function scanWithMetaDefender(filePath: string, sha256: string): Promise<{ positives: number; total: number } | null> {
  if (!METADEFENDER_API_KEY) {
    console.warn('MetaDefender API key not configured');
    return null;
  }

  try {
    // First, check if file hash exists in MetaDefender database
    const hashReport = await getMetaDefenderHashReport(sha256);
    if (hashReport) {
      console.log('File found in MetaDefender hash database');
      return hashReport;
    }

    // Upload file for scanning
    console.log('Uploading file to MetaDefender...');
    const uploadResult = await uploadFileToMetaDefender(filePath);
    if (!uploadResult) {
      return null;
    }

    // Poll for results
    console.log('Polling MetaDefender for results...');
    const result = await pollMetaDefenderResults(uploadResult.data_id);
    return result;
  } catch (error: any) {
    console.error('MetaDefender scan error:', error);
    return null;
  }
}

async function getMetaDefenderHashReport(sha256: string): Promise<{ positives: number; total: number } | null> {
  try {
    const response = await axios.get(`${METADEFENDER_API_URL}/hash/${sha256}`, {
      headers: {
        'apikey': METADEFENDER_API_KEY,
      },
      timeout: 10000,
    });

    const scanResults = response.data.scan_results;
    if (scanResults && scanResults.scan_all_result_i !== undefined) {
      const totalEngines = scanResults.total_avs || 0;
      const detectedEngines = scanResults.total_detected_avs || 0;
      
      return {
        positives: detectedEngines,
        total: totalEngines,
      };
    }

    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Hash not found, need to upload file
      return null;
    }
    console.error('MetaDefender hash lookup error:', error);
    return null;
  }
}

async function uploadFileToMetaDefender(filePath: string): Promise<{ data_id: string } | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const response = await axios.post(`${METADEFENDER_API_URL}/file`, fileBuffer, {
      headers: {
        'apikey': METADEFENDER_API_KEY,
        'content-type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000, // 2 minutes for upload
    });

    return {
      data_id: response.data.data_id,
    };
  } catch (error: any) {
    console.error('MetaDefender upload error:', error);
    return null;
  }
}

async function pollMetaDefenderResults(dataId: string, timeoutMs: number = 60000): Promise<{ positives: number; total: number } | null> {
  const startTime = Date.now();
  const pollInterval = 3000; // 3 seconds

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await axios.get(`${METADEFENDER_API_URL}/file/${dataId}`, {
        headers: {
          'apikey': METADEFENDER_API_KEY,
        },
        timeout: 10000,
      });

      const scanResults = response.data.scan_results;
      const progress = scanResults?.progress_percentage;

      if (progress === 100) {
        const totalEngines = scanResults.total_avs || 0;
        const detectedEngines = scanResults.total_detected_avs || 0;
        
        return {
          positives: detectedEngines,
          total: totalEngines,
        };
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error: any) {
      console.error('MetaDefender polling error:', error);
      return null;
    }
  }

  // Timeout reached
  console.warn('MetaDefender scan timeout');
  return null;
}

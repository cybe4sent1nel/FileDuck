import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || '';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';

export interface VirusTotalResult {
  score: number; // X/70
  positives: number;
  scannedAt: number;
  permalink?: string;
  scanId?: string;
}

export async function scanFileWithVirusTotal(
  filePath: string,
  sha256: string
): Promise<VirusTotalResult | null> {
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

    // Upload file for scanning
    const uploadResult = await uploadFile(filePath);
    
    if (!uploadResult) {
      return null;
    }

    // Poll for results (can take time)
    const analysisResult = await pollAnalysis(uploadResult.scanId);

    return analysisResult;
  } catch (error: any) {
    console.error('VirusTotal scan error:', error);
    return null; // Don't fail the entire scan if VT is down
  }
}

async function getHashReport(sha256: string): Promise<VirusTotalResult | null> {
  try {
    const response = await axios.get(`${VIRUSTOTAL_API_URL}/files/${sha256}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    const data = response.data.data;
    const stats = data.attributes.last_analysis_stats;

    return {
      score: stats.malicious + stats.suspicious,
      positives: stats.malicious,
      scannedAt: Date.now(),
      permalink: `https://www.virustotal.com/gui/file/${sha256}`,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      // File not found, need to upload
      return null;
    }
    throw error;
  }
}

async function uploadFile(filePath: string): Promise<{ scanId: string } | null> {
  try {
    // Get upload URL
    const urlResponse = await axios.get(`${VIRUSTOTAL_API_URL}/files/upload_url`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    const uploadUrl = urlResponse.data.data;

    // Upload file
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const uploadResponse = await axios.post(uploadUrl, form, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
        ...form.getHeaders(),
      },
    });

    return {
      scanId: uploadResponse.data.data.id,
    };
  } catch (error: any) {
    console.error('VirusTotal upload error:', error);
    return null;
  }
}

async function pollAnalysis(
  scanId: string,
  maxAttempts = 10,
  delayMs = 15000
): Promise<VirusTotalResult | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(`${VIRUSTOTAL_API_URL}/analyses/${scanId}`, {
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY,
        },
      });

      const data = response.data.data;

      if (data.attributes.status === 'completed') {
        const stats = data.attributes.stats;
        const fileId = data.meta.file_info.sha256;

        return {
          score: stats.malicious + stats.suspicious,
          positives: stats.malicious,
          scannedAt: Date.now(),
          permalink: `https://www.virustotal.com/gui/file/${fileId}`,
          scanId,
        };
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    } catch (error: any) {
      console.error('VirusTotal poll error:', error);
      return null;
    }
  }

  console.warn('VirusTotal scan timed out');
  return null;
}

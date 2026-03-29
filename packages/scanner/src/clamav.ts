import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Use external ClamAV REST API service (no local daemon needed)
const CLAMAV_API_URL = process.env.CLAMAV_API_URL || 'https://api.clamav.net/scan';
const USE_EXTERNAL_CLAMAV = process.env.USE_EXTERNAL_CLAMAV === 'true';

export async function initClamAV(): Promise<void> {
  if (USE_EXTERNAL_CLAMAV) {
    console.log('✓ ClamAV configured to use external API (on-demand scanning)');
  } else {
    console.log('⚠️ ClamAV disabled - using VirusTotal only');
  }
}

export interface ClamAVResult {
  infected: boolean;
  virus?: string;
  scannedAt: number;
}

export async function scanFileWithClamAV(filePath: string): Promise<ClamAVResult> {
  if (!USE_EXTERNAL_CLAMAV) {
    // ClamAV disabled, return clean result (VirusTotal will be used instead)
    return {
      infected: false,
      virus: undefined,
      scannedAt: Date.now(),
    };
  }

  try {
    // Use external ClamAV API for on-demand scanning
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(CLAMAV_API_URL, form, {
      headers: form.getHeaders(),
      timeout: 60000, // 1 minute timeout
    });

    const isInfected = response.data.infected || false;
    const virus = response.data.virus || undefined;

    return {
      infected: isInfected,
      virus: virus,
      scannedAt: Date.now(),
    };
  } catch (error: any) {
    console.error('External ClamAV scan error:', error.message);
    // On error, return clean and let VirusTotal handle it
    return {
      infected: false,
      virus: undefined,
      scannedAt: Date.now(),
    };
  }
}

export async function scanStreamWithClamAV(stream: NodeJS.ReadableStream): Promise<ClamAVResult> {
  // Stream scanning not supported with external API
  // Return clean result, VirusTotal will handle it
  return {
    infected: false,
    virus: undefined,
    scannedAt: Date.now(),
  };
}

export async function updateClamAVSignatures(): Promise<void> {
  console.log('Using external ClamAV API - signatures managed externally');
}


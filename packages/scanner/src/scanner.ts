import { initClamAV, scanFileWithClamAV } from './clamav';
import { scanFileWithVirusTotal } from './virustotal';
import { downloadFromS3ToTemp, cleanupTempFile } from './storage';
import type { ClamAVResult } from './clamav';
import type { VirusTotalResult } from './virustotal';

export interface ScanResult {
  clean: boolean;
  clamav: ClamAVResult;
  virustotal?: VirusTotalResult;
  decision: 'clean' | 'infected' | 'suspicious';
  score: number;
}

const VIRUSTOTAL_THRESHOLD = 3; // If 3+ engines detect malware, flag as infected
const QUARANTINE_BUCKET = process.env.S3_BUCKET_QUARANTINE!;

export async function scanFile(s3Key: string, sha256: string): Promise<ScanResult> {
  let tempFile: string | null = null;

  try {
    // Download file from S3 quarantine bucket
    console.log(`Downloading ${s3Key} for scanning...`);
    tempFile = await downloadFromS3ToTemp(QUARANTINE_BUCKET, s3Key);

    // Scan with ClamAV (fast, local)
    console.log('Scanning with ClamAV...');
    const clamavResult = await scanFileWithClamAV(tempFile);

    // If ClamAV detects infection, no need to check VirusTotal
    if (clamavResult.infected) {
      return {
        clean: false,
        clamav: clamavResult,
        decision: 'infected',
        score: 100,
      };
    }

    // Scan with VirusTotal (optional, slower, more comprehensive)
    console.log('Scanning with VirusTotal...');
    const virusTotalResult = await scanFileWithVirusTotal(tempFile, sha256);

    // Determine final decision
    let decision: 'clean' | 'infected' | 'suspicious' = 'clean';
    let score = 0;

    if (virusTotalResult) {
      score = virusTotalResult.positives;

      if (virusTotalResult.positives >= VIRUSTOTAL_THRESHOLD) {
        decision = 'infected';
      } else if (virusTotalResult.positives > 0) {
        decision = 'suspicious';
      }
    }

    return {
      clean: decision === 'clean',
      clamav: clamavResult,
      virustotal: virusTotalResult || undefined,
      decision,
      score,
    };
  } finally {
    // Cleanup temp file
    if (tempFile) {
      await cleanupTempFile(tempFile);
    }
  }
}

export async function initScanner(): Promise<void> {
  console.log('Initializing malware scanner...');
  await initClamAV();
  console.log('Scanner ready');
}

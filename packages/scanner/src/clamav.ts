import NodeClam from 'clamscan';
import path from 'path';
import fs from 'fs/promises';

const CLAMAV_HOST = process.env.CLAMAV_HOST || '127.0.0.1';
const CLAMAV_PORT = parseInt(process.env.CLAMAV_PORT || '3310', 10);

let clamavScanner: NodeClam | null = null;

export async function initClamAV(): Promise<void> {
  try {
    clamavScanner = await new NodeClam().init({
      clamdscan: {
        host: CLAMAV_HOST,
        port: CLAMAV_PORT,
        timeout: 60000,
      },
      preference: 'clamdscan',
    });

    console.log('ClamAV scanner initialized');
  } catch (error) {
    console.error('Failed to initialize ClamAV:', error);
    throw error;
  }
}

export interface ClamAVResult {
  infected: boolean;
  virus?: string;
  scannedAt: number;
}

export async function scanFileWithClamAV(filePath: string): Promise<ClamAVResult> {
  if (!clamavScanner) {
    throw new Error('ClamAV scanner not initialized');
  }

  try {
    const { isInfected, viruses } = await clamavScanner.scanFile(filePath);

    return {
      infected: isInfected,
      virus: viruses && viruses.length > 0 ? viruses[0] : undefined,
      scannedAt: Date.now(),
    };
  } catch (error: any) {
    console.error('ClamAV scan error:', error);
    throw new Error(`ClamAV scan failed: ${error.message}`);
  }
}

export async function scanStreamWithClamAV(stream: NodeJS.ReadableStream): Promise<ClamAVResult> {
  if (!clamavScanner) {
    throw new Error('ClamAV scanner not initialized');
  }

  try {
    // @ts-ignore - clamscan types are not fully accurate
    const result: any = await clamavScanner.scanStream(stream);
    const isInfected = result?.isInfected || false;
    const viruses = result?.viruses || [];

    return {
      infected: isInfected,
      virus: viruses && viruses.length > 0 ? viruses[0] : undefined,
      scannedAt: Date.now(),
    };
  } catch (error: any) {
    console.error('ClamAV stream scan error:', error);
    throw new Error(`ClamAV scan failed: ${error.message}`);
  }
}

export async function updateClamAVSignatures(): Promise<void> {
  // This should be done via cron job or systemd timer
  // freshclam command updates virus definitions
  console.log('ClamAV signature update should be managed by system cron/timer');
}

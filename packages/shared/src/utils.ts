import { customAlphabet } from 'nanoid';

// Base62 alphabet (a-zA-Z0-9)
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Generate 8-10 character code = 47-59 bits entropy
const nanoid = customAlphabet(BASE62, 10);

export function generateShareCode(): string {
  return nanoid();
}

export function validateShareCode(code: string): boolean {
  // Must be 8-10 base62 characters
  return /^[0-9A-Za-z]{8,10}$/.test(code);
}

// Browser-only function - used in Vue app
export function computeSHA256(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof globalThis.window === 'undefined') {
      reject(new Error('computeSHA256 can only be used in browser environment'));
      return;
    }
    const reader = new (globalThis as any).FileReader();
    reader.onload = async (e: any) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function formatFileSize(bytes: number): string {
  // Handle undefined, null, NaN, or invalid values
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function formatTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return 'Expired';

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function sanitizeFilename(filename: string): string {
  // Remove potentially dangerous characters
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
}

export function isValidMimeType(mimeType: string): boolean {
  // Basic MIME type validation
  return /^[a-z]+\/[a-z0-9\-\+\.]+$/i.test(mimeType);
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export const CONSTANTS = {
  MIN_CODE_LENGTH: 8,
  MAX_CODE_LENGTH: 10,
  MIN_ENTROPY_BITS: 40,
  MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024, // 5 GB
  DEFAULT_TTL_HOURS: 24,
  DEFAULT_MAX_USES: 1,
  MULTIPART_CHUNK_SIZE: 500 * 1024 * 1024, // 500 MB chunks
  SIGNED_URL_EXPIRY: 3600, // 1 hour
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX: 10,
  CAPTCHA_THRESHOLD: 3, // Failed attempts before CAPTCHA
} as const;

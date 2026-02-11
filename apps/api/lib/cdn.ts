import * as crypto from 'crypto';

// Cloudflare CDN Configuration
const CLOUDFLARE_DOMAIN = process.env.CLOUDFLARE_DOMAIN || '';
const CLOUDFLARE_TOKEN = process.env.CLOUDFLARE_TOKEN || ''; // Cloudflare API Token
const CLOUDFLARE_SIGNING_KEY = process.env.CLOUDFLARE_SIGNING_KEY || ''; // For signed URLs

/**
 * Generate Cloudflare signed URL with expiration
 * Uses Cloudflare's URL signing for secure, time-limited access
 */
export function generateSignedCDNUrl(s3Key: string): string {
  if (!CLOUDFLARE_DOMAIN || !CLOUDFLARE_SIGNING_KEY) {
    throw new Error('Cloudflare configuration missing');
  }

  const url = `https://${CLOUDFLARE_DOMAIN}/${s3Key}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now (Unix timestamp)

  // Generate signature using HMAC-SHA256
  const urlToSign = `${url}?exp=${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', CLOUDFLARE_SIGNING_KEY)
    .update(urlToSign)
    .digest('base64url'); // base64url encoding (URL-safe)

  // Return signed URL with expiration and signature
  return `${url}?exp=${expiresAt}&sig=${signature}`;
}

/**
 * Generate Cloudflare signed URL with custom policy (IP restrictions, custom expiry)
 * Supports Cloudflare's advanced signed URL features
 */
export function getCDNUrlWithPolicy(
  s3Key: string,
  customPolicy?: {
    ipAddress?: string;
    dateGreaterThan?: Date;
  }
): string {
  if (!CLOUDFLARE_DOMAIN || !CLOUDFLARE_SIGNING_KEY) {
    throw new Error('Cloudflare configuration missing');
  }

  const url = `https://${CLOUDFLARE_DOMAIN}/${s3Key}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  
  // Build query parameters
  const params = new URLSearchParams();
  params.set('exp', expiresAt.toString());
  
  // Add IP restriction if specified
  if (customPolicy?.ipAddress) {
    params.set('ip', customPolicy.ipAddress);
  }
  
  // Add not-before timestamp if specified
  if (customPolicy?.dateGreaterThan) {
    const nbf = Math.floor(customPolicy.dateGreaterThan.getTime() / 1000);
    params.set('nbf', nbf.toString());
  }

  // Generate signature for the URL with all parameters
  const urlToSign = `${url}?${params.toString()}`;
  const signature = crypto
    .createHmac('sha256', CLOUDFLARE_SIGNING_KEY)
    .update(urlToSign)
    .digest('base64url');

  params.set('sig', signature);
  
  return `${url}?${params.toString()}`;
}

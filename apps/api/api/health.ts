import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - lib files are compiled separately
import redis from '../lib/redis.js';
// @ts-ignore
import { octokit, GITHUB_OWNER, GITHUB_REPO } from '../lib/github-storage.js';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting to prevent abuse (10 requests per IP per minute)
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    'unknown';

  const rateLimitKey = `ratelimit:health:${clientIp}`;
  try {
    const requestCount = await redis.incr(rateLimitKey);
    if (requestCount === 1) {
      await redis.expire(rateLimitKey, 60); // 60 second window
    }

    if (requestCount > 10) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait before making another health check request'
      });
    }
  } catch (rateLimitError) {
    // Continue if rate limiting fails (don't block legitimate requests)
    console.warn('Rate limit check failed:', rateLimitError);
  }

  const startTime = Date.now();
  try {
    // Check Redis connection
    await redis.ping();

    // Check Storage (GitHub) connection with proper error handling
    let storageStatus = 'unhealthy';
    try {
      // Verify GitHub token is configured
      if (!process.env.GITHUB_TOKEN) {
        console.error('GITHUB_TOKEN environment variable is not set!');
        storageStatus = 'offline';
      } else {
        const repo = await octokit.repos.get({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
        });
        if (repo.status === 200) {
          storageStatus = 'operational';
        }
      }
    } catch (e: any) {
      // Detect rate limiting vs other errors
      if (e.status === 403 && e.message?.includes('rate limit')) {
        console.warn('Storage health check: GitHub API rate limit exceeded');
        storageStatus = 'degraded'; // Still functional, just rate limited
      } else if (e.status === 401) {
        console.error('Storage health check: GitHub authentication failed - check GITHUB_TOKEN');
        storageStatus = 'offline';
      } else {
        console.warn('Storage health check failed:', e.message || e);
        storageStatus = 'degraded';
      }
    }


    // Check Scanner health (optional service - doesn't affect overall health)
    let scannerStatus = 'operational';
    const scannerUrl = process.env.SCANNER_URL;

    if (!scannerUrl) {
      console.info('SCANNER_URL not configured - scanner service disabled');
      scannerStatus = 'disabled';
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const scannerResponse = await fetch(scannerUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'FileDuck-Health-Check/1.0'
          }
        });

        clearTimeout(timeoutId);

        if (scannerResponse.ok) {
          // Parse scanner response to check capabilities
          const scannerData = await scannerResponse.json();
          scannerStatus = scannerData.status || 'operational';
        } else {
          scannerStatus = 'degraded';
        }
      } catch (e: any) {
        console.warn('Scanner health check failed:', e.message || e);
        scannerStatus = 'offline';
      }
    }

    // Real metrics from Redis
    const activeTransfers = parseInt(await redis.get('metrics:active_transfers') || '0');
    const uploadBytesTotal = parseInt(await redis.get('metrics:upload_bytes_total') || '0');
    const downloadBytesTotal = parseInt(await redis.get('metrics:download_bytes_total') || '0');


    // Calculate "speed" using delta tracking in Redis
    const now = Date.now();
    const lastMetrics = await redis.get('metrics:last_capture');
    let uploadSpeed = '0.0 MB/s';
    let downloadSpeed = '0.0 MB/s';

    if (lastMetrics) {
      try {
        // Safely parse the metrics - handle both string and object responses
        const parsed = typeof lastMetrics === 'string' ? JSON.parse(lastMetrics) : lastMetrics;
        const { time, upload, download } = parsed;
        const deltaT = (now - time) / 1000; // seconds
        if (deltaT > 0 && deltaT < 3600) { // Only calculate if within last hour
          const deltaUpload = Math.max(0, uploadBytesTotal - upload);
          const deltaDownload = Math.max(0, downloadBytesTotal - download);
          uploadSpeed = `${(deltaUpload / (1024 * 1024) / deltaT).toFixed(1)} MB/s`;
          downloadSpeed = `${(deltaDownload / (1024 * 1024) / deltaT).toFixed(1)} MB/s`;
        }
      } catch (parseError) {
        console.warn('Failed to parse last metrics, resetting:', parseError);
        // Reset metrics on parse error
        await redis.del('metrics:last_capture');
      }
    }

    // Store current state for next calculation
    await redis.set('metrics:last_capture', JSON.stringify({
      time: now,
      upload: uploadBytesTotal,
      download: downloadBytesTotal
    }), { ex: 3600 });

    const totalFiles = (await redis.keys('file:*')).length || 0;

    const apiLatency = Date.now() - startTime;

    const metrics = {
      upload_speed: uploadSpeed,
      download_speed: downloadSpeed,
      active_transfers: Math.max(0, activeTransfers),
      total_files: totalFiles,
      api_latency: `${apiLatency}ms`,
    };

    // Overall health: only critical services (API, Redis, Storage) affect status
    // Scanner is optional and doesn't impact overall health
    const criticalServicesHealthy = storageStatus === 'operational' || storageStatus === 'degraded';
    const overallStatus = criticalServicesHealthy ? 'healthy' : 'degraded';

    return res.status(200).json({
      status: overallStatus,
      timestamp: now,
      services: {
        api: 'healthy',
        s3: storageStatus,
        storage: storageStatus,
        redis: 'connected',
        scanner: scannerStatus,
        cdn: 'active',
      },
      metrics,
    });
  } catch (error: any) {
    console.error('CRITICAL: Health check failed:', error);
    return res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
}

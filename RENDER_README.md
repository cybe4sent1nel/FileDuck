# Render Deployment Configuration

**Service ID**: `srv-d65u1s3nv86c73dvsi20`

## Deployment Overview

This project is configured for automatic deployment to Render.

### Files

- **render.yaml** - Primary service configuration (YAML format)
- **render.json** - Alternative service configuration (JSON format)
- **apps/api/Dockerfile** - Docker build configuration

### Auto-Deploy

Auto-deploy is enabled on the `main` branch. Every push to main triggers:
1. Git clone from repository
2. Docker build using `apps/api/Dockerfile`
3. Service deployment

### Key Configuration

- **Start Command**: `node dist/server.js`
- **Health Check**: `/api/health`
- **Port**: 3001
- **Restart Policy**: ON_FAILURE (max 3 retries)

### Environment Variables

All required environment variables must be set in Render dashboard:

```
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_ENDPOINT
S3_BUCKET_QUARANTINE
S3_BUCKET_PUBLIC
VIRUSTOTAL_API_KEY
JWT_SECRET
CAPTCHA_SITE_KEY
CAPTCHA_SECRET_KEY
NODE_ENV=production
PORT=3001
CLAMAV_HOST
CLAMAV_PORT
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX_REQUESTS
SCANNER_PORT
SCANNER_URL
USE_CDN
VITE_API_URL
```

### Build Process

The Dockerfile:
1. Installs pnpm
2. Copies entire monorepo
3. Installs all dependencies
4. Builds scanner and API packages
5. Verifies `apps/api/dist/server.js` exists
6. Exposes port 3001
7. Runs API server

### Dashboard

Monitor deployments at:
https://dashboard.render.com/services/srv-d65u1s3nv86c73dvsi20

### Manual Deployment

To trigger a deployment from the command line, use Render's API or dashboard rerun button.

### Troubleshooting

- Check logs in Render dashboard
- Verify environment variables are set
- Ensure `pnpm install` completes without errors
- Verify TypeScript builds correctly: `pnpm run build:backend`

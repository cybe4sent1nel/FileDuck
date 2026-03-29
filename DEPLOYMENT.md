# Automatic Deployment Configuration

This project uses a **split deployment architecture**:
- **Vercel**: Frontend (Vue app) only
- **Render**: Backend API only
- **Netlify**: Backup frontend (optional)

## Architecture Overview

```
┌─────────────┐      API Requests       ┌─────────────┐
│   Vercel    │ ──────────────────────> │   Render    │
│  (Frontend) │                         │  (Backend)  │
│  Vue App    │ <────────────────────── │  API        │
└─────────────┘      JSON Response      └─────────────┘
```

## Connected Platforms

### 1. Vercel (Frontend ONLY)
- **Deploys**: Vue app static files
- **Does NOT Deploy**: Backend API (to avoid serverless function limits)
- **Auto-Deploy**: ✅ Enabled
- **Branch**: `main`

**Environment Variables Required:**
```
VITE_API_URL=https://fileduck-api.onrender.com
```

**Setup Instructions:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `file-duck`
3. Go to Settings → Environment Variables
4. Add `VITE_API_URL` pointing to your Render backend URL
5. Redeploy to apply changes

### 2. Render (Backend API ONLY)
- **Service ID**: `srv-d65vqkkr85hc73d2t050`
- **Deploys**: Backend API via Docker (`apps/api/Dockerfile`)
- **Auto-Deploy**: ✅ Enabled
- **Branch**: `main`
- **Runtime**: Docker
- **Start Command**: `node dist/server.js`
- **Health Check**: `/api/health`
- **Port**: 3001

**Environment Variables Required:**
- `UPSTASH_REDIS_URL` - Redis connection string
- `UPSTASH_REDIS_TOKEN` - Redis token
- `GITHUB_TOKEN` - For GitHub file storage
- `GITHUB_REPO` - Repository for file storage
- `USE_GITHUB_STORAGE=true`
- `NODE_ENV=production`
- All other backend-specific variables (see `render.yaml`)

**Setup Instructions:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select service `fileduck-api` (`srv-d65vqkkr85hc73d2t050`)
3. Ensure GitHub repository is connected with branch `main`
4. Set all required environment variables
5. Enable "Auto-Deploy" for main branch

### 3. Netlify (Frontend Backup - Optional)
- **Deploys**: Vue app (same as Vercel)
- **Auto-Deploy**: ✅ Enabled
- **Branch**: `main`
- **Build Command**: `pnpm run build`
- **Publish Directory**: `apps/vue-app/dist`

**Setup Instructions:**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Set environment variable: `VITE_API_URL` to Render backend URL
4. Enable "Auto publishing"

## Deployment Triggers

All platforms automatically deploy when:
- ✅ Code is pushed to `main` branch
- ✅ Pull requests are merged to `main`
- ✅ Commits are made directly to `main`

**What Gets Deployed Where:**
- **Vercel**: Only `apps/vue-app` (frontend)
- **Render**: Backend API via Docker (entire repo as build context)
- **Netlify**: Only `apps/vue-app` (frontend backup)

## Configuration Files

### render.yaml (Backend - Render)
```yaml
services:
  - type: web
    name: fileduck-api
    serviceId: srv-d65vqkkr85hc73d2t050
    runtime: docker
    dockerfile: ./apps/api/Dockerfile
    dockerContext: ./
    startCommand: node dist/server.js
    healthCheckPath: /api/health
```

### vercel.json (Frontend Only)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "apps/vue-app/dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### .vercelignore (Exclude Backend)
```
apps/api/
packages/scanner/
```

## GitHub Actions (CI/CD)

### Deploy to Render (`.github/workflows/deploy-render.yml`)
- Triggers on push to `main` or manual `workflow_dispatch`
- Uses Render API to trigger a deploy
- Requires GitHub secrets: `RENDER_API_KEY` and `RENDER_SERVICE_ID`

## Testing the Setup

### 1. Test Frontend Deployment (Vercel)
```bash
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
```

Check: https://your-project.vercel.app

### 2. Test Backend Deployment (Render)
```bash
# Same push triggers Render via GitHub Actions
git push origin main
```

Check: https://fileduck-api.onrender.com/api/health

### 3. Verify Connection
- Open browser console on Vercel site
- Upload a file
- Check Network tab - API requests should go to Render URL
- Look for `VITE_API_URL` in requests

## Troubleshooting

### Error: "Too many serverless functions"
✅ **FIXED**: Backend removed from Vercel. Now deploys on Render only.

### Frontend can't connect to backend
1. Check `VITE_API_URL` environment variable in Vercel
2. Ensure Render backend is deployed and running
3. Check Render logs for errors
4. Verify CORS settings in backend

### Render deployment fails
1. Check environment variables are set in Render dashboard
2. Verify Docker build succeeds (check Render build logs)
3. Ensure `pnpm install` completes without errors
4. Verify TypeScript builds correctly: `pnpm run build:backend`

### Vercel deployment fails
1. Check build logs for errors
2. Ensure `VITE_API_URL` is set
3. Verify `pnpm` version compatibility
4. Check if `apps/vue-app` builds locally

## Manual Deployment Commands

### Vercel (Frontend)
```bash
# From project root
vercel --prod
```

### Render (Backend)
```bash
# Trigger deploy via API
curl -X POST "https://api.render.com/v1/services/srv-d65vqkkr85hc73d2t050/deploys" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Netlify (Frontend Backup)
```bash
# From project root
netlify deploy --prod --dir=apps/vue-app/dist
```

## Environment Variables Summary

### Vercel (Frontend)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://fileduck-api.onrender.com` | ✅ Yes |

### Render (Backend)
| Variable | Example | Required |
|----------|---------|----------|
| `UPSTASH_REDIS_URL` | `https://...upstash.io` | ✅ Yes |
| `UPSTASH_REDIS_TOKEN` | `AX...` | ✅ Yes |
| `GITHUB_TOKEN` | `ghp_...` | ✅ Yes |
| `GITHUB_REPO` | `owner/repo` | ✅ Yes |
| `USE_GITHUB_STORAGE` | `true` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |

### Netlify (Backup Frontend)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://fileduck-api.onrender.com` | ✅ Yes |


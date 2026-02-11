# Automatic Deployment Configuration

This project uses a **split deployment architecture**:
- **Vercel**: Frontend (Vue app) only
- **Railway**: Backend API only
- **Netlify**: Backup frontend (optional)

## Architecture Overview

```
┌─────────────┐      API Requests       ┌─────────────┐
│   Vercel    │ ──────────────────────> │   Railway   │
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
VITE_API_URL=https://your-railway-backend.railway.app
```

**Setup Instructions:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `file-duck`
3. Go to Settings → Environment Variables
4. Add `VITE_API_URL` pointing to your Railway backend URL
5. Redeploy to apply changes

### 2. Railway (Backend API ONLY)
- **Deploys**: Backend API from `apps/api`
- **Auto-Deploy**: ✅ Enabled
- **Branch**: `main`
- **Root Directory**: `apps/api`

**Environment Variables Required:**
- `REDIS_URL` - Redis connection string
- `GITHUB_TOKEN` - For GitHub file storage
- `GITHUB_REPO` - Repository for file storage
- `USE_GITHUB_STORAGE=true`
- `NODE_ENV=production`
- All other backend-specific variables

**Setup Instructions:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Ensure "Root Directory" is set to `apps/api`
4. Set all required environment variables
5. Enable "Auto Deploy" for main branch

### 3. Netlify (Frontend Backup - Optional)
- **Deploys**: Vue app (same as Vercel)
- **Auto-Deploy**: ✅ Enabled
- **Branch**: `main`
- **Build Command**: `pnpm run build`
- **Publish Directory**: `apps/vue-app/dist`

**Setup Instructions:**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Set environment variable: `VITE_API_URL` to Railway backend URL
4. Enable "Auto publishing"

## Deployment Triggers

All platforms automatically deploy when:
- ✅ Code is pushed to `main` branch
- ✅ Pull requests are merged to `main`
- ✅ Commits are made directly to `main`

**What Gets Deployed Where:**
- **Vercel**: Only `apps/vue-app` (frontend)
- **Railway**: Only `apps/api` (backend)
- **Netlify**: Only `apps/vue-app` (frontend backup)

## Configuration Files

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

## Testing the Setup

### 1. Test Frontend Deployment (Vercel)
```bash
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
```

Check: https://your-project.vercel.app

### 2. Test Backend Deployment (Railway)
```bash
# Same push triggers Railway
git push origin main
```

Check: https://your-project.railway.app/api/health

### 3. Verify Connection
- Open browser console on Vercel site
- Upload a file
- Check Network tab - API requests should go to Railway URL
- Look for `VITE_API_URL` in requests

## Troubleshooting

### Error: "Too many serverless functions"
✅ **FIXED**: Backend removed from Vercel. Now deploys on Railway only.

### Frontend can't connect to backend
1. Check `VITE_API_URL` environment variable in Vercel
2. Ensure Railway backend is deployed and running
3. Check Railway logs for errors
4. Verify CORS settings in backend

### Railway deployment fails
1. Check environment variables are set
2. Verify Root Directory is `apps/api`
3. Check Railway logs for build errors
4. Ensure all dependencies in `apps/api/package.json`

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

### Railway (Backend)
```bash
# From project root
railway up
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
| `VITE_API_URL` | `https://your-railway.railway.app` | ✅ Yes |

### Railway (Backend)
| Variable | Example | Required |
|----------|---------|----------|
| `REDIS_URL` | `redis://...` | ✅ Yes |
| `GITHUB_TOKEN` | `ghp_...` | ✅ Yes |
| `GITHUB_REPO` | `owner/repo` | ✅ Yes |
| `USE_GITHUB_STORAGE` | `true` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |

### Netlify (Backup Frontend)
| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://your-railway.railway.app` | ✅ Yes |


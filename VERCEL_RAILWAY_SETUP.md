# Vercel Configuration for Railway Backend

After deploying your backend to Railway, you need to update your Vercel frontend configuration to point to the Railway API.

## Step 1: Get Your Railway URL

After running the deployment script, you'll receive a Railway URL like:
```
https://fileduck-backend-production.up.railway.app
```

Or you can get it anytime by running:
```bash
railway domain
```

## Step 2: Update Vercel Environment Variables

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your FileDuck project
3. Navigate to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and update it to your Railway URL:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
5. Make sure it's set for **Production**, **Preview**, and **Development** environments
6. Click **Save**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set the environment variable
vercel env add VITE_API_URL production
# When prompted, paste your Railway URL: https://your-railway-url.up.railway.app

# Also set for preview and development
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development
```

## Step 3: Redeploy Frontend

### Option A: Via Dashboard
1. Go to your Vercel project
2. Click on **Deployments**
3. Click the **...** menu on the latest deployment
4. Select **Redeploy**

### Option B: Via Git
```bash
git commit --allow-empty -m "Trigger rebuild for Railway backend"
git push
```

### Option C: Via CLI
```bash
vercel --prod
```

## Step 4: Verify the Connection

After redeployment, test the connection:

```bash
# Test Railway backend directly
curl https://your-railway-url.up.railway.app/api/health

# Test frontend (should show success)
curl https://fileduck.vercel.app
```

## Environment Variables Reference

Make sure these are set in both Railway AND Vercel:

### Railway (Backend) Environment Variables
- ✅ All variables from `VERCEL_ENV.txt`
- ✅ `NODE_ENV=production`
- ✅ `PORT` (automatically set by Railway)
- ✅ **`GITHUB_TOKEN`** — personal access token with `repo` scope (used by the API to fetch private GitHub release assets). **Store as a Railway secret/environment variable, do NOT commit to source control.**

### Vercel (Frontend) Environment Variables
- ✅ `VITE_API_URL` → Your Railway URL
- ✅ `VITE_RECAPTCHA_SITE_KEY` → From VERCEL_ENV.txt
- ✅ Any other VITE_* variables your frontend needs

> Note: The `GITHUB_TOKEN` must only be available to the backend (Railway or Vercel serverless functions). Never expose this token to client-side code. If you deploy the API to Vercel, add `GITHUB_TOKEN` in the Project Settings → Environment Variables (and mark as protected/secret).

## Troubleshooting

### CORS Issues
If you see CORS errors:
1. Make sure Railway backend has proper CORS configuration (already done in server.ts)
2. Verify your Vercel domain is allowed in the CORS config
3. Check Railway logs: `railway logs`

### 404 on API Calls
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that Railway service is running: `railway status`
- Test the health endpoint: `curl https://your-railway-url.up.railway.app/api/health`

### Environment Variables Not Loading
- Make sure you redeployed after updating variables
- Verify variables are set for the correct environment (Production/Preview/Development)
- Check Vercel build logs for any errors

## Testing Checklist

After deployment, verify:

- [ ] Railway health endpoint responds: `/api/health`
- [ ] Vercel frontend loads without errors
- [ ] File upload works end-to-end
- [ ] File download/redeem works
- [ ] No CORS errors in browser console
- [ ] Redis connection works (check Railway logs)
- [ ] GitHub storage integration works

## Production Monitoring

### Railway
- Monitor at: https://railway.app/dashboard
- View logs: `railway logs`
- Check metrics: CPU, Memory, Network

### Vercel
- Monitor at: https://vercel.com/dashboard
- View analytics and logs
- Check function execution times

## Rollback Plan

If something goes wrong:

### Rollback Railway
```bash
# View deployments
railway list

# Rollback to previous deployment
railway rollback <deployment-id>
```

### Rollback Vercel
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click **...** → **Promote to Production**

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FileDuck Issues: [Your GitHub repo]/issues

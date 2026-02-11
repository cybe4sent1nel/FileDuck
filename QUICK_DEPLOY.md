# Quick Railway Deployment Commands

# 1. Deploy the API server
railway up --detach

# 2. Get your Railway URL
railway domain

# 3. Check deployment status
railway status

# 4. View logs
railway logs

# 5. Open Railway dashboard
railway open

# After getting your Railway URL, update Vercel:
# Go to: https://vercel.com/dashboard
# Settings > Environment Variables
# Set VITE_API_URL to your Railway URL

import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Load environment variables
config({ path: '../../.env' });

const app: Express = express();
const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3001', 10);

// Middleware - Configure CORS for Vercel/Netlify/Railway frontends
app.use(cors({
  origin: process.env.VERCEL ? '*' : [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://fileduck.vercel.app',
    'https://fileduck.netlify.app',
    /\.vercel\.app$/,
    /\.netlify\.app$/,
    /\.railway\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Skip body parsing for multipart/form-data routes (github-upload needs raw stream)
app.use((req, res, next) => {
  if (req.path === '/api/github-upload' && req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({ limit: '75mb' })(req, res, next);
});
app.use((req, res, next) => {
  if (req.path === '/api/github-upload' && req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '75mb' })(req, res, next);
});

// Lazy load Vercel handlers with dynamic imports for ESM
const getHealthHandler = async () => (await import('./api/health.js')).default;
const getUploadMetaHandler = async () => (await import('./api/upload-meta.js')).default;
const getCompleteUploadHandler = async () => (await import('./api/complete-upload.js')).default;
const getRedeemHandler = async () => (await import('./api/redeem.js')).default;
const getConfirmDownloadHandler = async () => (await import('./api/confirm-download.js')).default;
const getGitHubUploadHandler = async () => (await import('./api/github-upload.js')).default;
const getProxyDownloadHandler = async () => (await import('./api/proxy-download.js')).default;
const getScanBeforeDownloadHandler = async () => (await import('./api/scan-before-download.js')).default;
const getScanHandler = async () => (await import('./api/scan.js')).default;
const getDeleteFileHandler = async () => (await import('./api/delete-file.js')).default;
const getCleanupExpiredHandler = async () => (await import('./api/cleanup-expired.js')).default;
const getMetadataHandler = async () => (await import('./api/get-metadata.js')).default;

// Routes - compatible with both Express and Vercel
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await (await getHealthHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/upload-meta', async (req: Request, res: Response) => {
  try {
    await (await getUploadMetaHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/complete-upload', async (req: Request, res: Response) => {
  try {
    await (await getCompleteUploadHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/redeem', async (req: Request, res: Response) => {
  try {
    await (await getRedeemHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/confirm-download', async (req: Request, res: Response) => {
  try {
    await (await getConfirmDownloadHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/github-upload', async (req: Request, res: Response) => {
  try {
    await (await getGitHubUploadHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get('/api/proxy-download', async (req: Request, res: Response) => {
  try {
    await (await getProxyDownloadHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/scan-before-download', async (req: Request, res: Response) => {
  try {
    await (await getScanBeforeDownloadHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/scan', async (req: Request, res: Response) => {
  try {
    await (await getScanHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.delete('/api/delete-file', async (req: Request, res: Response) => {
  try {
    await (await getDeleteFileHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/cleanup-expired', async (req: Request, res: Response) => {
  try {
    await (await getCleanupExpiredHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/get-metadata', async (req: Request, res: Response) => {
  try {
    await (await getMetadataHandler())(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Start server (only in non-Vercel environments)
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 FileDuck API running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health check: http://0.0.0.0:${PORT}/api/health\n`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 Storage: ${process.env.USE_GITHUB_STORAGE === 'true' ? 'GitHub' : 'S3'}\n`);
  });
}

// Export for Vercel serverless
export default app;

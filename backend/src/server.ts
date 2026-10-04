import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import { getPublicSite } from './controllers/siteController.js';
import productRoutes from './routes/productRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import domainRoutes from './routes/domainRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
// Legacy project routes kept for backward-compat during migration
import projectRoutes from './routes/projectRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin === CORS_ORIGIN ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // permissive in local dev
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ─── Request logging (dev) ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Verdant Website Builder API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Path Normalization (/api/api/ -> /api/) ──────────────────────────────────
app.use((req, _res, next) => {
  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.replace('/api/api/', '/api/');
  }
  next();
});

// ─── Direct Storefront Routes ─────────────────────────────────────────────
app.get('/s/:slug', getPublicSite);
app.get('/site/:slug', getPublicSite);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/sites/:siteId/products', productRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/pricing', pricingRoutes);
// Legacy routes (kept during frontend migration)
app.use('/api/projects', projectRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   🌿 Verdant Website Builder API                              ║
║   Port  : ${PORT}                                                ║
║   Health: http://localhost:${PORT}/api/health                    ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;

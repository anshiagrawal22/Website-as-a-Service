import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';

import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import productRoutes from './routes/productRoutes.js';
import websiteRoutes from './routes/websiteRoutes.js';
import publishRoutes from './routes/publishRoutes.js';
import publicSiteRoutes from './routes/publicSiteRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware with large payload limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect DB (MongoDB or fallback JSON Store)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/publish', publishRoutes);
app.use('/api/public', publicSiteRoutes);

// Serve static frontend files if built
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// For public published site routes or single page application fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
  }
  const indexPath = path.join(frontendBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>WaaS Platform Server</title>
            <style>
              body { font-family: system-ui; background: #f8fafc; color: #0f172a; padding: 40px; text-align: center; }
              .card { background: white; max-width: 500px; margin: 0 auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
              .btn { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>⚡ Website-as-a-Service Backend API Active</h2>
              <p>Server running on port ${PORT}. Run frontend dev server to view the interface.</p>
              <a href="http://localhost:5173" class="btn">Open Frontend App (Vite)</a>
            </div>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 WaaS Server listening on http://localhost:${PORT}`);
});

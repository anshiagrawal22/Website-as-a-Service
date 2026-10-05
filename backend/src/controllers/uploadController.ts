import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../middlewares/errorHandler.js';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `logo-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files (JPEG, PNG, WEBP, SVG, GIF) are allowed.', 400));
    }
  },
});

export async function handleUploadLogo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError('No image file uploaded.', 400);
    }

    if (!req.user) throw new AppError('Authentication required.', 401);
    const siteId = req.body.siteId;
    if (typeof siteId !== 'string' || !siteId.trim()) {
      throw new AppError('Select a website before uploading its logo.', 400);
    }
    const site = await prisma.site.findFirst({
      where: { OR: [{ id: siteId }, { slug: siteId }], userId: req.user.id },
      select: { id: true, draftConfig: true, publishedConfig: true },
    });
    if (!site) throw new AppError('Site not found or access denied.', 404);

    const fileUrl = `${req.protocol}://${req.get('host') || 'localhost:5001'}/uploads/${req.file.filename}`;
    let draft: Record<string, any>;
    let published: Record<string, any> | undefined;
    try {
      draft = JSON.parse(site.draftConfig || '{}');
      if (site.publishedConfig && site.publishedConfig !== '{}') {
        published = JSON.parse(site.publishedConfig);
      }
    } catch {
      throw new AppError('The saved website configuration is invalid.', 500);
    }
    draft.logoUrl = fileUrl;
    if (published) published.logoUrl = fileUrl;
    await prisma.site.update({
      where: { id: site.id },
      data: {
        draftConfig: JSON.stringify(draft),
        ...(published ? { publishedConfig: JSON.stringify(published) } : {}),
      },
    });

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (err) {
    next(err);
  }
}

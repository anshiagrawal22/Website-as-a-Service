import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { storage, upload, generateFilename } from '../utils/storage.js';

export const uploadAssetMiddleware = upload.single('file');

export async function uploadAsset(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    if (!req.file) throw new AppError('No file uploaded.', 400);

    const { siteId, prefix = 'asset' } = req.body;

    // If siteId provided, verify ownership
    if (siteId) {
      const site = await prisma.site.findFirst({ where: { id: siteId, userId: req.user.id } });
      if (!site) throw new AppError('Site not found or access denied.', 404);
    }

    const filename = generateFilename(req.file.originalname, String(prefix));
    const url = await storage.save(filename, req.file.buffer, req.file.mimetype);
    const publicUrl = storage.publicUrl(filename, req);

    const asset = await prisma.asset.create({
      data: {
        userId: req.user.id,
        siteId: siteId || null,
        filename,
        url: publicUrl,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
      },
    });

    res.status(201).json({
      success: true,
      url: publicUrl,
      asset: {
        id: asset.id,
        filename: asset.filename,
        url: asset.url,
        mimeType: asset.mimeType,
        sizeBytes: asset.sizeBytes,
      },
    });
  } catch (err) { next(err); }
}

export async function deleteAsset(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const asset = await prisma.asset.findFirst({ where: { id, userId: req.user.id } });
    if (!asset) throw new AppError('Asset not found.', 404);

    await storage.delete(asset.filename).catch(() => {});
    await prisma.asset.delete({ where: { id } });

    res.json({ success: true, message: 'Asset deleted.' });
  } catch (err) { next(err); }
}

export async function getAssets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId } = req.query as Record<string, string>;

    const assets = await prisma.asset.findMany({
      where: { userId: req.user.id, ...(siteId ? { siteId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, assets });
  } catch (err) { next(err); }
}

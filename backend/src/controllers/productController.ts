import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { storage, upload, generateFilename } from '../utils/storage.js';
import type { ProductImage } from '../utils/siteConfig.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseImages(json: string): ProductImage[] {
  try { return JSON.parse(json); } catch { return []; }
}

function formatProduct(p: any) {
  return {
    id: p.id,
    siteId: p.siteId,
    name: p.name,
    description: p.description,
    price: p.price,
    discountPrice: p.discountPrice ?? null,
    category: p.category,
    stockQty: p.stockQty,
    status: p.status,
    images: parseImages(p.images),
    sortOrder: p.sortOrder,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

async function assertSiteOwner(siteIdOrSlug: string, userId: string) {
  const site = await prisma.site.findFirst({
    where: {
      OR: [{ id: siteIdOrSlug }, { slug: siteIdOrSlug }],
      userId,
    },
  });
  if (!site) throw new AppError('Site not found or access denied.', 404);
  return site;
}

// ─── List products ────────────────────────────────────────────────────────────

export async function getProducts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { siteId } = req.params;
    const { category, status, search, page = '1', limit = '50' } = req.query as Record<string, string>;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id: siteId }, { slug: siteId }] },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const isOwner = req.user && site.userId === req.user.id;
    const statusFilter = isOwner ? (status || undefined) : 'active';

    const where: any = { siteId: site.id, ...(statusFilter ? { status: statusFilter } : {}) };
    if (category && category !== 'All') where.category = category;
    if (search) where.name = { contains: search };

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, parseInt(limit, 10));

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products: products.map(formatProduct),
      pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (err) { next(err); }
}

// ─── Get single product ───────────────────────────────────────────────────────

export async function getProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { siteId, productId } = req.params;
    const site = await prisma.site.findFirst({
      where: { OR: [{ id: siteId }, { slug: siteId }] },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const product = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!product) throw new AppError('Product not found.', 404);
    res.json({ success: true, product: formatProduct(product) });
  } catch (err) { next(err); }
}

// ─── Create product ───────────────────────────────────────────────────────────

export async function createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const { name, description, price, discountPrice, category, stockQty, status } = req.body;
    if (!name) throw new AppError('Product name is required.', 400);
    if (price === undefined || price === null || isNaN(parseFloat(price))) {
      throw new AppError('A valid price is required.', 400);
    }

    // Find current max sortOrder
    const last = await prisma.product.findFirst({ where: { siteId: site.id }, orderBy: { sortOrder: 'desc' } });

    const product = await prisma.product.create({
      data: {
        siteId: site.id,
        name: String(name).trim().slice(0, 200),
        description: String(description || '').slice(0, 2000),
        price: parseFloat(price),
        discountPrice: discountPrice != null && discountPrice !== '' ? parseFloat(discountPrice) : null,
        category: String(category || 'General').slice(0, 100),
        stockQty: parseInt(stockQty ?? '0', 10),
        status: status === 'hidden' ? 'hidden' : 'active',
        sortOrder: (last?.sortOrder ?? -1) + 1,
        images: '[]',
      },
    });

    res.status(201).json({ success: true, product: formatProduct(product) });
  } catch (err) { next(err); }
}

// ─── Update product ───────────────────────────────────────────────────────────

export async function updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const existing = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!existing) throw new AppError('Product not found.', 404);

    const { name, description, price, discountPrice, category, stockQty, status } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = String(name).trim().slice(0, 200);
    if (description !== undefined) data.description = String(description).slice(0, 2000);
    if (price !== undefined) data.price = parseFloat(price);
    if (discountPrice !== undefined) data.discountPrice = discountPrice !== '' ? parseFloat(discountPrice) : null;
    if (category !== undefined) data.category = String(category).slice(0, 100);
    if (stockQty !== undefined) data.stockQty = parseInt(stockQty, 10);
    if (status !== undefined) data.status = status === 'hidden' ? 'hidden' : 'active';

    const product = await prisma.product.update({ where: { id: productId }, data });
    res.json({ success: true, product: formatProduct(product) });
  } catch (err) { next(err); }
}

// ─── Toggle status (active ↔ hidden) ─────────────────────────────────────────

export async function toggleProductStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const existing = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!existing) throw new AppError('Product not found.', 404);

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status: existing.status === 'active' ? 'hidden' : 'active' },
    });
    res.json({ success: true, product: formatProduct(product) });
  } catch (err) { next(err); }
}

// ─── Delete product ───────────────────────────────────────────────────────────

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const existing = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!existing) throw new AppError('Product not found.', 404);

    // Delete stored images
    const images = parseImages(existing.images);
    for (const img of images) {
      await storage.delete(img.filename).catch(() => {});
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) { next(err); }
}

// ─── Upload product image(s) ──────────────────────────────────────────────────

export const uploadProductImages = upload.array('images', 10);

export async function handleProductImageUpload(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const product = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!product) throw new AppError('Product not found.', 404);

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) throw new AppError('No files uploaded.', 400);

    const existing = parseImages(product.images);
    const newImages: ProductImage[] = [];

    for (const file of files) {
      const filename = generateFilename(file.originalname, 'product');
      const url = await storage.save(filename, file.buffer, file.mimetype);
      newImages.push({
        url,
        filename,
        isMain: existing.length === 0 && newImages.length === 0, // first ever = main
        alt: '',
      });
    }

    const allImages = [...existing, ...newImages];
    // Ensure exactly one main image
    if (!allImages.some(i => i.isMain) && allImages.length > 0) {
      allImages[0].isMain = true;
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images: JSON.stringify(allImages) },
    });

    res.json({ success: true, product: formatProduct(updated), uploadedCount: files.length });
  } catch (err) { next(err); }
}

// ─── Delete product image ─────────────────────────────────────────────────────

export async function deleteProductImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId, filename } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const product = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!product) throw new AppError('Product not found.', 404);

    const images = parseImages(product.images);
    const idx = images.findIndex(i => i.filename === filename);
    if (idx === -1) throw new AppError('Image not found.', 404);

    const wasMain = images[idx].isMain;
    await storage.delete(filename).catch(() => {});

    images.splice(idx, 1);

    // If main image was removed, promote the next one
    if (wasMain && images.length > 0) {
      images[0].isMain = true;
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images: JSON.stringify(images) },
    });

    res.json({ success: true, product: formatProduct(updated) });
  } catch (err) { next(err); }
}

// ─── Reorder product images ───────────────────────────────────────────────────

export async function reorderProductImages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId, productId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const { order } = req.body;
    if (!Array.isArray(order)) throw new AppError('Order array is required.', 400);

    const product = await prisma.product.findFirst({ where: { id: productId, siteId: site.id } });
    if (!product) throw new AppError('Product not found.', 404);

    const images = parseImages(product.images);
    const reordered: ProductImage[] = [];

    for (const filename of order) {
      const img = images.find(i => i.filename === filename);
      if (img) reordered.push(img);
    }
    // Append any images not in the order array
    for (const img of images) {
      if (!reordered.find(i => i.filename === img.filename)) reordered.push(img);
    }

    // First image in the reordered array is always main
    reordered.forEach((img, i) => { img.isMain = i === 0; });

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { images: JSON.stringify(reordered) },
    });

    res.json({ success: true, product: formatProduct(updated) });
  } catch (err) { next(err); }
}

// ─── Reorder products within site ─────────────────────────────────────────────

export async function reorderProducts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { siteId } = req.params;
    const site = await assertSiteOwner(siteId, req.user.id);

    const { order } = req.body; // array of product IDs in order
    if (!Array.isArray(order)) throw new AppError('Order array of product IDs is required.', 400);

    await prisma.$transaction(
      order.map((id, index) =>
        prisma.product.updateMany({
          where: { id, siteId: site.id },
          data: { sortOrder: index },
        })
      )
    );

    res.json({ success: true, message: 'Products reordered successfully.' });
  } catch (err) { next(err); }
}

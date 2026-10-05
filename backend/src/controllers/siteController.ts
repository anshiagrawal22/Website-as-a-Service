import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { SiteConfig } from '../utils/siteConfig.js';
import { renderStorefrontHtml } from '../utils/storefrontRenderer.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseSiteConfig(json: string): SiteConfig {
  try { return JSON.parse(json); } catch { return {} as SiteConfig; }
}

function formatSite(site: any, includeConfig = true) {
  const draft = parseSiteConfig(site.draftConfig);
  const published = site.publishedConfig && site.publishedConfig !== '{}'
    ? parseSiteConfig(site.publishedConfig)
    : null;

  return {
    id: site.id,
    slug: site.slug,
    name: site.name,
    status: site.status,
    publishedAt: site.publishedAt,
    templateId: site.templateId,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
    ...(includeConfig ? { draftConfig: draft, publishedConfig: published } : {}),
  };
}

// ─── List sites for logged-in user ───────────────────────────────────────────

export async function getSites(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);

    const sites = await prisma.site.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, slug: true, name: true, status: true,
        publishedAt: true, templateId: true, createdAt: true, updatedAt: true,
        draftConfig: true,
        _count: { select: { products: true } },
      },
    });

    res.json({ success: true, sites: sites.map(s => formatSite(s, true)) });
  } catch (err) { next(err); }
}

// ─── Get single site ──────────────────────────────────────────────────────────

export async function getSiteById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    res.json({ success: true, site: formatSite(site) });
  } catch (err) { next(err); }
}

// ─── Create site ──────────────────────────────────────────────────────────────

export async function createSite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);

    const { name, templateId, draftConfig } = req.body;
    if (!name) throw new AppError('Site name is required.', 400);

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.site.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Resolve starting config
    let startConfig: SiteConfig;
    if (draftConfig) {
      startConfig = typeof draftConfig === 'string' ? JSON.parse(draftConfig) : draftConfig;
    } else if (templateId) {
      const tpl = await prisma.template.findUnique({ where: { id: templateId } });
      startConfig = tpl ? parseSiteConfig(tpl.defaultConfig) : {} as SiteConfig;
    } else {
      startConfig = {} as SiteConfig;
    }

    // Always stamp the correct site name
    startConfig.siteName = name;

    const site = await prisma.site.create({
      data: {
        userId: req.user.id,
        templateId: templateId || null,
        name: name.trim(),
        slug,
        status: 'draft',
        draftConfig: JSON.stringify(startConfig),
        publishedConfig: '{}',
      },
    });

    res.status(201).json({ success: true, site: formatSite(site) });
  } catch (err) { next(err); }
}

// ─── Get draft config ─────────────────────────────────────────────────────────

export async function getSiteConfig(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    res.json({
      success: true,
      siteId: site.id,
      slug: site.slug,
      status: site.status,
      draftConfig: parseSiteConfig(site.draftConfig),
      publishedConfig: site.publishedConfig !== '{}' ? parseSiteConfig(site.publishedConfig) : null,
    });
  } catch (err) { next(err); }
}

// ─── Save (autosave) draft config ────────────────────────────────────────────

export async function saveSiteConfig(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;
    const { config, createVersion, versionLabel } = req.body;

    if (!config) throw new AppError('Config payload is required.', 400);

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const configStr = typeof config === 'string' ? config : JSON.stringify(config);

    // Optionally save a version snapshot first
    if (createVersion) {
      await prisma.siteVersion.create({
        data: {
          siteId: site.id,
          label: versionLabel || 'Auto-saved',
          configSnapshot: site.draftConfig, // snapshot the OLD config before overwriting
        },
      });
      // Keep only last 20 versions
      const versions = await prisma.siteVersion.findMany({
        where: { siteId: site.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      if (versions.length > 20) {
        const toDelete = versions.slice(20).map(v => v.id);
        await prisma.siteVersion.deleteMany({ where: { id: { in: toDelete } } });
      }
    }

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { draftConfig: configStr },
    });

    res.json({ success: true, site: formatSite(updated) });
  } catch (err) { next(err); }
}

// ─── Publish site ─────────────────────────────────────────────────────────────

export async function publishSite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    // Save a version snapshot before publishing
    await prisma.siteVersion.create({
      data: {
        siteId: site.id,
        label: `Published ${new Date().toLocaleDateString()}`,
        configSnapshot: site.draftConfig,
      },
    });

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        publishedConfig: site.draftConfig, // copy draft → published
      },
    });

    res.json({ success: true, site: formatSite(updated), message: 'Site published successfully.' });
  } catch (err) { next(err); }
}

// ─── Revert to draft ──────────────────────────────────────────────────────────

export async function revertToDraft(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { status: 'draft', publishedAt: null },
    });

    res.json({ success: true, site: formatSite(updated) });
  } catch (err) { next(err); }
}

// ─── Apply template to existing site ─────────────────────────────────────────

export async function applyTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;
    const { templateId } = req.body;
    if (!templateId) throw new AppError('templateId is required.', 400);

    const [site, tpl] = await Promise.all([
      prisma.site.findFirst({ where: { OR: [{ id }, { slug: id }], userId: req.user.id } }),
      prisma.template.findUnique({ where: { id: templateId } }),
    ]);
    if (!site) throw new AppError('Site not found.', 404);
    if (!tpl) throw new AppError('Template not found.', 404);

    // Snapshot the current config before switching
    await prisma.siteVersion.create({
      data: {
        siteId: site.id,
        label: `Before switching to ${tpl.name}`,
        configSnapshot: site.draftConfig,
      },
    });

    const newConfig = parseSiteConfig(tpl.defaultConfig);
    const existingConfig = parseSiteConfig(site.draftConfig);
    // Preserve: siteName, logoUrl, contact, socials, custom content
    newConfig.siteName = existingConfig.siteName || site.name;
    if (existingConfig.logoUrl) newConfig.logoUrl = existingConfig.logoUrl;
    if (existingConfig.contact?.email) newConfig.contact = existingConfig.contact;
    if (existingConfig.socials?.instagram) newConfig.socials = existingConfig.socials;

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { templateId, draftConfig: JSON.stringify(newConfig) },
    });

    res.json({ success: true, site: formatSite(updated) });
  } catch (err) { next(err); }
}

// ─── Delete site ──────────────────────────────────────────────────────────────

export async function deleteSite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    await prisma.site.delete({ where: { id: site.id } });
    res.json({ success: true, message: 'Site deleted.' });
  } catch (err) { next(err); }
}

// ─── Version history ──────────────────────────────────────────────────────────

export async function getVersions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const versions = await prisma.siteVersion.findMany({
      where: { siteId: site.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, label: true, createdAt: true },
    });

    res.json({ success: true, versions });
  } catch (err) { next(err); }
}

export async function restoreVersion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id, versionId } = req.params;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }], userId: req.user.id },
    });
    if (!site) throw new AppError('Site not found.', 404);

    const version = await prisma.siteVersion.findFirst({
      where: { id: versionId, siteId: site.id },
    });
    if (!version) throw new AppError('Version not found.', 404);

    // Save current as a new version before restoring
    await prisma.siteVersion.create({
      data: {
        siteId: site.id,
        label: `Before restore to "${version.label}"`,
        configSnapshot: site.draftConfig,
      },
    });

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { draftConfig: version.configSnapshot },
    });

    res.json({ success: true, site: formatSite(updated), message: 'Version restored.' });
  } catch (err) { next(err); }
}

// ─── Public: render published site by slug ────────────────────────────────────

export async function getPublicSite(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const site = await prisma.site.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'active' },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!site || site.status !== 'published') {
      throw new AppError('Site not found or not published.', 404);
    }

    const config = site.publishedConfig !== '{}'
      ? parseSiteConfig(site.publishedConfig)
      : parseSiteConfig(site.draftConfig);

    const products = site.products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      category: p.category,
      stockQty: p.stockQty,
      images: JSON.parse(p.images || '[]'),
    }));

    if (req.accepts('html')) {
      const html = renderStorefrontHtml(site.name, site.slug, config, products);
      res.send(html);
      return;
    }

    res.json({ success: true, config, products, slug: site.slug, name: site.name });
  } catch (err) { next(err); }
}

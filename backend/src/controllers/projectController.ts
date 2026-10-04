import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { SiteConfig } from '../utils/siteConfig.js';
import { FASHION_CONFIG } from '../utils/templateDefaults.js';

function parseConfig(jsonStr: string): SiteConfig {
  try {
    return JSON.parse(jsonStr || '{}');
  } catch {
    return {} as SiteConfig;
  }
}

function siteToProject(site: any) {
  const draft = parseConfig(site.draftConfig);
  const productsCount = site._count?.products ?? (site.products?.length || 0);

  const defaultSteps = [
    { title: 'Brand styling & visual theme', completed: !!draft.theme?.primaryColor },
    { title: 'Add navigation & header layout', completed: (draft.navLinks?.length || 0) > 0 },
    { title: 'Curate product catalog & editorial gallery', completed: productsCount > 0 },
    { title: 'Connect custom domain', completed: false },
    { title: 'Payment gateway & checkout policies', completed: false },
  ];

  const steps = (draft as any).setupSteps || defaultSteps;
  const completedCount = steps.filter((s: any) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const heroSection = draft.sections?.find(s => s.type === 'hero');
  const heroProps: any = heroSection?.props || {};

  return {
    id: site.id,
    slug: site.slug,
    name: site.name,
    category: (draft as any).category || 'Fashion & Lifestyle',
    status: site.status as 'draft' | 'published',
    progress,
    lastEdited: 'Just now',
    url: site.status === 'published' ? `http://localhost:5001/api/sites/public/${site.slug}` : undefined,
    customDomain: `${site.slug}.verdant.site`,
    urlSlug: site.slug,
    activeTemplate: site.templateId || 'boutique-chic',
    primaryColor: draft.theme?.primaryColor || '#AF4418',
    announcement: draft.announcement || '',
    showHero: draft.sections?.find(s => s.type === 'hero')?.visible ?? true,
    showProducts: draft.sections?.find(s => s.type === 'product-grid')?.visible ?? true,
    showAbout: draft.sections?.find(s => s.type === 'about')?.visible ?? true,
    showContact: draft.sections?.find(s => s.type === 'contact')?.visible ?? true,
    thumbnailTheme: {
      bg: draft.theme?.bgColor || '#FFFFFF',
      accent: draft.theme?.primaryColor || '#AF4418',
      text: draft.theme?.textColor || '#1E1C24',
      headline: site.name,
      subtitle: draft.tagline || '',
    },
    setupSteps: steps,
    businessInfo: {
      businessName: site.name,
      category: (draft as any).category || 'Fashion & Lifestyle',
      description: draft.tagline || '',
      logoUrl: draft.logoUrl || '',
      email: draft.contact?.email || 'admin@aureliaboutique.com',
      phone: draft.contact?.phone || '+1 (415) 890-2341',
      streetAddress: draft.contact?.address || '428 Sutter Street, San Francisco, CA',
      city: 'San Francisco',
      stateProvince: 'CA',
      operatingHours: draft.contact?.hours || 'Mon - Sat: 10:00 AM – 6:30 PM',
      whatsappNumber: draft.socials?.whatsapp || '',
      instagramUrl: draft.socials?.instagram || 'https://instagram.com/aurelia.atelier',
      facebookUrl: draft.socials?.facebook || 'https://facebook.com/aureliaboutique',
      otherWebsiteUrl: '',
      currency: '$ USD (United States Dollar)',
      displayPrices: true,
      displayContactForm: true,
      customHeroHeadline: heroProps.headline || '',
    },
    draftConfig: draft,
    publishedConfig: site.publishedConfig ? parseConfig(site.publishedConfig) : null,
  };
}

export async function getAllProjects(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status) where.status = status;

    const sites = await prisma.site.findMany({
      where,
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = sites.map(siteToProject);

    res.status(200).json({
      success: true,
      count: formatted.length,
      projects: formatted,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!site) {
      throw new AppError(`Project '${id}' not found.`, 404);
    }

    res.status(200).json({
      success: true,
      project: siteToProject(site),
    });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id, name, category, templateId, primaryColor, businessInfo } = req.body;
    if (!name) throw new AppError('Site name is required.', 400);

    const user = req.user || (await prisma.user.findFirst());
    if (!user) throw new AppError('User not found.', 400);

    const baseSlug = (id || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.site.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const startConfig: SiteConfig = {
      ...(FASHION_CONFIG as SiteConfig),
      siteName: name,
      tagline: businessInfo?.description || 'Effortless silhouettes crafted with intention.',
    };
    if (primaryColor) {
      startConfig.theme.primaryColor = primaryColor;
    }

    const newSite = await prisma.site.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug,
        templateId: templateId || 'boutique-chic',
        status: 'draft',
        draftConfig: JSON.stringify(startConfig),
        publishedConfig: '{}',
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(201).json({
      success: true,
      project: siteToProject(newSite),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!site) throw new AppError(`Project '${id}' not found.`, 404);

    const draft = parseConfig(site.draftConfig);

    if (body.name) {
      site.name = body.name;
      draft.siteName = body.name;
    }
    if (body.primaryColor) {
      draft.theme.primaryColor = body.primaryColor;
    }
    if (body.announcement !== undefined) {
      draft.announcement = body.announcement;
    }
    if (body.setupSteps) {
      (draft as any).setupSteps = body.setupSteps;
    }
    if (body.showHero !== undefined) {
      const h = draft.sections?.find(s => s.type === 'hero');
      if (h) h.visible = body.showHero;
    }
    if (body.showProducts !== undefined) {
      const p = draft.sections?.find(s => s.type === 'product-grid');
      if (p) p.visible = body.showProducts;
    }
    if (body.showAbout !== undefined) {
      const a = draft.sections?.find(s => s.type === 'about');
      if (a) a.visible = body.showAbout;
    }
    if (body.showContact !== undefined) {
      const c = draft.sections?.find(s => s.type === 'contact');
      if (c) c.visible = body.showContact;
    }

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        name: site.name,
        status: body.status || site.status,
        draftConfig: JSON.stringify(draft),
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(200).json({
      success: true,
      project: siteToProject(updated),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateBusinessInfo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { updatedInfo, updatedName } = req.body;

    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!site) throw new AppError(`Project '${id}' not found.`, 404);

    const draft = parseConfig(site.draftConfig);

    if (updatedName) {
      site.name = updatedName;
      draft.siteName = updatedName;
    }
    if (updatedInfo) {
      if (updatedInfo.description) draft.tagline = updatedInfo.description;
      if (updatedInfo.logoUrl !== undefined) draft.logoUrl = updatedInfo.logoUrl;
      if (updatedInfo.email || updatedInfo.phone || updatedInfo.streetAddress || updatedInfo.operatingHours) {
        draft.contact = {
          email: updatedInfo.email || draft.contact?.email || '',
          phone: updatedInfo.phone || draft.contact?.phone || '',
          address: updatedInfo.streetAddress || draft.contact?.address || '',
          hours: updatedInfo.operatingHours || draft.contact?.hours || '',
        };
      }
      if (updatedInfo.instagramUrl || updatedInfo.facebookUrl || updatedInfo.whatsappNumber) {
        draft.socials = {
          instagram: updatedInfo.instagramUrl || draft.socials?.instagram,
          facebook: updatedInfo.facebookUrl || draft.socials?.facebook,
          whatsapp: updatedInfo.whatsappNumber || draft.socials?.whatsapp,
        };
      }
      const hero = draft.sections?.find(s => s.type === 'hero');
      if (hero && updatedInfo.customHeroHeadline) {
        (hero.props as any).headline = updatedInfo.customHeroHeadline;
      }
    }

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        name: site.name,
        draftConfig: JSON.stringify(draft),
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(200).json({
      success: true,
      project: siteToProject(updated),
    });
  } catch (err) {
    next(err);
  }
}

export async function publishProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!site) throw new AppError(`Project '${id}' not found.`, 404);

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        publishedConfig: site.draftConfig,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(200).json({
      success: true,
      project: siteToProject(updated),
    });
  } catch (err) {
    next(err);
  }
}

export async function revertToDraft(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!site) throw new AppError(`Project '${id}' not found.`, 404);

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: {
        status: 'draft',
        publishedAt: null,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    res.status(200).json({
      success: true,
      project: siteToProject(updated),
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const site = await prisma.site.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!site) throw new AppError(`Project '${id}' not found.`, 404);

    await prisma.site.delete({ where: { id: site.id } });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}

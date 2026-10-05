import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function getAllDomains(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const domains = await prisma.customDomain.findMany({
      where: { userId: req.user.id },
      include: {
        site: {
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      domains: domains.map(({ site, ...domain }) => ({
        ...domain,
        project: site,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function createDomain(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { domain } = req.body;
    const siteId = req.body.siteId || req.body.projectId;

    if (typeof domain !== 'string' || !domain.trim()) {
      throw new AppError('Domain name is required.', 400);
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const site = siteId
      ? await prisma.site.findFirst({ where: { OR: [{ id: siteId }, { slug: siteId }], userId: req.user.id } })
      : null;
    if (siteId && !site) throw new AppError('Site not found.', 404);

    const existing = await prisma.customDomain.findUnique({
      where: { domain: cleanDomain },
    });

    if (existing) {
      throw new AppError('This domain is already mapped.', 409);
    }

    const newDomain = await prisma.customDomain.create({
      data: {
        domain: cleanDomain,
        userId: req.user.id,
        siteId: site?.id || null,
        status: 'dns_active',
        dnsTarget: '76.76.21.21',
        sslStatus: 'active',
      },
      include: { site: { select: { id: true, name: true, status: true } } },
    });

    res.status(201).json({
      success: true,
      domain: { ...newDomain, project: newDomain.site },
      message: 'Domain connected successfully.',
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteDomain(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Authentication required.', 401);
    const { id } = req.params;

    const domain = await prisma.customDomain.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!domain) {
      throw new AppError(`Domain '${id}' was not found.`, 404);
    }

    await prisma.customDomain.delete({ where: { id: domain.id } });

    res.status(200).json({
      success: true,
      message: `Domain '${domain.domain}' was successfully disconnected.`,
    });
  } catch (err) {
    next(err);
  }
}

import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function getAllDomains(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const domains = await prisma.customDomain.findMany({
      include: {
        project: {
          select: { id: true, name: true, status: true, progress: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      domains,
    });
  } catch (err) {
    next(err);
  }
}

export async function createDomain(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { domain, projectId } = req.body;

    if (!domain) {
      throw new AppError('Domain name is required.', 400);
    }

    const userId = req.user?.id || (await prisma.user.findFirst())?.id;
    if (!userId) {
      throw new AppError('User authentication required.', 401);
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '');

    const existing = await prisma.customDomain.findUnique({
      where: { domain: cleanDomain },
    });

    if (existing) {
      throw new AppError('This domain is already mapped.', 409);
    }

    const newDomain = await prisma.customDomain.create({
      data: {
        domain: cleanDomain,
        userId,
        projectId: projectId || null,
        status: 'dns_active',
        dnsTarget: '76.76.21.21',
        sslStatus: 'active',
      },
      include: {
        project: {
          select: { id: true, name: true, status: true },
        },
      },
    });

    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { customDomain: cleanDomain },
      });
    }

    res.status(201).json({
      success: true,
      domain: newDomain,
      message: 'Domain connected successfully.',
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteDomain(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const domain = await prisma.customDomain.findUnique({
      where: { id },
    });

    if (!domain) {
      throw new AppError(`Domain '${id}' was not found.`, 404);
    }

    await prisma.customDomain.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Domain '${domain.domain}' was successfully disconnected.`,
    });
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function getAllTemplates(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const formatted = templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      popularity: t.popularity,
      palette: typeof t.palette === 'string' ? JSON.parse(t.palette) : t.palette,
    }));

    res.status(200).json({
      success: true,
      templates: formatted,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTemplateById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new AppError(`Template '${id}' not found.`, 404);
    }

    res.status(200).json({
      success: true,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        popularity: template.popularity,
        palette: typeof template.palette === 'string' ? JSON.parse(template.palette) : template.palette,
      },
    });
  } catch (err) {
    next(err);
  }
}

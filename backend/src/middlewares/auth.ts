import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { AppError } from './errorHandler.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export async function authenticateToken(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'dimplelulla2004@gmail.com' },
        select: { id: true, email: true, name: true, role: true },
      });
      if (defaultUser) {
        req.user = defaultUser;
        return next();
      }
    }
    throw new AppError('Authentication required. Missing Bearer token.', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'verdant-studio-secret-key-2026-very-secure';
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError('Invalid or expired authentication token.', 401));
    }
  }
}

// Optional Auth: if token is present, use it; otherwise, fall back to the default demo user (Dimple)
export async function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'verdant-studio-secret-key-2026-very-secure';
      const decoded = jwt.verify(token, secret) as AuthenticatedUser;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // Continue to fallback
    }
  }

  // Fallback to primary demo user
  const defaultUser = await prisma.user.findFirst({
    where: { email: 'dimplelulla2004@gmail.com' },
    select: { id: true, email: true, name: true, role: true },
  });

  if (defaultUser) {
    req.user = defaultUser;
  }
  next();
}

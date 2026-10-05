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

async function resolveUserFromAuthorization(authHeader: string): Promise<AuthenticatedUser> {
  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Invalid authorization header.', 401);
  }
  const token = authHeader.slice('Bearer '.length);
  if (!token) throw new AppError('Authentication required. Provide a bearer token.', 401);

  let decoded: AuthenticatedUser;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'verdant-studio-secret-key-2026-very-secure'
    ) as AuthenticatedUser;
  } catch {
    throw new AppError('Invalid or expired authentication token.', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) throw new AppError('User belonging to this token no longer exists.', 401);
  return user;
}

export async function authenticateToken(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError('Authentication required. Provide a bearer token.', 401);
    req.user = await resolveUserFromAuthorization(authHeader);
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  try {
    req.user = await resolveUserFromAuthorization(authHeader);
    next();
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { AppError } from '../middlewares/errorHandler.js';
import { AuthRequest } from '../middlewares/auth.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Please provide name, email, and password.', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'user',
        plan: 'Studio Pro',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        avatarUrl: true,
        themePreference: true,
        createdAt: true,
      },
    });

    const secret = process.env.JWT_SECRET || 'verdant-studio-secret-key-2026-very-secure';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide both email and password.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials.', 401);
    }

    const secret = process.env.JWT_SECRET || 'verdant-studio-secret-key-2026-very-secure';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatarUrl: user.avatarUrl,
        themePreference: user.themePreference,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        avatarUrl: true,
        themePreference: true,
        createdAt: true,
        _count: {
          select: { sites: true },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated.', 401);
    }

    const { name, avatarUrl, themePreference } = req.body;
    const validThemes = ['terracotta', 'sage', 'amber'];
    if (themePreference !== undefined && !validThemes.includes(themePreference)) {
      throw new AppError('Unsupported theme preference.', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(themePreference !== undefined ? { themePreference } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        avatarUrl: true,
        themePreference: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

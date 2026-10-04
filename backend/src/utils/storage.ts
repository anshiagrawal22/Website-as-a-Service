/**
 * storage.ts — Swappable file-storage adapter.
 *
 * Currently uses local disk (`uploads/` directory).
 * To switch to S3 or Cloudinary, implement the StorageAdapter interface below
 * and export it as `storage` instead of `localStorageAdapter`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StorageAdapter {
  /** Save a file buffer. Returns the public URL. */
  save(filename: string, buffer: Buffer, mimeType: string): Promise<string>;
  /** Delete a file by its filename (not full URL). */
  delete(filename: string): Promise<void>;
  /** Derive a public URL from a stored filename. */
  publicUrl(filename: string, req?: Request): string;
}

// ─── Local Disk Adapter ───────────────────────────────────────────────────────

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const localStorageAdapter: StorageAdapter = {
  async save(filename: string, buffer: Buffer, _mimeType: string): Promise<string> {
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  },

  async delete(filename: string): Promise<void> {
    const filePath = path.join(uploadsDir, filename);
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // Silently ignore if file doesn't exist
    }
  },

  publicUrl(filename: string, req?: Request): string {
    if (req) {
      const protocol = req.protocol;
      const host = req.get('host') || 'localhost:5001';
      return `${protocol}://${host}/uploads/${filename}`;
    }
    const appUrl = process.env.APP_URL || 'http://localhost:5001';
    return `${appUrl}/uploads/${filename}`;
  },
};

/** The active storage adapter — swap this import to switch backends */
export const storage: StorageAdapter = localStorageAdapter;

// ─── Multer Helper ────────────────────────────────────────────────────────────

import multer from 'multer';
import { AppError } from '../middlewares/errorHandler.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_BYTES || '5242880', 10); // 5 MB default

/** Multer instance with memory storage so we can pass the buffer to the adapter */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type "${file.mimetype}" is not allowed. Use JPEG, PNG, or WEBP.`, 400));
    }
  },
});

/** Generate a unique filename for an upload */
export function generateFilename(originalname: string, prefix = 'asset'): string {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${unique}${ext}`;
}

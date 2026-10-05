import { Router } from 'express';
import { upload, handleUploadLogo } from '../controllers/uploadController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/logo', authenticateToken, upload.single('file'), handleUploadLogo);

export default router;

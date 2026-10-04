import { Router } from 'express';
import { upload, handleUploadLogo } from '../controllers/uploadController.js';

const router = Router();

router.post('/logo', upload.single('file'), handleUploadLogo);

export default router;

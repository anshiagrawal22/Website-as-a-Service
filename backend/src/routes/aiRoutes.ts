import { Router } from 'express';
import { generateContent } from '../controllers/aiController.js';

const router = Router();

router.post('/generate-content', generateContent);

export default router;

import { Router } from 'express';
import { uploadAssetMiddleware, uploadAsset, deleteAsset, getAssets } from '../controllers/assetController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAssets);
router.post('/upload', uploadAssetMiddleware, uploadAsset);
router.delete('/:id', deleteAsset);

export default router;

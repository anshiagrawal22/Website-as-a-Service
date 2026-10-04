import { Router } from 'express';
import {
  getSites,
  getSiteById,
  createSite,
  getSiteConfig,
  saveSiteConfig,
  publishSite,
  revertToDraft,
  applyTemplate,
  deleteSite,
  getVersions,
  restoreVersion,
  getPublicSite,
} from '../controllers/siteController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

// ─── Public: render published site by slug ────────────────────────────────────
router.get('/public/:slug', getPublicSite);

// ─── All other site routes require authentication ─────────────────────────────
router.use(authenticateToken);

router.get('/', getSites);
router.post('/', createSite);
router.get('/:id', getSiteById);
router.delete('/:id', deleteSite);

// Config (autosave + publish)
router.get('/:id/config', getSiteConfig);
router.put('/:id/config', saveSiteConfig);
router.post('/:id/publish', publishSite);
router.post('/:id/revert-draft', revertToDraft);
router.post('/:id/apply-template', applyTemplate);

// Version history
router.get('/:id/versions', getVersions);
router.post('/:id/versions/:versionId/restore', restoreVersion);

export default router;

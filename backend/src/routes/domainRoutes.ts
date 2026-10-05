import { Router } from 'express';
import { getAllDomains, createDomain, deleteDomain } from '../controllers/domainController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllDomains);
router.post('/', createDomain);
router.delete('/:id', deleteDomain);

export default router;

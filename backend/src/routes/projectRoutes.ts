import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  updateBusinessInfo,
  publishProject,
  revertToDraft,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.patch('/:id/business-info', updateBusinessInfo);
router.patch('/:id/publish', publishProject);
router.patch('/:id/revert-draft', revertToDraft);
router.delete('/:id', deleteProject);

export default router;

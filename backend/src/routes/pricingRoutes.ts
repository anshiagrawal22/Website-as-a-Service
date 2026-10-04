import { Router } from 'express';
import { getPricingPlans } from '../controllers/pricingController.js';

const router = Router();

router.get('/', getPricingPlans);

export default router;

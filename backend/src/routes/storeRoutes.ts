import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { 
  createCheckout, 
  getOrders, 
  updateOrderStatus,
  createInquiry,
  getInquiries,
  updateInquiryStatus
} from '../controllers/storeController.js';

const router = Router();

// ─── Public Store Endpoints ───────────────────────────────────────────────────

router.post('/:slug/checkout/init', createCheckout);
router.get('/:slug/orders', authenticateToken, getOrders);
router.put('/:slug/orders/:orderId', authenticateToken, updateOrderStatus);

// Inquiries & Bookings
router.post('/:slug/inquiries', createInquiry);
router.post('/:slug/inquiry', createInquiry); // alias
router.get('/:slug/inquiries', authenticateToken, getInquiries);
router.patch('/:slug/inquiries/:inquiryId', authenticateToken, updateInquiryStatus);

export default router;

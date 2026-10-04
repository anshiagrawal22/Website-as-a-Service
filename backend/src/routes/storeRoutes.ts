import { Router } from 'express';
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
router.get('/:slug/orders', getOrders);
router.put('/:slug/orders/:orderId', updateOrderStatus);

// Inquiries & Bookings
router.post('/:slug/inquiries', createInquiry);
router.post('/:slug/inquiry', createInquiry); // alias
router.get('/:slug/inquiries', getInquiries);
router.patch('/:slug/inquiries/:inquiryId', updateInquiryStatus);

export default router;


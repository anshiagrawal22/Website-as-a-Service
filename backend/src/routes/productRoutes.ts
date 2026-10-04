import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  uploadProductImages,
  handleProductImageUpload,
  deleteProductImage,
  reorderProductImages,
  reorderProducts,
} from '../controllers/productController.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.js';

// Mounted at /api/sites/:siteId/products
const router = Router({ mergeParams: true });

// List and single product — public read (owner sees hidden too)
router.get('/', optionalAuth, getProducts);
router.get('/:productId', optionalAuth, getProduct);

// All write operations require authentication
router.use(authenticateToken);

router.post('/', createProduct);
router.put('/reorder', reorderProducts);
router.put('/:productId', updateProduct);
router.patch('/:productId/status', toggleProductStatus);
router.delete('/:productId', deleteProduct);

// Image management
router.post('/:productId/images', uploadProductImages, handleProductImageUpload);
router.delete('/:productId/images/:filename', deleteProductImage);
router.put('/:productId/images/reorder', reorderProductImages);

export default router;

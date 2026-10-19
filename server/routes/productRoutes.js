import { Router } from 'express';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.post('/:id/reviews', protect, addReview);
router
  .route('/:idOrSlug')
  .get(getProduct);
router
  .route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
export default router;

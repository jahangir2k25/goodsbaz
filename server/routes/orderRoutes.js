import { Router } from 'express';
import {
  createOrder, getMyOrders, trackOrder, getAllOrders, updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.route('/').post(optionalAuth, createOrder).get(protect, admin, getAllOrders);
router.get('/my', protect, getMyOrders);
router.post('/track', trackOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
export default router;

import { Router } from 'express';
import { getHome } from '../controllers/homeController.js';
import { getStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

export const homeRoutes = Router();
homeRoutes.get('/', getHome);

export const adminRoutes = Router();
adminRoutes.get('/stats', protect, admin, getStats);

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import seedRoutes from './seed.routes.js';
import adminUtilsRoutes from './admin-utils.routes.js';

const router = Router();

// Health check route
router.use('/health', healthRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Seed route (one-time setup, no shell access needed)
router.use('/seed', seedRoutes);

// Admin utilities (for initial setup)
router.use('/admin-utils', adminUtilsRoutes);

export default router;

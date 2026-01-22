import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Health check route
router.use('/health', healthRoutes);

// Placeholder for future routes
// router.use('/auth', authRoutes);
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;

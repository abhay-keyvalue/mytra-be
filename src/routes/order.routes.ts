import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { createOrderValidation, updateOrderValidation, getOrderValidation } from '../validators/order.validator.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/v1/orders/all
 * @desc    Get all orders (Admin only)
 * @access  Private (Admin)
 */
router.get('/all', authenticate, authorize('ADMIN'), OrderController.getAllOrders);

/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', authenticate, createOrderValidation, OrderController.createOrder);

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders for current user
 * @access  Private
 */
router.get('/', authenticate, OrderController.getUserOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 * @access  Private (Own order or Admin)
 */
router.get('/:id', authenticate, getOrderValidation, OrderController.getOrderById);

/**
 * @route   PUT /api/v1/orders/:id
 * @desc    Update order
 * @access  Private (Own order or Admin)
 */
router.put('/:id', authenticate, updateOrderValidation, OrderController.updateOrder);

/**
 * @route   DELETE /api/v1/orders/:id
 * @desc    Cancel order
 * @access  Private (Own order or Admin)
 */
router.delete('/:id', authenticate, getOrderValidation, OrderController.cancelOrder);

export default router;

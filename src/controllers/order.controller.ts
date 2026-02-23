import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { OrderService } from '../services/order.service.js';
import type { CreateOrderRequest, UpdateOrderRequest } from '../types/index.js';
import { OrderStatus } from '../entities/Order.js';

// ============================================
// Order Controller
// ============================================

export class OrderController {
  /**
   * Create a new order
   * POST /api/v1/orders
   */
  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const data: CreateOrderRequest = req.body;
      const order = await OrderService.createOrder(userId, data);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * Get all orders for current user
   * GET /api/v1/orders
   */
  static async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const result = await OrderService.getUserOrders(userId, { page, limit });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders (Admin only)
   * GET /api/v1/orders/all
   */
  static async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const status = req.query.status as OrderStatus | undefined;

      const result = await OrderService.getAllOrders({ page, limit, status });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   * GET /api/v1/orders/:id
   */
  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const order = await OrderService.getOrderById(id, userId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * Update order
   * PUT /api/v1/orders/:id
   */
  static async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const data: UpdateOrderRequest = req.body;
      const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const order = await OrderService.updateOrder(id, data, userId);

      res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * Cancel order
   * DELETE /api/v1/orders/:id
   */
  static async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Order ID is required',
        });
        return;
      }

      const order = await OrderService.cancelOrder(id, userId);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }
}

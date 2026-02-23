import { AppDataSource } from '../config/typeorm.js';
import { Order, OrderStatus, PaymentStatus } from '../entities/Order.js';
import { OrderItem } from '../entities/OrderItem.js';
import { Product } from '../entities/Product.js';
import type { CreateOrderRequest, UpdateOrderRequest, PaginatedResponse } from '../types/index.js';

// ============================================
// Order Service
// ============================================

export class OrderService {
  /**
   * Generate unique order number
   */
  private static generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create a new order
   */
  static async createOrder(userId: string, data: CreateOrderRequest): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const productRepository = AppDataSource.getRepository(Product);

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      price: number;
      subtotal: number;
    }> = [];

    for (const item of data.items) {
      const product = await productRepository.findOne({
        where: { id: item.productId, isActive: true },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    // Create order using transaction
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // Create order
      const order = orderRepository.create({
        orderNumber: this.generateOrderNumber(),
        userId,
        status: OrderStatus.PENDING,
        totalAmount,
        shippingAddress: data.shippingAddress || null,
        paymentMethod: data.paymentMethod || null,
        paymentStatus: PaymentStatus.PENDING,
        notes: data.notes || null,
      });

      await transactionalEntityManager.save(order);

      // Create order items
      const orderItems = orderItemsData.map((itemData) =>
        orderItemRepository.create({
          orderId: order.id,
          ...itemData,
        })
      );

      await transactionalEntityManager.save(orderItems);

      // Update product stock
      for (const item of data.items) {
        await transactionalEntityManager.decrement(
          Product,
          { id: item.productId },
          'stock',
          item.quantity
        );
      }

      // Load order with relations
      const orderWithItems = await transactionalEntityManager.findOne(Order, {
        where: { id: order.id },
        relations: ['orderItems', 'orderItems.product'],
      });

      return orderWithItems!;
    });
  }

  /**
   * Get all orders for a user
   */
  static async getUserOrders(
    userId: string,
    params: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Order>> {
    const orderRepository = AppDataSource.getRepository(Order);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await orderRepository.findAndCount({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all orders (Admin only)
   */
  static async getAllOrders(params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  }): Promise<PaginatedResponse<Order>> {
    const orderRepository = AppDataSource.getRepository(Order);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoinAndSelect('order.user', 'user');

    if (params.status) {
      queryBuilder.where('order.status = :status', { status: params.status });
    }

    const [orders, total] = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);

    const whereCondition: any = { id: orderId };
    if (userId) {
      whereCondition.userId = userId;
    }

    const order = await orderRepository.findOne({
      where: whereCondition,
      relations: ['orderItems', 'orderItems.product', 'user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Update order
   */
  static async updateOrder(orderId: string, data: UpdateOrderRequest, userId?: string): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);

    const whereCondition: any = { id: orderId };
    if (userId) {
      whereCondition.userId = userId;
    }

    const order = await orderRepository.findOne({
      where: whereCondition,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if order can be updated
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new Error(`Cannot update order with status: ${order.status}`);
    }

    // Update fields
    if (data.status) order.status = data.status as OrderStatus;
    if (data.shippingAddress !== undefined) order.shippingAddress = data.shippingAddress || null;
    if (data.paymentMethod !== undefined) order.paymentMethod = data.paymentMethod || null;
    if (data.paymentStatus) order.paymentStatus = data.paymentStatus as PaymentStatus;
    if (data.notes !== undefined) order.notes = data.notes || null;

    await orderRepository.save(order);

    // Reload with relations
    const updatedOrder = await orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    return updatedOrder!;
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, userId?: string): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);

    const whereCondition: any = { id: orderId };
    if (userId) {
      whereCondition.userId = userId;
    }

    const order = await orderRepository.findOne({
      where: whereCondition,
      relations: ['orderItems'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if order can be cancelled
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      // Restore product stock
      for (const item of order.orderItems) {
        await transactionalEntityManager.increment(
          Product,
          { id: item.productId },
          'stock',
          item.quantity
        );
      }

      // Update order status
      order.status = OrderStatus.CANCELLED;
      await transactionalEntityManager.save(order);

      // Reload with relations
      const cancelledOrder = await transactionalEntityManager.findOne(Order, {
        where: { id: orderId },
        relations: ['orderItems', 'orderItems.product'],
      });

      return cancelledOrder!;
    });
  }
}

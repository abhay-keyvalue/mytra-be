// Type definitions for Myntra OMS Backend
// Using TypeORM entities

export { User, UserRole } from '../entities/User.js';
export { Product } from '../entities/Product.js';
export { Order, OrderStatus, PaymentStatus } from '../entities/Order.js';
export { OrderItem } from '../entities/OrderItem.js';

// ============================================
// Request/Response Types
// ============================================

// Auth Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

// Product Types
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
}

// Order Types
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  status?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
}

// ============================================
// Utility Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

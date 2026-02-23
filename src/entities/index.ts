// Barrel export for entities - ensures proper loading order
// Order matters for circular dependencies with ES modules

export { User, UserRole } from './User.js';
export { Product } from './Product.js';
export { Order, OrderStatus, PaymentStatus } from './Order.js';
export { OrderItem } from './OrderItem.js';

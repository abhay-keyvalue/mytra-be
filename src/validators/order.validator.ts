import { body, param } from 'express-validator';

// ============================================
// Order Validation Rules
// ============================================

export const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.productId')
    .isUUID()
    .withMessage('Invalid product ID'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('shippingAddress')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Shipping address must be between 10 and 500 characters'),

  body('paymentMethod')
    .optional()
    .trim()
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'])
    .withMessage('Invalid payment method'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

export const updateOrderValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid order ID'),

  body('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status'),

  body('shippingAddress')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Shipping address must be between 10 and 500 characters'),

  body('paymentMethod')
    .optional()
    .trim()
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'])
    .withMessage('Invalid payment method'),

  body('paymentStatus')
    .optional()
    .isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
    .withMessage('Invalid payment status'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

export const getOrderValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid order ID'),
];

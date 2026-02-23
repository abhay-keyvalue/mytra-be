import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { createProductValidation, updateProductValidation, getProductValidation } from '../validators/product.validator.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   GET /api/v1/products/meta/categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/meta/categories', ProductController.getCategories);

/**
 * @route   GET /api/v1/products/meta/brands
 * @desc    Get all product brands
 * @access  Public
 */
router.get('/meta/brands', ProductController.getBrands);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products (with filters and pagination)
 * @access  Public
 */
router.get('/', ProductController.getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductValidation, ProductController.getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post('/', authenticate, authorize('ADMIN'), createProductValidation, ProductController.createProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize('ADMIN'), updateProductValidation, ProductController.updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('ADMIN'), getProductValidation, ProductController.deleteProduct);

export default router;

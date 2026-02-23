import { AppDataSource } from '../config/typeorm.js';
import { Product } from '../entities/Product.js';
import type { CreateProductRequest, UpdateProductRequest, PaginationParams, PaginatedResponse } from '../types/index.js';

// ============================================
// Product Service
// ============================================

export class ProductService {
  /**
   * Get all products with pagination and filters
   */
  static async getAllProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<PaginatedResponse<Product>> {
    const productRepository = AppDataSource.getRepository(Product);

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = productRepository
      .createQueryBuilder('product')
      .where('product.isActive = :isActive', { isActive: true });

    // Apply filters
    if (params.category) {
      queryBuilder.andWhere('product.category = :category', { category: params.category });
    }

    if (params.brand) {
      queryBuilder.andWhere('product.brand = :brand', { brand: params.brand });
    }

    if (params.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: params.minPrice });
    }

    if (params.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: params.maxPrice });
    }

    if (params.search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.brand ILIKE :search)',
        { search: `%${params.search}%` }
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const products = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Create a new product (Admin only)
   */
  static async createProduct(data: CreateProductRequest): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product);

    const product = productRepository.create({
      name: data.name,
      description: data.description || null,
      price: data.price,
      category: data.category,
      brand: data.brand || null,
      imageUrl: data.imageUrl || null,
      stock: data.stock,
    });

    await productRepository.save(product);

    return product;
  }

  /**
   * Update product (Admin only)
   */
  static async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Update fields
    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description || null;
    if (data.price !== undefined) product.price = data.price;
    if (data.category !== undefined) product.category = data.category;
    if (data.brand !== undefined) product.brand = data.brand || null;
    if (data.imageUrl !== undefined) product.imageUrl = data.imageUrl || null;
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.isActive !== undefined) product.isActive = data.isActive;

    await productRepository.save(product);

    return product;
  }

  /**
   * Delete product (soft delete - set isActive to false)
   */
  static async deleteProduct(id: string): Promise<void> {
    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    product.isActive = false;
    await productRepository.save(product);
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<string[]> {
    const productRepository = AppDataSource.getRepository(Product);

    const categories = await productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .getRawMany();

    return categories.map((c) => c.category);
  }

  /**
   * Get all brands
   */
  static async getBrands(): Promise<string[]> {
    const productRepository = AppDataSource.getRepository(Product);

    const brands = await productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.isActive = :isActive AND product.brand IS NOT NULL', { isActive: true })
      .getRawMany();

    return brands.map((b) => b.brand).filter(Boolean);
  }
}

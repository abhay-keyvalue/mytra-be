import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.js';
import { User, UserRole } from '../entities/User.js';
import { Product } from '../entities/Product.js';
import bcrypt from 'bcryptjs';

const router = Router();

// One-time seed endpoint (should be disabled after first use)
router.post('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);

    // Check if already seeded
    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@myntra.com' } });
    if (existingAdmin) {
      res.json({
        status: 'skipped',
        message: 'Database already seeded',
      });
      return;
    }

    // Create admin
    const adminUser = userRepository.create({
      email: 'admin@myntra.com',
      password: await bcrypt.hash('Admin123!', 12),
      firstName: 'Admin',
      lastName: 'User',
      phone: '+911234567890',
      role: UserRole.ADMIN,
    });
    await userRepository.save(adminUser);

    // Create customer
    const customerUser = userRepository.create({
      email: 'customer@example.com',
      password: await bcrypt.hash('Customer123!', 12),
      firstName: 'John',
      lastName: 'Doe',
      phone: '+919876543210',
      role: UserRole.CUSTOMER,
    });
    await userRepository.save(customerUser);

    // Create products
    const productsData = [
      { name: 'Classic White T-Shirt', description: 'Comfortable cotton t-shirt', price: 599, category: 'Mens Clothing', brand: 'Nike', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 100 },
      { name: 'Denim Jeans', description: 'Stylish blue denim jeans', price: 1999, category: 'Mens Clothing', brand: 'Levis', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', stock: 50 },
      { name: 'Running Shoes', description: 'Lightweight running shoes', price: 3499, category: 'Footwear', brand: 'Adidas', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 30 },
      { name: 'Leather Jacket', description: 'Premium leather jacket', price: 5999, category: 'Mens Clothing', brand: 'Zara', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', stock: 15 },
      { name: 'Summer Dress', description: 'Floral print summer dress', price: 1499, category: 'Womens Clothing', brand: 'H&M', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', stock: 40 },
      { name: 'Casual Sneakers', description: 'Comfortable sneakers', price: 2499, category: 'Footwear', brand: 'Puma', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', stock: 60 },
      { name: 'Backpack', description: 'Spacious backpack', price: 1799, category: 'Accessories', brand: 'Wildcraft', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 25 },
      { name: 'Wrist Watch', description: 'Elegant analog watch', price: 4999, category: 'Accessories', brand: 'Fossil', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400', stock: 20 },
      { name: 'Sunglasses', description: 'Polarized sunglasses', price: 2999, category: 'Accessories', brand: 'Ray-Ban', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', stock: 35 },
      { name: 'Formal Shirt', description: 'Slim fit formal shirt', price: 1299, category: 'Mens Clothing', brand: 'Arrow', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', stock: 45 },
      { name: 'Sports Shorts', description: 'Quick-dry sports shorts', price: 799, category: 'Mens Clothing', brand: 'Nike', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', stock: 70 },
      { name: 'Winter Coat', description: 'Warm winter coat', price: 6999, category: 'Womens Clothing', brand: 'The North Face', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', stock: 10 },
      { name: 'Yoga Mat', description: 'Non-slip yoga mat', price: 1299, category: 'Accessories', brand: 'Decathlon', imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', stock: 50 },
      { name: 'Laptop Bag', description: 'Padded laptop bag', price: 2299, category: 'Accessories', brand: 'Samsonite', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 30 },
      { name: 'Cotton Hoodie', description: 'Cozy cotton hoodie', price: 1599, category: 'Mens Clothing', brand: 'H&M', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', stock: 55 },
    ];

    const products = productRepository.create(productsData);
    await productRepository.save(products);

    res.json({
      status: 'success',
      message: 'Database seeded successfully',
      data: {
        users: 2,
        products: productsData.length,
      },
      credentials: {
        admin: { email: 'admin@myntra.com', password: 'Admin123!' },
        customer: { email: 'customer@example.com', password: 'Customer123!' },
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to seed database',
    });
  }
});

export default router;

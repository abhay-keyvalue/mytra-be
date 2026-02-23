import 'reflect-metadata';
import { AppDataSource } from '../config/typeorm.js';
import { User, UserRole } from '../entities/User.js';
import { Product } from '../entities/Product.js';
import { Order, OrderStatus, PaymentStatus } from '../entities/Order.js';
import { OrderItem } from '../entities/OrderItem.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Initialize database connection
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);
  const orderRepository = AppDataSource.getRepository(Order);
  const orderItemRepository = AppDataSource.getRepository(OrderItem);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = userRepository.create({
    email: 'admin@myntra.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    phone: '+911234567890',
    role: UserRole.ADMIN,
  });
  await userRepository.save(adminUser);

  console.log('👤 Created admin user:', adminUser.email);

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customerUser = userRepository.create({
    email: 'customer@example.com',
    password: customerPassword,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+919876543210',
    role: UserRole.CUSTOMER,
  });
  await userRepository.save(customerUser);

  console.log('👤 Created customer user:', customerUser.email);

  // Create sample products
  const productsData = [
    // Men's Clothing
    {
      name: 'Classic White Shirt',
      description: 'Premium cotton white shirt perfect for formal occasions',
      price: 1299.99,
      category: 'Mens Clothing',
      brand: 'Allen Solly',
      imageUrl: 'https://example.com/white-shirt.jpg',
      stock: 50,
    },
    {
      name: 'Blue Denim Jeans',
      description: 'Comfortable slim-fit denim jeans',
      price: 1999.99,
      category: 'Mens Clothing',
      brand: 'Levis',
      imageUrl: 'https://example.com/blue-jeans.jpg',
      stock: 30,
    },
    {
      name: 'Black Leather Jacket',
      description: 'Genuine leather jacket with modern design',
      price: 5999.99,
      category: 'Mens Clothing',
      brand: 'Flying Machine',
      imageUrl: 'https://example.com/leather-jacket.jpg',
      stock: 15,
    },
    // Women's Clothing
    {
      name: 'Floral Summer Dress',
      description: 'Light and breezy floral print dress',
      price: 1499.99,
      category: 'Womens Clothing',
      brand: 'Vero Moda',
      imageUrl: 'https://example.com/floral-dress.jpg',
      stock: 40,
    },
    {
      name: 'Elegant Evening Gown',
      description: 'Stunning evening gown for special occasions',
      price: 3999.99,
      category: 'Womens Clothing',
      brand: 'AND',
      imageUrl: 'https://example.com/evening-gown.jpg',
      stock: 20,
    },
    {
      name: 'Casual Denim Jacket',
      description: 'Trendy denim jacket for casual wear',
      price: 2499.99,
      category: 'Womens Clothing',
      brand: 'Only',
      imageUrl: 'https://example.com/denim-jacket.jpg',
      stock: 25,
    },
    // Footwear
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with excellent cushioning',
      price: 3499.99,
      category: 'Footwear',
      brand: 'Nike',
      imageUrl: 'https://example.com/running-shoes.jpg',
      stock: 60,
    },
    {
      name: 'Formal Leather Shoes',
      description: 'Classic formal shoes for office wear',
      price: 2999.99,
      category: 'Footwear',
      brand: 'Clarks',
      imageUrl: 'https://example.com/formal-shoes.jpg',
      stock: 35,
    },
    {
      name: 'Casual Sneakers',
      description: 'Comfortable sneakers for everyday wear',
      price: 1999.99,
      category: 'Footwear',
      brand: 'Adidas',
      imageUrl: 'https://example.com/sneakers.jpg',
      stock: 45,
    },
    // Accessories
    {
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with multiple card slots',
      price: 799.99,
      category: 'Accessories',
      brand: 'Hidesign',
      imageUrl: 'https://example.com/wallet.jpg',
      stock: 100,
    },
    {
      name: 'Aviator Sunglasses',
      description: 'Classic aviator sunglasses with UV protection',
      price: 1499.99,
      category: 'Accessories',
      brand: 'Ray-Ban',
      imageUrl: 'https://example.com/sunglasses.jpg',
      stock: 50,
    },
    {
      name: 'Analog Wrist Watch',
      description: 'Elegant analog watch with leather strap',
      price: 4999.99,
      category: 'Accessories',
      brand: 'Fossil',
      imageUrl: 'https://example.com/watch.jpg',
      stock: 30,
    },
    // Electronics
    {
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with noise cancellation',
      price: 2999.99,
      category: 'Electronics',
      brand: 'boAt',
      imageUrl: 'https://example.com/earbuds.jpg',
      stock: 80,
    },
    {
      name: 'Smart Fitness Band',
      description: 'Fitness tracker with heart rate monitor',
      price: 1999.99,
      category: 'Electronics',
      brand: 'Mi',
      imageUrl: 'https://example.com/fitness-band.jpg',
      stock: 70,
    },
    {
      name: 'Portable Power Bank',
      description: '10000mAh power bank with fast charging',
      price: 1299.99,
      category: 'Electronics',
      brand: 'Ambrane',
      imageUrl: 'https://example.com/power-bank.jpg',
      stock: 90,
    },
  ];

  const products = productRepository.create(productsData);
  await productRepository.save(products);

  console.log('📦 Created 15 sample products');

  // Create a sample order
  const sampleProducts = products.slice(0, 3);

  const order = orderRepository.create({
    orderNumber: `ORD-${Date.now()}`,
    userId: customerUser.id,
    status: OrderStatus.CONFIRMED,
    totalAmount: 5799.97,
    shippingAddress: '123 Main Street, Bangalore, Karnataka, 560001',
    paymentMethod: 'Credit Card',
    paymentStatus: PaymentStatus.PAID,
  });
  await orderRepository.save(order);

  const orderItems = sampleProducts.map((product, index) => {
    return orderItemRepository.create({
      orderId: order.id,
      productId: product.id,
      quantity: index + 1,
      price: product.price,
      subtotal: product.price * (index + 1),
    });
  });
  await orderItemRepository.save(orderItems);

  console.log('🛒 Created sample order:', order.orderNumber);

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Users: 2 (1 admin, 1 customer)');
  console.log('  - Products: 15');
  console.log('  - Orders: 1');
  console.log('\n🔐 Test Credentials:');
  console.log('  Admin:');
  console.log('    Email: admin@myntra.com');
  console.log('    Password: admin123');
  console.log('  Customer:');
  console.log('    Email: customer@example.com');
  console.log('    Password: customer123');

  await AppDataSource.destroy();
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  });

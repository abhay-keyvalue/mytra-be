import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './env.js';
import { User } from '../entities/User.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { OrderItem } from '../entities/OrderItem.js';
import { CreateUsersTable1737544800000 } from '../database/migrations/1737544800000-CreateUsersTable.js';
import { CreateProductsTable1737544900000 } from '../database/migrations/1737544900000-CreateProductsTable.js';
import { CreateOrdersTable1737545000000 } from '../database/migrations/1737545000000-CreateOrdersTable.js';
import { CreateOrderItemsTable1737545100000 } from '../database/migrations/1737545100000-CreateOrderItemsTable.js';

// TypeORM DataSource configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  logging: config.env === 'development',
  entities: [User, Product, Order, OrderItem],
  migrations: [
    CreateUsersTable1737544800000,
    CreateProductsTable1737544900000,
    CreateOrdersTable1737545000000,
    CreateOrderItemsTable1737545100000,
  ],
  subscribers: [],
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
  extra: config.env === 'production' ? {
    ssl: { rejectUnauthorized: false }
  } : {},
});

// Initialize TypeORM connection
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ TypeORM database connection successful');
    return true;
  } catch (error) {
    console.error('❌ TypeORM database connection failed:', error);
    return false;
  }
};

// Close TypeORM connection
export const closeDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
};

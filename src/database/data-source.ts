import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/User.js';
import { Product } from '../entities/Product.js';
import { Order } from '../entities/Order.js';
import { OrderItem } from '../entities/OrderItem.js';

// Load environment variables
dotenv.config();

// DataSource for migrations
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'myntra_oms_db',
  synchronize: false, // Disable auto-sync when using migrations
  logging: true,
  entities: [User, Product, Order, OrderItem],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: [],
});

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './env.js';

// TypeORM DataSource configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: config.env === 'development',
  logging: config.env === 'development',
  entities: [
    config.env === 'production'
      ? 'dist/entities/**/*.js'
      : 'src/entities/**/*.ts'
  ],
  migrations: [
    config.env === 'production'
      ? 'dist/database/migrations/**/*.js'
      : 'src/database/migrations/**/*.ts'
  ],
  subscribers: [],
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

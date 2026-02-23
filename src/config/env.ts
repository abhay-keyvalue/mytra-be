import dotenv from 'dotenv';
import { parse } from 'url';

// Load environment variables
dotenv.config();

// Parse DATABASE_URL if provided (Render format)
function parseDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port || '5432', 10),
        name: parsed.pathname.slice(1),
        user: parsed.username,
        password: parsed.password,
      };
    } catch (error) {
      console.warn('Failed to parse DATABASE_URL, using individual DB variables');
    }
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'myntra_oms_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  },
  db: parseDatabaseUrl(),
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
};

export const isDevelopment = config.env === 'development';
export const isProduction = config.env === 'production';

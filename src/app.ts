import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { initializeDatabase, closeDatabase, AppDataSource } from './config/typeorm.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

// Create Express application
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration - support multiple origins
const corsOrigins = config.cors.origin.includes(',') 
  ? config.cors.origin.split(',').map(origin => origin.trim())
  : config.cors.origin;

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger middleware
app.use(loggerMiddleware);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Myntra OMS Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: config.api.prefix,
    },
  });
});

// API routes
app.use(config.api.prefix, routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize TypeORM database connection
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      console.warn('⚠️  Server starting without database connection');
    } else {
      // Run migrations automatically in production
      if (config.env === 'production') {
        console.log('🔄 Running database migrations...');
        try {
          const migrations = await AppDataSource.runMigrations();
          if (migrations.length > 0) {
            console.log(`✅ Executed ${migrations.length} migration(s)`);
          } else {
            console.log('✅ Database schema is up to date');
          }
        } catch (migrationError) {
          console.error('❌ Migration failed:', migrationError);
        }
      }
    }

    // Start listening
    app.listen(config.server.port, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${config.server.port}`);
      console.log(`📍 Environment: ${config.env}`);
      console.log(`🌐 URL: http://${config.server.host}:${config.server.port}`);
      console.log(`💚 Health: http://${config.server.host}:${config.server.port}/health`);
      console.log(`📡 API: http://${config.server.host}:${config.server.port}${config.api.prefix}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  closeDatabase().then(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  closeDatabase().then(() => process.exit(0));
});

// Start the server
startServer();

export default app;

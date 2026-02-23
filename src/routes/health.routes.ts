import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/typeorm.js';

const router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check database connection
    const isDbConnected = AppDataSource.isInitialized;
    
    // Try a simple query
    let dbStatus = 'disconnected';
    if (isDbConnected) {
      try {
        await AppDataSource.query('SELECT 1');
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
      }
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Database diagnostic endpoint
router.get('/db', async (req: Request, res: Response) => {
  try {
    const isInitialized = AppDataSource.isInitialized;
    
    if (!isInitialized) {
      res.json({
        status: 'not_initialized',
        message: 'Database not initialized',
      });
      return;
    }

    // Check tables exist
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Count records in each table
    const counts: any = {};
    for (const table of tables) {
      try {
        const result = await AppDataSource.query(`SELECT COUNT(*) FROM ${table.table_name}`);
        counts[table.table_name] = parseInt(result[0].count);
      } catch (error) {
        counts[table.table_name] = 'error';
      }
    }

    res.json({
      status: 'ok',
      tables: tables.map((t: any) => t.table_name),
      counts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

import 'reflect-metadata';
import { AppDataSource } from './data-source.js';

async function showMigrations() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    console.log('📋 Migration Status:\n');
    console.log('═'.repeat(80));

    const migrations = await AppDataSource.showMigrations();

    if (migrations) {
      console.log('⚠️  There are pending migrations to run');
      console.log('\nRun: npm run migration:run');
    } else {
      console.log('✅ All migrations have been executed');
      console.log('✅ Database schema is up to date');
    }

    console.log('═'.repeat(80));

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error showing migrations:', error);
    process.exit(1);
  }
}

showMigrations();

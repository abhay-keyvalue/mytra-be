import 'reflect-metadata';
import { AppDataSource } from './data-source.js';

async function revertMigration() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    console.log('🔄 Reverting last migration...');
    await AppDataSource.undoLastMigration();
    console.log('✅ Successfully reverted last migration');

    await AppDataSource.destroy();
    console.log('✅ Revert completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error reverting migration:', error);
    process.exit(1);
  }
}

revertMigration();

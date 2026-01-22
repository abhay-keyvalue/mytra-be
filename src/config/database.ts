import { Client, ClientConfig } from 'pg';
import { config } from './env.js';

export const dbConfig: ClientConfig = {
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
};

export const createDbClient = (): Client => {
  return new Client(dbConfig);
};

export const testDbConnection = async (): Promise<boolean> => {
  const client = createDbClient();
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

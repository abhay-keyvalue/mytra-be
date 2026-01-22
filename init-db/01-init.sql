-- Initialize Myntra OMS Database
-- This script will be automatically executed when the PostgreSQL container starts

-- Create database (if not exists)
-- Note: The database is already created by docker-compose environment variables

-- Connect to the database
\c myntra_oms_db;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a test table to verify database is working
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test record
INSERT INTO health_check (status) VALUES ('Database initialized successfully');

-- Display success message
SELECT 'Database initialization completed!' AS message;

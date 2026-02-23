# TypeORM Migrations Guide

## Overview

This guide explains how to work with TypeORM migrations in the Myntra OMS Backend.

## What are Migrations?

Migrations are version-controlled database schema changes. They allow you to:
- Track database schema changes over time
- Apply changes in a controlled manner
- Rollback changes if needed
- Share schema changes with team members
- Deploy to production safely

## Migration Files

All migration files are located in: `src/database/migrations/`

### Current Migrations

1. **1737544800000-CreateUsersTable.ts**
   - Creates `users` table
   - Creates `users_role_enum` (CUSTOMER, ADMIN)
   - Adds UUID extension

2. **1737544900000-CreateProductsTable.ts**
   - Creates `products` table
   - Stores product catalog information

3. **1737545000000-CreateOrdersTable.ts**
   - Creates `orders` table
   - Creates `orders_status_enum` (PENDING, CONFIRMED, etc.)
   - Creates `orders_payment_status_enum` (PENDING, PAID, etc.)
   - Adds foreign key to `users` table

4. **1737545100000-CreateOrderItemsTable.ts**
   - Creates `order_items` table
   - Adds foreign key to `orders` table (CASCADE)
   - Adds foreign key to `products` table (RESTRICT)

## Migration Commands

### Show Migration Status
```bash
npm run migration:show
```
Shows which migrations have been run and which are pending.

### Run Pending Migrations
```bash
npm run migration:run
```
Executes all pending migrations in order.

### Revert Last Migration
```bash
npm run migration:revert
```
Reverts the most recently executed migration.

### Generate New Migration
```bash
npm run migration:generate -- src/database/migrations/MigrationName
```
Generates a new migration file based on entity changes.

## Migration Workflow

### Development Workflow

**Option 1: Auto-Sync (Current Setup)**
- Set `synchronize: true` in TypeORM config
- TypeORM automatically syncs schema with entities
- Good for rapid development
- **Warning:** Not safe for production!

**Option 2: Manual Migrations**
1. Make changes to entities
2. Generate migration: `npm run migration:generate -- src/database/migrations/AddNewField`
3. Review generated migration file
4. Run migration: `npm run migration:run`

### Production Workflow

1. **Never use `synchronize: true` in production**
2. Always use migrations for schema changes
3. Test migrations in staging environment first
4. Run migrations during deployment:
   ```bash
   npm run migration:run
   ```
5. Keep migrations in version control

## Migration File Structure

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1234567890000 implements MigrationInterface {
  // Run when migrating up
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tables, add columns, etc.
  }

  // Run when reverting migration
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Undo changes made in up()
  }
}
```

## Example: Creating a Table

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          // ... more columns
        ],
      }),
      true // createForeignKeys
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## Example: Adding a Column

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAvatarToUsers1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar_url',
        type: 'varchar',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar_url');
  }
}
```

## Example: Adding a Foreign Key

```typescript
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddUserIdToOrders1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('orders');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('orders', foreignKey);
    }
  }
}
```

## Running Migrations

### First Time Setup

1. **Start PostgreSQL:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Run all migrations:**
   ```bash
   npm run migration:run
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### After Entity Changes

1. **Update entity file** (e.g., `src/entities/User.ts`)

2. **Generate migration:**
   ```bash
   npm run migration:generate -- src/database/migrations/DescriptiveName
   ```

3. **Review the generated migration file**

4. **Run the migration:**
   ```bash
   npm run migration:run
   ```

5. **Test your changes**

### Reverting Changes

If something goes wrong:

```bash
# Revert last migration
npm run migration:revert

# Fix the issue

# Run migration again
npm run migration:run
```

## Migration Best Practices

### 1. Naming Conventions
- Use descriptive names: `CreateUsersTable`, `AddEmailToUsers`
- Use PascalCase for class names
- Timestamp is auto-generated

### 2. Always Test
- Test migrations in development first
- Test both `up` and `down` methods
- Verify data integrity after migration

### 3. Never Modify Existing Migrations
- Once a migration is deployed, never modify it
- Create a new migration to fix issues
- Keep migration history intact

### 4. Data Migrations
- Separate schema migrations from data migrations
- Use transactions for data migrations
- Handle edge cases (null values, defaults)

### 5. Production Safety
- Always backup database before running migrations
- Test in staging environment first
- Have a rollback plan
- Monitor migration execution

## Troubleshooting

### Migration Already Exists
```bash
# Check migration status
npm run migration:show

# If migration is already run, revert it first
npm run migration:revert

# Then run again
npm run migration:run
```

### Migration Failed
```bash
# Check the error message
# Fix the issue in the migration file
# Revert if partially applied
npm run migration:revert

# Run again
npm run migration:run
```

### Reset Database (Development Only)
```bash
# Drop and recreate schema
docker-compose exec postgres psql -U postgres -d myntra_oms_db \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Run all migrations
npm run migration:run

# Seed database
npm run seed
```

## Migration vs Synchronize

### Synchronize (Development)
```typescript
{
  synchronize: true // Auto-sync schema with entities
}
```
- **Pros:** Fast development, no migration files needed
- **Cons:** Can lose data, not safe for production

### Migrations (Production)
```typescript
{
  synchronize: false // Use migrations for schema changes
}
```
- **Pros:** Version controlled, safe, reversible
- **Cons:** Requires manual migration generation

## Current Setup

The project is currently set to:
- **Development:** `synchronize: true` (auto-sync enabled)
- **Production:** Should use `synchronize: false` and migrations

To switch to migrations-only mode:

1. Update `src/config/typeorm.ts`:
   ```typescript
   synchronize: false, // Disable auto-sync
   ```

2. Run migrations:
   ```bash
   npm run migration:run
   ```

## Additional Resources

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [TypeORM Migration API](https://typeorm.io/migration-api)
- [Best Practices](https://typeorm.io/migrations#creating-a-new-migration)

---

**Note:** The migration files have been created but not yet run. The current setup uses `synchronize: true` for automatic schema synchronization during development.

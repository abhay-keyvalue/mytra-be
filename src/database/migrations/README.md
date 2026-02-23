# Database Migrations

This directory contains TypeORM migration files for the Myntra OMS Backend database schema.

## Migration Files

### 1. CreateUsersTable (1737544800000)
**File:** `1737544800000-CreateUsersTable.ts`

**Creates:**
- `users` table with all user fields
- `users_role_enum` (CUSTOMER, ADMIN)
- UUID extension

**Columns:**
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR, Unique, Nullable)
- role (ENUM, Default: CUSTOMER)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 2. CreateProductsTable (1737544900000)
**File:** `1737544900000-CreateProductsTable.ts`

**Creates:**
- `products` table for product catalog

**Columns:**
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT, Nullable)
- price (DECIMAL 10,2)
- category (VARCHAR)
- brand (VARCHAR, Nullable)
- image_url (VARCHAR, Nullable)
- stock (INTEGER, Default: 0)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 3. CreateOrdersTable (1737545000000)
**File:** `1737545000000-CreateOrdersTable.ts`

**Creates:**
- `orders` table for order headers
- `orders_status_enum` (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `orders_payment_status_enum` (PENDING, PAID, FAILED, REFUNDED)
- Foreign key to `users` table

**Columns:**
- id (UUID, Primary Key)
- order_number (VARCHAR, Unique)
- user_id (UUID, Foreign Key → users.id, CASCADE)
- status (ENUM, Default: PENDING)
- total_amount (DECIMAL 10,2)
- shipping_address (TEXT, Nullable)
- payment_method (VARCHAR, Nullable)
- payment_status (ENUM, Default: PENDING)
- notes (TEXT, Nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 4. CreateOrderItemsTable (1737545100000)
**File:** `1737545100000-CreateOrderItemsTable.ts`

**Creates:**
- `order_items` table for order line items
- Foreign key to `orders` table (CASCADE on delete)
- Foreign key to `products` table (RESTRICT on delete)

**Columns:**
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key → orders.id, CASCADE)
- product_id (UUID, Foreign Key → products.id, RESTRICT)
- quantity (INTEGER)
- price (DECIMAL 10,2) - Price at time of order
- subtotal (DECIMAL 10,2) - quantity × price
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Running Migrations

### Show Migration Status
```bash
npm run migration:show
```

### Run All Pending Migrations
```bash
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Generate New Migration
```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

## Migration Order

Migrations must be run in this order:
1. CreateUsersTable (creates users table)
2. CreateProductsTable (creates products table)
3. CreateOrdersTable (depends on users)
4. CreateOrderItemsTable (depends on orders and products)

TypeORM automatically runs them in the correct order based on timestamps.

## Database Schema

```
┌─────────────────┐
│     users       │
│  (Auth & Profile)│
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐
│     orders      │
│  (Order Header) │
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐      N:1     ┌─────────────┐
│  order_items    │◄──────────────┤  products   │
│  (Order Lines)  │               │  (Catalog)  │
└─────────────────┘               └─────────────┘
```

## Foreign Key Constraints

- **orders.user_id → users.id** (CASCADE on delete)
  - When a user is deleted, all their orders are deleted
  
- **order_items.order_id → orders.id** (CASCADE on delete)
  - When an order is deleted, all its items are deleted
  
- **order_items.product_id → products.id** (RESTRICT on delete)
  - Cannot delete a product if it's in any order

## Current Setup

The project currently uses **`synchronize: true`** in development mode, which means:
- TypeORM automatically creates/updates tables based on entities
- Migration files are provided for reference and production use
- No need to run migrations manually in development

To switch to migrations-only mode:
1. Set `synchronize: false` in `src/config/typeorm.ts`
2. Run `npm run migration:run`

## Production Deployment

For production, always:
1. Set `synchronize: false`
2. Run migrations: `npm run migration:run`
3. Never use auto-sync in production

## Notes

- Migration timestamps are in Unix epoch format
- Each migration has `up()` and `down()` methods
- Migrations are tracked in `typeorm_migrations` table
- Always test migrations before deploying to production

---

**Last Updated:** January 22, 2026  
**Total Migrations:** 4  
**Status:** Ready for use

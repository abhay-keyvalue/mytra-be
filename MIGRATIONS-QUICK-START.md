# Migrations Quick Start

## 🚀 Quick Commands

```bash
# Show migration status
npm run migration:show

# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate new migration from entity changes
npm run migration:generate -- src/database/migrations/MigrationName
```

## 📁 Migration Files

Located in: `src/database/migrations/`

1. **1737544800000-CreateUsersTable.ts** - Users table + UserRole enum
2. **1737544900000-CreateProductsTable.ts** - Products table
3. **1737545000000-CreateOrdersTable.ts** - Orders table + enums + FK to users
4. **1737545100000-CreateOrderItemsTable.ts** - Order items + FKs

## 🧪 Test Migrations (Fresh Database)

```bash
# 1. Reset database
docker-compose exec postgres psql -U postgres -d myntra_oms_db \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Disable auto-sync (edit src/config/typeorm.ts)
# Change: synchronize: false

# 3. Run migrations
npm run migration:run

# 4. Verify tables
docker-compose exec postgres psql -U postgres -d myntra_oms_db -c "\dt"

# 5. Seed database
npm run seed

# 6. Start server
npm run dev
```

## 📊 Database Schema

```
users (10 columns)
  ├── id (UUID, PK)
  ├── email (VARCHAR, UNIQUE)
  ├── password (VARCHAR)
  ├── first_name, last_name (VARCHAR)
  ├── phone (VARCHAR, UNIQUE, NULLABLE)
  ├── role (ENUM: CUSTOMER, ADMIN)
  ├── is_active (BOOLEAN)
  └── created_at, updated_at (TIMESTAMP)

products (11 columns)
  ├── id (UUID, PK)
  ├── name, category, brand (VARCHAR)
  ├── description (TEXT)
  ├── price (DECIMAL 10,2)
  ├── image_url (VARCHAR)
  ├── stock (INTEGER)
  ├── is_active (BOOLEAN)
  └── created_at, updated_at (TIMESTAMP)

orders (11 columns)
  ├── id (UUID, PK)
  ├── order_number (VARCHAR, UNIQUE)
  ├── user_id (UUID, FK → users.id, CASCADE)
  ├── status (ENUM: PENDING, CONFIRMED, etc.)
  ├── total_amount (DECIMAL 10,2)
  ├── shipping_address (TEXT)
  ├── payment_method (VARCHAR)
  ├── payment_status (ENUM: PENDING, PAID, etc.)
  ├── notes (TEXT)
  └── created_at, updated_at (TIMESTAMP)

order_items (8 columns)
  ├── id (UUID, PK)
  ├── order_id (UUID, FK → orders.id, CASCADE)
  ├── product_id (UUID, FK → products.id, RESTRICT)
  ├── quantity (INTEGER)
  ├── price, subtotal (DECIMAL 10,2)
  └── created_at, updated_at (TIMESTAMP)
```

## 🔑 Foreign Keys

- `orders.user_id → users.id` (CASCADE)
- `order_items.order_id → orders.id` (CASCADE)
- `order_items.product_id → products.id` (RESTRICT)

## ⚙️ Current Setup

**Development Mode:**
- `synchronize: true` - Auto-sync enabled
- Migrations not required (but available)
- Schema updates automatically

**Production Mode:**
- Set `synchronize: false`
- Use migrations for all schema changes
- Run `npm run migration:run` during deployment

## 📚 More Info

See `MIGRATIONS-GUIDE.md` for comprehensive documentation.

---

**Created:** January 22, 2026  
**Total Migrations:** 4  
**Status:** ✅ Ready

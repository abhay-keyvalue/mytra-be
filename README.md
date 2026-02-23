# Myntra OMS Backend - Order Management System

A robust and scalable Order Management System (OMS) backend built with Node.js, Express, TypeScript, and PostgreSQL. This system provides REST APIs for user authentication, product listing, and comprehensive order management.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework for Node.js
- **PostgreSQL**: Robust relational database for data persistence
- **TypeORM**: Type-safe ORM with decorator-based entities
- **JWT Authentication**: Secure user authentication and authorization
- **bcrypt**: Secure password hashing with salt rounds
- **Docker Support**: Containerized application with Docker and Docker Compose
- **Modular Architecture**: Clean, maintainable, and scalable code structure
- **Environment Configuration**: Flexible configuration using environment variables
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging middleware for API requests
- **Input Validation**: Express-validator for request validation
- **Health Check**: Built-in health check endpoint for monitoring

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v15 or higher) - Optional if using Docker
- **Docker** and **Docker Compose** (for containerized deployment)

## 📁 Project Structure

```
myntra-be/
├── src/
│   ├── config/              # Configuration files
│   │   ├── typeorm.ts       # TypeORM DataSource configuration
│   │   └── env.ts           # Environment variables configuration
│   ├── entities/            # TypeORM entities
│   │   ├── User.ts          # User entity
│   │   ├── Product.ts       # Product entity
│   │   ├── Order.ts         # Order entity
│   │   └── OrderItem.ts     # OrderItem entity
│   ├── services/            # Business logic layer
│   │   └── auth.service.ts  # Authentication service
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.ts # Authentication controller
│   ├── middlewares/         # Express middlewares
│   │   ├── logger.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── auth.middleware.ts # JWT authentication middleware
│   ├── routes/              # API routes
│   │   ├── index.ts         # Main router
│   │   ├── health.routes.ts # Health check routes
│   │   └── auth.routes.ts   # Authentication routes
│   ├── utils/               # Utility functions
│   │   └── auth.utils.ts    # Password hashing, JWT utils
│   ├── validators/          # Request validators
│   │   └── auth.validator.ts # Authentication validators
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types
│   ├── database/            # Database scripts
│   │   └── seed.ts          # Database seed script
│   └── app.ts               # Application entry point
├── dist/                    # Compiled JavaScript (generated)
├── .env                     # Environment variables (create from .env.example)
├── .gitignore               # Git ignore file
├── .dockerignore            # Docker ignore file
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Node.js dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## 🛠️ Installation

### Option 1: Local Development Setup

1. **Clone the repository**
   ```bash
   cd /Users/abhay/Sandbox/BE/myntra-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Make sure PostgreSQL is running on localhost:5432
   # Create database: myntra_oms_db
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Option 2: Docker Setup (Recommended)

1. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f api
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

4. **Stop services and remove volumes**
   ```bash
   docker-compose down -v
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:watch` - Start development server with file watching
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production build
- `npm run seed` - Seed database with sample data
- `npm run migration:generate -- -n MigrationName` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm test` - Run tests (to be implemented)

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Check server health status
  ```json
  {
    "status": "OK",
    "message": "Server is running",
    "timestamp": "2026-01-19T10:00:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
  ```

### API Base URL
- **Base URL**: `http://localhost:3000/api/v1`

### Authentication APIs ✅

#### Register User
- **POST** `/api/v1/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "CUSTOMER"
      },
      "token": "jwt-token"
    }
  }
  ```

#### Login User
- **POST** `/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "CUSTOMER"
      },
      "token": "jwt-token"
    }
  }
  ```

#### Get User Profile (Protected)
- **GET** `/api/v1/auth/profile`
- **Headers:** `Authorization: Bearer <jwt-token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+919876543210",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-01-22T12:00:00.000Z"
    }
  }
  ```

### Test Credentials

**Admin:**
- Email: `admin@myntra.com`
- Password: `admin123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

### Future Endpoints (Coming Soon)

- **Products** (Public)
  - `GET /api/v1/products` - List all products
  - `GET /api/v1/products/:id` - Get product by ID

- **Orders** (Protected)
  - `POST /api/v1/orders` - Create new order
  - `GET /api/v1/orders` - Get all orders (user's orders)
  - `GET /api/v1/orders/:id` - Get order by ID
  - `PUT /api/v1/orders/:id` - Update order
  - `PATCH /api/v1/orders/:id` - Partially update order
  - `DELETE /api/v1/orders/:id` - Cancel order

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myntra_oms_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=myntra-oms-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_PREFIX=/api/v1
```

## 🐳 Docker Services

The `docker-compose.yml` includes the following services:

1. **postgres** - PostgreSQL database (port 5432)
2. **api** - Node.js backend API (port 3000)
3. **pgadmin** - PostgreSQL admin interface (port 5050)

### Accessing Services

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **pgAdmin**: http://localhost:5050
  - Email: admin@myntra.com
  - Password: admin

## 🏗️ Architecture

### Modular Structure

The application follows a modular architecture with clear separation of concerns:

- **Config**: Centralized configuration management (TypeORM DataSource, environment)
- **Entities**: TypeORM entity definitions (User, Product, Order, OrderItem)
- **Services**: Business logic layer (authentication, data operations)
- **Controllers**: Request handlers (authentication)
- **Middlewares**: Reusable middleware functions (logging, error handling, auth)
- **Routes**: API endpoint definitions (health, auth)
- **Validators**: Input validation schemas (express-validator)
- **Utils**: Helper functions and utilities (password hashing, JWT)
- **Types**: TypeScript type definitions
- **Database**: Database scripts (seed data)

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs (12 rounds)

## 🗄️ Database & ORM

### TypeORM

This project uses **TypeORM** as the Object-Relational Mapper (ORM) for database operations.

**Key Features:**
- Decorator-based entity definitions
- Type-safe database queries
- Automatic schema synchronization (development)
- Migration system for production
- Repository pattern for data access
- Support for relations and transactions

**Database Schema:**
- **Users** - User authentication and profiles
- **Products** - Product catalog
- **Orders** - Order headers
- **OrderItems** - Order line items (junction table)

**Enums:**
- `UserRole`: CUSTOMER, ADMIN
- `OrderStatus`: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `PaymentStatus`: PENDING, PAID, FAILED, REFUNDED

**Commands:**
```bash
# Seed database with sample data
npm run seed

# Generate migration from entity changes
npm run migration:generate -- -n MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

For more details, see [TYPEORM-MIGRATION-GUIDE.md](./TYPEORM-MIGRATION-GUIDE.md)

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- JWT-based authentication (configurable expiration)
- Password hashing with bcrypt (12 salt rounds)
- Environment variable protection
- Input validation and sanitization (express-validator)
- SQL injection protection (TypeORM parameterized queries)
- Protected routes with JWT middleware

## 📊 Database

### PostgreSQL Setup

The application uses PostgreSQL as the primary database. The schema will include:

- **users** - User accounts and authentication
- **products** - Product catalog
- **orders** - Order information
- **order_items** - Order line items

Database migrations and seed data will be added in future steps.

## 🚦 Testing

```bash
# Run tests (to be implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Test your changes locally
4. Build and ensure no TypeScript errors
5. Commit your changes
6. Create a pull request

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `myntra_oms_db`

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v
# Rebuild containers
docker-compose up --build
```

## 📚 Next Steps

This is Step 1 of the OMS backend development. Future steps will include:

- **Step 2**: Database schema design and migrations
- **Step 3**: User authentication (register, login, JWT)
- **Step 4**: Product management APIs
- **Step 5**: Order management APIs (CRUD)
- **Step 6**: Advanced features (search, filters, pagination)
- **Step 7**: Testing and documentation
- **Step 8**: Deployment and CI/CD

## 👥 Contributing

This is an assignment project. Please follow the coding standards and best practices.

## 📄 License

ISC

## 📧 Contact

For questions or issues, please contact the development team.

---

**Built with ❤️ using Node.js, TypeScript, and Express**

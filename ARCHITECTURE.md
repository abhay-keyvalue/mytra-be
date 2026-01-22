# Architecture Overview - Myntra OMS Backend

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  (Browser, Mobile App, API Clients, Postman, curl, etc.)   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOCKER NETWORK                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API SERVER (Port 3000)                   │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │           Express.js Application               │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │         Security Middleware              │  │  │  │
│  │  │  │  • Helmet (Security Headers)             │  │  │  │
│  │  │  │  • CORS (Cross-Origin)                   │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │         Body Parser Middleware           │  │  │  │
│  │  │  │  • JSON Parser                           │  │  │  │
│  │  │  │  • URL-encoded Parser                    │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │         Logger Middleware                │  │  │  │
│  │  │  │  • Request Logging                       │  │  │  │
│  │  │  │  • Response Time Tracking                │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │              ROUTES                      │  │  │  │
│  │  │  │  • /health                               │  │  │  │
│  │  │  │  • /api/v1/health                        │  │  │  │
│  │  │  │  • /api/v1/* (future)                    │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │         Error Middleware                 │  │  │  │
│  │  │  │  • 404 Handler                           │  │  │  │
│  │  │  │  • Global Error Handler                  │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ pg (PostgreSQL Client)             │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database (Port 5432)              │  │
│  │  • Database: myntra_oms_db                           │  │
│  │  • User: postgres                                    │  │
│  │  • Persistent Volume: postgres_data                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ (Management Interface)             │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            pgAdmin (Port 5050)                       │  │
│  │  • Web-based PostgreSQL Admin                        │  │
│  │  • Email: admin@myntra.com                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Request Flow

```
1. Client Request
   │
   ├─→ HTTP Request to http://localhost:3000/api/v1/health
   │
2. Express Middleware Chain
   │
   ├─→ Helmet (Security Headers)
   │
   ├─→ CORS (Cross-Origin Check)
   │
   ├─→ Body Parser (Parse JSON/URL-encoded)
   │
   ├─→ Logger (Log Request)
   │
3. Router
   │
   ├─→ Match Route (/api/v1/health)
   │
4. Route Handler
   │
   ├─→ Execute Business Logic
   │
   ├─→ Database Query (if needed)
   │
5. Response
   │
   ├─→ Send JSON Response
   │
   ├─→ Logger (Log Response Time)
   │
6. Client Receives Response
```

## 🗂️ Code Architecture (Layered)

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                      (Routes)                            │
│  • health.routes.ts                                      │
│  • index.ts (router aggregator)                          │
│                                                           │
│  Responsibility: Define API endpoints and HTTP methods   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                   │
│                    (Controllers)                         │
│  • Future: auth.controller.ts                            │
│  • Future: product.controller.ts                         │
│  • Future: order.controller.ts                           │
│                                                           │
│  Responsibility: Handle requests, validate input,        │
│                  coordinate services                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                        │
│                     (Services)                           │
│  • Future: auth.service.ts                               │
│  • Future: product.service.ts                            │
│  • Future: order.service.ts                              │
│                                                           │
│  Responsibility: Business logic, data transformation     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│                      (Models)                            │
│  • Future: user.model.ts                                 │
│  • Future: product.model.ts                              │
│  • Future: order.model.ts                                │
│                                                           │
│  Responsibility: Database operations, queries            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      DATABASE                            │
│                   PostgreSQL 15                          │
│  • Tables: users, products, orders, order_items          │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Configuration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   .env File                              │
│  • PORT, DB_HOST, JWT_SECRET, etc.                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                config/env.ts                             │
│  • Loads environment variables                           │
│  • Provides typed config object                          │
│  • Validates required variables                          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ├─→ config/database.ts
                         │   • Database configuration
                         │   • Connection utilities
                         │
                         ├─→ app.ts
                         │   • Server configuration
                         │   • Port, host, etc.
                         │
                         └─→ Other modules
                             • Use config throughout app
```

## 🛡️ Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
│                                                           │
│  1. Helmet.js                                            │
│     • X-Content-Type-Options                             │
│     • X-Frame-Options                                    │
│     • X-XSS-Protection                                   │
│     • Strict-Transport-Security                          │
│                                                           │
│  2. CORS                                                 │
│     • Allowed origins configuration                      │
│     • Credentials handling                               │
│                                                           │
│  3. Environment Variables                                │
│     • No hardcoded secrets                               │
│     • .env not in version control                        │
│                                                           │
│  4. Docker Security                                      │
│     • Non-root user                                      │
│     • Minimal base image (alpine)                        │
│                                                           │
│  5. Input Validation (Future)                            │
│     • Express Validator                                  │
│     • Sanitization                                       │
│                                                           │
│  6. Authentication (Future)                              │
│     • JWT tokens                                         │
│     • bcrypt password hashing                            │
└─────────────────────────────────────────────────────────┘
```

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  docker-compose.yml                      │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Service: postgres                               │    │
│  │  • Image: postgres:15-alpine                     │    │
│  │  • Port: 5432                                    │    │
│  │  • Volume: postgres_data                         │    │
│  │  • Health Check: pg_isready                      │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                 │
│                         ▼                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Service: api                                    │    │
│  │  • Build: Dockerfile                             │    │
│  │  • Port: 3000                                    │    │
│  │  • Depends on: postgres                          │    │
│  │  • Health Check: wget /health                    │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                 │
│                         ▼                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Service: pgadmin                                │    │
│  │  • Image: dpage/pgadmin4                         │    │
│  │  • Port: 5050                                    │    │
│  │  • Depends on: postgres                          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Network: myntra-network (bridge)                        │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Build Process

```
┌─────────────────────────────────────────────────────────┐
│                 Development Build                        │
│                                                           │
│  src/*.ts  ──tsx──>  Direct Execution                    │
│                      (No compilation)                    │
│                                                           │
│  Command: npm run dev                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Production Build                         │
│                                                           │
│  src/*.ts  ──tsc──>  dist/*.js  ──node──>  Execution    │
│                      (Compiled)                          │
│                                                           │
│  Commands: npm run build && npm start                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Docker Build                           │
│                                                           │
│  Stage 1: Builder                                        │
│  • Install all dependencies                              │
│  • Compile TypeScript                                    │
│                                                           │
│  Stage 2: Production                                     │
│  • Install production dependencies only                  │
│  • Copy compiled files from Stage 1                      │
│  • Create non-root user                                  │
│  • Set up health check                                   │
│                                                           │
│  Command: docker-compose build                           │
└─────────────────────────────────────────────────────────┘
```

## 📦 Module Dependencies

```
app.ts
├── express (framework)
├── cors (middleware)
├── helmet (middleware)
├── config/env.ts
│   └── dotenv
├── config/database.ts
│   ├── pg (PostgreSQL client)
│   └── config/env.ts
├── middlewares/logger.middleware.ts
├── middlewares/error.middleware.ts
└── routes/index.ts
    └── routes/health.routes.ts
```

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
│                                                           │
│  Load Balancer (nginx/AWS ALB)                          │
│         │                                                │
│         ├─→ API Instance 1 (Docker Container)           │
│         ├─→ API Instance 2 (Docker Container)           │
│         └─→ API Instance 3 (Docker Container)           │
│                    │                                     │
│                    ▼                                     │
│         PostgreSQL (AWS RDS/Managed)                    │
│                    │                                     │
│                    ▼                                     │
│         Redis (Caching/Sessions)                        │
│                                                           │
│  Monitoring: Prometheus, Grafana                        │
│  Logging: ELK Stack / CloudWatch                        │
│  CI/CD: GitHub Actions / Jenkins                        │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Error Handling Flow

```
1. Error Occurs
   │
   ├─→ Operational Error (Expected)
   │   • Validation error
   │   • Not found error
   │   • Authentication error
   │   │
   │   └─→ Error Middleware
   │       • Log error
   │       • Send appropriate status code
   │       • Send user-friendly message
   │
   └─→ Programming Error (Unexpected)
       • Syntax error
       • Null reference
       • Database connection error
       │
       └─→ Error Middleware
           • Log full stack trace
           • Send 500 status code
           • Send generic message (production)
           • Send detailed error (development)
```

## 📊 Data Flow (Future - with Database)

```
Client Request
   │
   ├─→ POST /api/v1/orders
   │
   ├─→ Route Handler
   │
   ├─→ Validation Middleware
   │   • Check required fields
   │   • Validate data types
   │
   ├─→ Authentication Middleware
   │   • Verify JWT token
   │   • Extract user ID
   │
   ├─→ Order Controller
   │   • Parse request body
   │   • Call order service
   │
   ├─→ Order Service
   │   • Business logic
   │   • Calculate totals
   │   • Check inventory
   │
   ├─→ Order Model
   │   • Database query
   │   • INSERT INTO orders
   │
   ├─→ Database
   │   • Execute query
   │   • Return result
   │
   ├─→ Response
   │   • Format data
   │   • Send JSON
   │
   └─→ Client receives order confirmation
```

## 🎯 Current vs Future Architecture

### Current (Step 1) ✅
- Express server setup
- Basic routing
- Middleware configuration
- Health check endpoint
- Docker containerization
- PostgreSQL setup

### Future (Steps 2-8) 🔄
- Database schema and migrations
- User authentication (JWT)
- Product management APIs
- Order management APIs
- Advanced features (search, pagination)
- Testing (unit, integration)
- CI/CD pipeline
- Production deployment

---

**Architecture Status**: Foundation Complete ✅
**Next Phase**: Database Layer Implementation

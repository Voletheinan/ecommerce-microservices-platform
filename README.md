# E-Commerce Microservices Platform

Một hệ thống E-commerce Microservices hoàn chỉnh với 9 services độc lập, sử dụng các công nghệ hiện đại nhất.

## 🏗️ Kiến trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                        │
│              - React 19 + TypeScript                            │
│              - Tailwind CSS + Radix UI                          │
│              - SWR Data Fetching                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
             ┌───────────────────────────┐
             │    API Gateway (Nginx)    │
             │    - Port: 80, 8080       │
             │    - Routing & Proxy      │
             │    - CORS Handling        │
             └───────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┬────────────────────┐
    ▼                    ▼                    ▼                    ▼
┌─────────┐        ┌──────────┐        ┌──────────┐        ┌──────────┐
│  User   │        │ Product  │        │  Order   │        │ Payment  │
│ Service │        │ Service  │        │ Service  │        │ Service  │
│ (8001)  │        │ (8002)   │        │ (8003)   │        │ (8004)   │
└─────────┘        └──────────┘        └──────────┘        └──────────┘
                         │                   │
              ┌──────────┴──────────┐        │
              ▼                     ▼        ▼
        ┌──────────┐          ┌──────────┐ ┌──────────────┐
        │ Inventory│          │   Tax    │ │ Notification │
        │ (8002)   │          │ (8003)   │ │   (8003)     │
        └──────────┘          └──────────┘ └──────────────┘
                         │
    ┌────────────────────┼────────────────────┬────────────────────┐
    ▼                    ▼                    ▼                    ▼
┌──────────┐       ┌──────────┐        ┌──────────┐        ┌──────────┐
│ Shipping │       │Promotion │        │  Rating  │        │   Cart   │
│ Service  │       │ Service  │        │ Service  │        │ Service  │
│ (8006)   │       │ (8007)   │        │ (8008)   │        │ (8013)   │
└──────────┘       └──────────┘        └──────────┘        └──────────┘
                         │
    ┌────────────────────────────────────────────────────────────────┐
    │                    Message Bus (Kafka)                         │
    │                    - Port: 9092                                │
    │                    - Event-Driven Communication                │
    └────────────────────────────────────────────────────────────────┘
                         │
    ┌────────────────────────────────────────────────────────────────┐
    │                   Supporting Services                          │
    │  - Discovery Service (8000) - Service Registry via Redis       │
    └────────────────────────────────────────────────────────────────┘
                         │
    ┌────────────────────────────────────────────────────────────────┐
    │                   Databases & Cache                            │
    ├────────────────────────────────────────────────────────────────┤
    │  MySQL (3307)    - User, Orders, Payments, Inventory, etc.     │
    │  MongoDB (27017) - Products Catalog                            │
    │  Redis (6379)    - Cache, Session, Service Registry            │
    └────────────────────────────────────────────────────────────────┘
```

## 🧩 Microservices (9 Services)

| Service | Port | Database | Mô tả | Trạng thái |
|---------|------|----------|-------|-----------|
| **Discovery Service** | 8000 | Redis | Service Registry - Quản lý service discovery | ✅ Active |
| **User Service** | 8001 | MySQL | Authentication, User Management, JWT, User Profile | ✅ Active |
| **Product Service** | 8002 | MongoDB + MySQL | Product Catalog, Search, Favourites, Inventory | ✅ Active |
| **Order Service** | 8003 | MySQL | Order Management, Tax Calculation, Notifications | ✅ Active |
| **Payment Service** | 8004 | MySQL | Payment Processing, Transactions | ✅ Active |
| **Shipping Service** | 8006 | MySQL | Shipment Tracking, Logistics, Delivery | ✅ Active |
| **Promotion Service** | 8007 | MySQL | Discount Management, Vouchers, Campaigns | ✅ Active |
| **Rating Service** | 8008 | MySQL | Product Reviews, Ratings, User Feedback | ✅ Active |
| **Cart Service** | 8013 | In-Memory | Shopping Cart Management | ✅ Active |

### Integrated Services (đã được gộp để tối ưu):

| Service gốc | Được tích hợp vào | Mô tả |
|-------------|-------------------|-------|
| Search Service | Product Service | Tìm kiếm sản phẩm với `/api/search` |
| Favourite Service | Product Service | Quản lý sản phẩm yêu thích với `/api/favourites` |
| Inventory Service | Product Service | Quản lý kho hàng với `/api/inventory` |
| Tax Service | Order Service | Tính thuế với `/api/tax` |
| Notification Service | Order Service | Thông báo với `/api/notifications` |

## 🛠️ Công nghệ Stack

### Frontend
| Công nghệ | Version | Mô tả |
|-----------|---------|-------|
| **Next.js** | 16.0.7 | React framework với App Router |
| **React** | 19.2.0 | UI Library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.1.9 | Utility-first CSS |
| **Radix UI** | Latest | Headless UI components |
| **SWR** | Latest | Data fetching & caching |
| **React Hook Form** | 7.60.0 | Form management |
| **Zod** | 3.25.76 | Schema validation |
| **Recharts** | 2.15.4 | Charts & visualization |
| **Lucide React** | 0.454.0 | Icons |

### Backend
| Công nghệ | Version | Mô tả |
|-----------|---------|-------|
| **FastAPI** | 0.104.1 | Modern async web framework |
| **Python** | 3.9+ | Programming language |
| **SQLAlchemy** | 2.0.23 | ORM cho MySQL |
| **Motor** | 3.3.2 | Async driver cho MongoDB |
| **Pydantic** | 2.5.0 | Data validation |
| **Uvicorn** | 0.24.0 | ASGI server |
| **aiomysql** | 0.2.0 | Async MySQL driver |

### Database
| Database | Version | Port | Mô tả |
|----------|---------|------|-------|
| **MySQL** | 8.0 | 3307 | User, Orders, Payments, Inventory, Shipping, Promotions, Ratings |
| **MongoDB** | 7.0 | 27017 | Product catalogs (flexible schema) |
| **Redis** | 7-alpine | 6379 | Cache, Session, Service Registry |

### Message Queue & Infrastructure
| Công nghệ | Version | Port | Mô tả |
|-----------|---------|------|-------|
| **Apache Kafka** | 7.5.0 | 9092 | Event streaming |
| **Zookeeper** | 7.5.0 | 2181 | Kafka coordination |
| **Nginx** | Latest | 80, 8080 | API Gateway, Reverse proxy |
| **Docker** | 20.10+ | - | Containerization |
| **Docker Compose** | 2.0+ | - | Orchestration |

### Security
| Công nghệ | Mô tả |
|-----------|-------|
| **JWT** | Token-based authentication |
| **BCrypt** | Password hashing (via passlib) |
| **python-jose** | JWT encoding/decoding |
| **CORS** | Cross-origin resource sharing |

## 📦 Cấu trúc Dự án

```
ecommerce-microservices-platform/
│
├── config/                              # Shared configuration
│   ├── __init__.py
│   ├── settings.py                      # Environment variables
│   ├── database.py                      # MySQL & MongoDB connections
│   ├── kafka.py                         # Kafka producer/consumer
│   ├── jwt_auth.py                      # JWT validation
│   └── registry.py                      # Service discovery with Redis
│
├── api-gateway/                         # API Gateway (Nginx)
│   ├── Dockerfile
│   └── nginx.conf                       # Routing rules
│
├── fontend/                             # Frontend (Next.js 16)
│   ├── app/                             # App Router
│   │   ├── page.tsx                     # Home page
│   │   ├── layout.tsx                   # Root layout
│   │   ├── admin/                       # Admin dashboard
│   │   │   ├── orders/                  # Order management
│   │   │   ├── products/                # Product management
│   │   │   ├── promotions/              # Promotion management
│   │   │   ├── shipping/                # Shipping management
│   │   │   └── users/                   # User management
│   │   ├── cart/                        # Shopping cart
│   │   ├── checkout/                    # Checkout process
│   │   ├── favourites/                  # User favourites
│   │   ├── login/                       # Login page
│   │   ├── register/                    # Registration page
│   │   ├── orders/                      # User orders
│   │   ├── order-success/               # Order confirmation
│   │   ├── products/                    # Product listing & detail
│   │   └── profile/                     # User profile
│   ├── components/                      # React components
│   │   ├── ui/                          # Shadcn/ui components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── hero-banner.tsx
│   │   └── ...
│   ├── lib/                             # Utilities
│   │   ├── api-client.ts                # HTTP client
│   │   ├── api-services.ts              # API service layer
│   │   ├── api-config.ts                # API endpoints
│   │   ├── types.ts                     # TypeScript interfaces
│   │   └── utils.ts                     # Helper functions
│   ├── hooks/                           # Custom React hooks
│   ├── contexts/                        # React contexts
│   └── package.json
│
├── discovery-service/                   # Service Registry (Port 8000)
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── user-service/                        # User & Auth (Port 8001)
│   ├── main.py
│   ├── models/
│   │   ├── user.py                      # User model
│   │   └── user_profile.py              # Profile model
│   ├── routers/
│   │   └── auth.py                      # Auth routes
│   ├── services/
│   │   ├── user_service.py
│   │   └── user_profile_service.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── product-service/                     # Product + Inventory + Favourites (Port 8002)
│   ├── main.py
│   ├── models/
│   │   ├── product.py                   # Product model (MongoDB)
│   │   ├── favourite.py                 # Favourite model (MySQL)
│   │   └── inventory.py                 # Inventory model (MySQL)
│   ├── routers/
│   │   ├── product.py                   # Product CRUD
│   │   ├── favourite.py                 # Favourites endpoints
│   │   ├── inventory.py                 # Inventory endpoints
│   │   └── general.py                   # Search, categories
│   ├── services/
│   │   ├── product_service.py
│   │   └── favourite_service.py
│   ├── seed_products.py                 # Data seeding
│   ├── Dockerfile
│   └── requirements.txt
│
├── order-service/                       # Order + Tax + Notification (Port 8003)
│   ├── main.py
│   ├── models/
│   │   ├── order.py                     # Order model
│   │   └── tax_notification.py          # Tax & Notification models
│   ├── routers/
│   │   ├── order.py                     # Order endpoints
│   │   ├── tax.py                       # Tax calculation
│   │   └── notification.py              # Notifications
│   ├── services/
│   │   ├── order_service.py
│   │   ├── tax_service.py
│   │   └── notification_service.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── payment-service/                     # Payment Processing (Port 8004)
│   ├── main.py
│   ├── models/payment.py
│   ├── routers/payment.py
│   ├── services/
│   ├── Dockerfile
│   └── requirements.txt
│
├── shipping-service/                    # Shipping & Logistics (Port 8006)
│   ├── main.py
│   ├── models/
│   │   ├── shipment.py
│   │   └── schema.py
│   ├── routers/shipping.py
│   ├── services/shipping_service.py
│   ├── seed_shipments.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── promotion-service/                   # Discounts & Vouchers (Port 8007)
│   ├── main.py
│   ├── application/
│   │   ├── dtos.py                      # Data transfer objects
│   │   └── use_cases.py                 # Business logic
│   ├── domain/                          # Domain logic
│   ├── infrastructure/
│   │   ├── models.py                    # SQLAlchemy models
│   │   └── repositories.py              # Data access
│   ├── presentation/
│   │   └── routes.py                    # API endpoints
│   ├── seed_promotions.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── rating-service/                      # Product Reviews (Port 8008)
│   ├── main.py
│   ├── models/
│   │   ├── rating.py
│   │   └── schema.py
│   ├── routers/rating.py
│   ├── services/rating_service.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── cart-service/                        # Shopping Cart (Port 8013)
│   ├── main.py                          # In-memory cart implementation
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml                   # Full stack orchestration
├── POSTMAN_API_COLLECTION.json          # API testing collection
├── seed-db.sh                           # Database initialization
├── requirements.txt                     # Shared Python dependencies
└── README.md                            # This file
```

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Required:
- Docker Desktop v20.10+
- Docker Compose v2.0+
- Git
- Node.js 18+ (for frontend development)
- Python 3.9+ (for local backend development)
- pnpm (for frontend package management)
```

### 2. Clone Repository
```bash
git clone https://github.com/your-repo/ecommerce-microservices.git
cd ecommerce-microservices-platform
```

### 3. Start All Services
```bash
# Option 1: Start all services in background
docker-compose up -d

# Option 2: Start with build (if code changed)
docker-compose up -d --build

# Option 3: Start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### 4. Start Frontend (Development)
```bash
cd fontend
pnpm install
pnpm dev
```

### 5. Verify Installation
```bash
# Check all containers are running
docker-compose ps

# Test service health endpoints
curl http://localhost:8000/health  # Discovery Service
curl http://localhost:8001/health  # User Service
curl http://localhost:8002/health  # Product Service
curl http://localhost:8003/health  # Order Service
curl http://localhost:8004/health  # Payment Service
curl http://localhost:8006/health  # Shipping Service
curl http://localhost:8007/health  # Promotion Service
curl http://localhost:8008/health  # Rating Service
curl http://localhost:8013/health  # Cart Service

# Test via API Gateway
curl http://localhost/health
curl http://localhost/api/products
```

### 6. Access Points
| Service | URL | Mô tả |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Next.js App |
| API Gateway | http://localhost:80 hoặc http://localhost:8080 | Nginx Proxy |
| Mongo Express | http://localhost:8081 | MongoDB GUI (root/root123) |
| Swagger Docs | http://localhost:800X/docs | FastAPI auto-docs per service |

## 🔗 API Endpoints

### User Service (Port 8001)
```
POST   /api/users/register              # Register new user
POST   /api/users/login                 # Login (returns JWT)
GET    /api/users/me                    # Get current user (auth required)
GET    /api/users                       # List all users (admin)
GET    /api/users/{user_id}/profile     # Get user profile
PUT    /api/users/{user_id}/profile     # Update user profile
```

### Product Service (Port 8002)
```
GET    /api/products                    # List products (paginated)
GET    /api/products/{id}               # Get product detail
POST   /api/products                    # Create product (admin)
PUT    /api/products/{id}               # Update product (admin)
DELETE /api/products/{id}               # Delete product (admin)
GET    /api/products/search             # Search products

GET    /api/categories                  # List categories
GET    /api/search                      # Search products

GET    /api/favourites                  # Get user favourites (auth)
POST   /api/favourites                  # Add to favourites (auth)
DELETE /api/favourites/{id}             # Remove from favourites (auth)
GET    /api/favourites/check/{product_id}  # Check if favourite

GET    /api/inventory/all               # List inventory (admin)
GET    /api/inventory/{product_id}      # Get inventory
POST   /api/inventory                   # Create inventory
PUT    /api/inventory/{product_id}      # Update inventory
GET    /api/inventory/{product_id}/check-stock  # Check stock availability
```

### Cart Service (Port 8013)
```
GET    /api/cart                        # Get cart
POST   /api/cart/add                    # Add to cart
PUT    /api/cart/update                 # Update cart item
DELETE /api/cart/remove/{product_id}    # Remove from cart
```

### Order Service (Port 8003)
```
GET    /api/orders                      # List all orders (admin)
GET    /api/orders/me                   # Get user's orders (auth)
GET    /api/orders/{id}                 # Get order detail
POST   /api/orders                      # Create order (auth)
PUT    /api/orders/{id}                 # Update order
PUT    /api/orders/{id}/status          # Update order status

GET    /api/tax/calculate               # Calculate tax
GET    /api/tax/rate                    # Get tax rate
POST   /api/tax/rates                   # Create tax rate

GET    /api/notifications               # Get user notifications (auth)
POST   /api/notifications               # Create notification
PUT    /api/notifications/{id}/read     # Mark as read (auth)
```

### Payment Service (Port 8004)
```
GET    /api/payments                    # List payments
GET    /api/payments/{id}               # Get payment detail
POST   /api/payments                    # Process payment
PUT    /api/payments/{id}/status        # Update payment status
```

### Shipping Service (Port 8006)
```
GET    /api/shipments/                  # List shipments
GET    /api/shipments/{id}              # Get shipment detail
GET    /api/shipments/order/{order_id}  # Get shipment by order
POST   /api/shipments/                  # Create shipment (auth)
PUT    /api/shipments/{id}/status       # Update status
```

### Promotion Service (Port 8007)
```
GET    /api/promotions                  # List all promotions
GET    /api/promotions/active           # List active promotions
GET    /api/promotions/{id}             # Get promotion detail
POST   /api/promotions                  # Create promotion
PUT    /api/promotions/{id}             # Update promotion
DELETE /api/promotions/{id}             # Delete promotion
POST   /api/promotions/validate         # Validate voucher code
```

### Rating Service (Port 8008)
```
GET    /api/ratings/{product_id}        # Get product ratings
GET    /api/ratings/product/{product_id}  # Get product ratings (alt)
POST   /api/ratings                     # Create rating (auth)
POST   /api/ratings/{product_id}        # Create rating (auth, alt)
```

### Discovery Service (Port 8000)
```
GET    /health                          # Health check
GET    /services                        # List registered services
POST   /register/{service_name}         # Register service
GET    /discover/{service_name}         # Discover service
DELETE /deregister/{service_name}       # Deregister service
```

## 📝 API Usage Examples

### 1. User Authentication

**Register:**
```bash
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "Password123!",
    "full_name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Password123!"
  }'
# Response: { "access_token": "eyJ...", "token_type": "bearer", "user_id": 1, "email": "...", "role": "client" }
```

**Get Current User:**
```bash
curl http://localhost/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Product Browsing

**List Products:**
```bash
curl "http://localhost/api/products?skip=0&limit=10"
```

**Get Product Detail:**
```bash
curl http://localhost/api/products/PRODUCT_ID
```

**Search Products:**
```bash
curl "http://localhost/api/search?keyword=laptop"
```

### 3. Shopping Cart

**Add to Cart:**
```bash
curl -X POST http://localhost/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "product_id": "PRODUCT_ID",
    "quantity": 2,
    "price": 999.99
  }'
```

**Get Cart:**
```bash
curl http://localhost/api/cart \
  -H "Authorization: Bearer TOKEN"
```

### 4. Create Order

```bash
curl -X POST http://localhost/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "items": [
      { "product_id": "PRODUCT_ID", "quantity": 1, "price": 100.00 }
    ],
    "shipping_address": "123 Main St",
    "phone": "0123456789"
  }'
```

### 5. Validate Voucher

```bash
curl -X POST http://localhost/api/promotions/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE20",
    "order_amount": 100.00
  }'
```

## 🗄️ Database Access

### MySQL
```bash
docker exec -it mysql-db mysql -uroot -proot123 ecommerce

# Useful commands:
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM orders LIMIT 10;
DESC payments;
```

### MongoDB
```bash
# Via Mongo Express GUI
→ http://localhost:8081 (root/root123)

# Or via CLI
docker exec -it mongodb mongosh -u root -p root123 --authenticationDatabase admin
use ecommerce
db.products.find()
db.products.countDocuments()
```

### Redis
```bash
docker exec -it redis redis-cli

KEYS *
GET "service:registry:user-service"
INFO
```

## 🔌 Kafka Event Topics

Services communicate via Kafka for loose coupling:

```
order-events/
├── order_created        # When user creates order
├── order_confirmed      # After payment success
├── order_shipped        # When shipped
└── order_cancelled      # When cancelled

payment-events/
├── payment_initiated    # Payment start
├── payment_successful   # Payment completed
└── payment_failed       # Payment error

inventory-events/
├── inventory_reserved   # Stock reserved
├── inventory_released   # Stock released
└── inventory_low        # Low stock alert

shipping-events/
├── shipment_created     # Shipment created
├── shipment_dispatched  # On the way
└── shipment_delivered   # Delivered
```

## 💾 Database Schema

### MySQL Tables

**users** (user-service)
```sql
id | email | username | hashed_password | full_name | phone | role | created_at
```

**user_profiles** (user-service)
```sql
id | user_id | avatar | address | date_of_birth | gender | created_at
```

**orders** (order-service)
```sql
id | user_id | total_amount | status | shipping_address | phone | created_at | updated_at
```

**order_items** (order-service)
```sql
id | order_id | product_id | quantity | price | created_at
```

**payments** (payment-service)
```sql
id | order_id | amount | status | payment_method | transaction_id | created_at
```

**inventory** (product-service)
```sql
id | product_id | quantity | sku | warehouse | last_updated
```

**favourites** (product-service)
```sql
id | user_id | product_id | created_at
```

**shipments** (shipping-service)
```sql
id | order_id | tracking_number | carrier | status | estimated_delivery | created_at
```

**promotions** (promotion-service)
```sql
id | code | name | description | discount_type | discount_value | min_order | max_discount | start_date | end_date | is_active
```

**ratings** (rating-service)
```sql
id | product_id | user_id | username | rating | comment | created_at
```

**tax_rates** (order-service)
```sql
id | country | state | rate | name | created_at
```

**notifications** (order-service)
```sql
id | user_id | title | message | is_read | created_at
```

### MongoDB Collections

**products** (product-service)
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  sku: String,
  image: String,
  images: [String],
  rating: Number,
  reviews_count: Number,
  attributes: Object,
  created_at: Date,
  updated_at: Date
}
```

## 🔍 Troubleshooting

### View Container Status
```bash
docker-compose ps
docker ps -a
docker inspect <container_id>
```

### Check Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order-service

# Last N lines
docker-compose logs --tail=50 user-service
```

### Common Issues

**Cannot connect to API:**
```bash
docker-compose ps | grep api-gateway
docker-compose up -d api-gateway
```

**Database connection refused:**
```bash
docker-compose down
docker-compose up -d mysql mongodb redis
sleep 30
docker-compose up -d
```

**Kafka broker unreachable:**
```bash
docker-compose logs kafka
docker-compose restart kafka zookeeper
```

**Port already in use:**
```powershell
# Windows/PowerShell
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

## 🔐 Security Configuration

### Production Changes Required

1. **JWT Secret** - Change in `config/settings.py`
2. **Database Passwords** - Update in `docker-compose.yml`
3. **Enable HTTPS/SSL** - Configure Nginx for SSL
4. **Environment Variables** - Use `.env` file for secrets

### Default Credentials (Development Only)
| Service | Username | Password |
|---------|----------|----------|
| MySQL | root | root123 |
| MongoDB | root | root123 |
| Mongo Express | root | root123 |

## 📈 Scaling

### Horizontal Scaling
```bash
docker-compose up -d --scale order-service=3
```

### Performance Tips
- Redis caching for products
- Database indexing
- Connection pooling
- Nginx load balancing

## 📚 Additional Resources

- **OpenAPI Docs**: `http://localhost:800X/docs` for each service
- **Postman Collection**: Import `POSTMAN_API_COLLECTION.json`
- **Mongo Express**: `http://localhost:8081`

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

## 📄 License

MIT License - Open source project

---

**Last Updated**: December 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready


# E-Commerce Microservices Architecture

Một hệ thống E-commerce Microservices hoàn chỉnh với 14 services độc lập, sử dụng các công nghệ hiện đại nhất.

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │    API Gateway (Nginx)    │
         │    - Port: 80             │
         │    - Routing & Load Bal   │
         └───────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌──────────┐ ┌──────────┐
   │ User    │ │ Product  │ │ Order    │
   │ Service │ │ Service  │ │ Service  │
   │ (8001)  │ │ (8002)   │ │ (8003)   │
   └─────────┘ └──────────┘ └──────────┘
        │            │            │
   ┌────────────────────────────────────────┐
   │        Message Bus (Kafka)             │
   │    - Payment Events                    │
   │    - Order Events                      │
   │    - Inventory Events                  │
   │    - Notification Events               │
   └────────────────────────────────────────┘
        │
   ┌────────────────────────────────────────┐
   │          Databases                     │
   ├────────────────────────────────────────┤
   │ MySQL: User, Orders, Payments, etc     │
   │ MongoDB: Products, Ratings              │
   │ Redis: Caching, Session, Discovery     │
   └────────────────────────────────────────┘
```

## 🧩 Microservices (14 Services)

| Service | Port | Database | Mô tả |
|---------|------|----------|-------|
| **Discovery Service** | 8000 | Redis | Service Registry - Quản lý service discovery |
| **User Service** | 8001 | MySQL | Authentication, User Management, JWT |
| **Product Service** | 8002 | MongoDB | Product Management, Catalog |
| **Order Service** | 8003 | MySQL | Order Management, CRUD |
| **Payment Service** | 8004 | MySQL | Payment Processing, Refunds |
| **Inventory Service** | 8005 | MySQL | Stock Management, Availability Check |
| **Shipping Service** | 8006 | MySQL | Shipment Tracking, Logistics |
| **Promotion Service** | 8007 | MySQL | Discount Management, Campaigns |
| **Rating Service** | 8008 | MySQL | Product Reviews, Ratings |
| **Search Service** | 8009 | Redis | Product Search, Caching |
| **Favourite Service** | 8010 | MySQL | Wishlist, Favourite Products |
| **Notification Service** | 8011 | MySQL | Event Notifications, Alerts |
| **Tax Service** | 8012 | MySQL | Tax Calculation, Compliance |

## 🛠️ Công nghệ Stack

### Backend
- **FastAPI**: Web framework hiện đại, high-performance
- **SQLAlchemy**: ORM cho MySQL
- **Motor**: Async driver cho MongoDB
- **Pydantic**: Data validation

### Database
- **MySQL** (Port 3306): Relational database cho dữ liệu có cấu trúc
- **MongoDB** (Port 27017): NoSQL database cho dữ liệu flexible
- **Redis** (Port 6379): In-memory cache, session store, service registry

### Message Queue
- **Apache Kafka** (Port 9092): Event streaming, asynchronous communication
- **Zookeeper** (Port 2181): Kafka cluster coordinator

### API Gateway
- **Nginx** (Port 80): Reverse proxy, routing, load balancing
- **CORS**: Cross-origin resource sharing

### Security
- **JWT**: Token-based authentication
- **BCrypt**: Password hashing

### Containerization
- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration

## 📦 Cấu trúc Dự án

Mỗi service tuân theo **Clean Architecture** với cấu trúc sau:

```
ecommerce-microservices/
├── config/                          # Shared configuration
│   ├── __init__.py
│   ├── settings.py                  # Global settings
│   ├── database.py                  # Database connections
│   ├── kafka.py                     # Kafka utilities
│   ├── jwt_auth.py                  # JWT authentication
│   └── registry.py                  # Service discovery
├── api-gateway/
│   ├── Dockerfile
│   └── nginx.conf                   # Nginx routing config
│
├── discovery-service/               # Service Registry (Port 8000)
│   ├── main.py
│   ├── application/                 # Use cases, DTOs
│   ├── domain/                      # Business logic
│   ├── infrastructure/              # Data access
│   ├── presentation/                # Routes
│   ├── requirements.txt
│   └── Dockerfile
│
├── user-service/                    # Authentication (Port 8001)
│   ├── main.py
│   ├── models/                      # SQLAlchemy models
│   ├── routers/
│   ├── services/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── requirements.txt
│   └── Dockerfile
│
├── product-service/                 # Catalog (Port 8002)
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── requirements.txt
│   └── Dockerfile
│
├── order-service/                   # Order Mgmt (Port 8003)
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   ├── requirements.txt
│   └── Dockerfile
│
├── payment-service/                 # Payment (Port 8004)
├── inventory-service/               # Inventory (Port 8005)
├── shipping-service/                # Shipping (Port 8006)
├── promotion-service/               # Promotions (Port 8007)
│   ├── seed_promotions.py           # Sample data
├── rating-service/                  # Ratings (Port 8008)
├── search-service/                  # Search (Port 8009)
├── favourite-service/               # Wishlist (Port 8010)
├── notification-service/            # Notifications (Port 8011)
├── tax-service/                     # Tax (Port 8012)
│
├── docker-compose.yml               # Production config
├── docker-compose.simple.yml        # Simple local version
├── Postman_Collection_v2.json       # API testing
├── README.md
└── requirements.txt
```

### Clean Architecture Layers

Mỗi service có 4 layers chính:

1. **Application Layer** (`application/`)
   - DTOs (Data Transfer Objects)
   - Use cases/Service interfaces
   - Application-level logic

2. **Domain Layer** (`domain/`)
   - Core business logic
   - Domain entities
   - Value objects

3. **Infrastructure Layer** (`infrastructure/`)
   - Database models (SQLAlchemy)
   - Repository implementations
   - External service integrations

4. **Presentation Layer** (`presentation/`)
   - HTTP routes
   - Request/Response schemas
   - Controller logic

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Required:
- Docker Desktop v20.10+
- Docker Compose v1.29+
```

### 2. Clone & Setup
```bash
cd ecommerce-microservices
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# Or build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service
docker-compose logs -f user-service
```

### 4. Verify Installation
```bash
# Check all containers
docker-compose ps

# Test API Gateway
curl http://localhost/health

# Test User Service (port 8001)
curl http://localhost:8001/health

# Test Product Service (port 8002)
curl http://localhost:8002/health
```

### 5. Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📝 API Usage Examples

### Authentication

**Register User:**
```bash
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User",
    "phone": "0123456789",
    "address": "123 Main St"
  }'
```

**Login:**
```bash
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com"
}
```

### Products

**Create Product:**
```bash
curl -X POST http://localhost/api/products/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1500,
    "category": "Electronics",
    "stock": 50,
    "sku": "LT-001"
  }'
```

**List Products:**
```bash
curl http://localhost/api/products/?skip=0&limit=10
```

**Search Products:**
```bash
curl http://localhost/api/search/?keyword=laptop&limit=10
```

### Orders

**Create Order:**
```bash
curl -X POST http://localhost/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "user_id": 1,
    "items": [
      {
        "product_id": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 1500
      }
    ],
    "shipping_address": "123 Main St, City"
  }'
```

**Get Order:**
```bash
curl http://localhost/api/orders/1
```

### Payments

**Process Payment:**
```bash
curl -X POST http://localhost/api/payments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "order_id": 1,
    "amount": 3000,
    "payment_method": "credit_card"
  }'
```

## 🔌 Kafka Event Topics

Services publish events:

```
order-events
├── order_created
├── order_status_updated
└── order_cancelled

payment-events
├── payment_processed
└── payment_refunded

inventory-events
└── inventory_updated

shipping-events
├── shipment_created
└── shipment_updated

notification-events
└── notification_created
```

## 💾 Database Schema Overview

### MySQL Tables
```sql
users (user-service)
├── id, email, username, hashed_password
└── full_name, phone, address, created_at

orders (order-service)
├── id, user_id, total_amount, status
└── shipping_address, created_at, updated_at

order_items (order-service)
├── id, order_id, product_id
└── quantity, price

payments (payment-service)
├── id, order_id, amount, status
└── payment_method, transaction_id, created_at

inventory (inventory-service)
├── id, product_id, quantity
└── sku, warehouse, updated_at
```

### MongoDB Collections
```javascript
products (product-service)
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  sku: String,
  attributes: Object,
  created_at: Date
}
```

## 🔍 Debugging

### View Container Status
```bash
docker-compose ps
```

### Check Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order-service

# Last 100 lines
docker-compose logs --tail=100 user-service
```

### Database Access

**MySQL:**
```bash
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce
SHOW TABLES;
DESC users;
```

**MongoDB:**
```bash
docker exec -it mongodb mongosh -u root -p root123
use ecommerce
show collections
db.products.find()
```

**Redis:**
```bash
docker exec -it redis redis-cli
KEYS *
GET "service:registry:user-service"
```

## 🧪 Testing with Postman

1. **Import Collection:**
   - Open Postman → Click "Import"
   - Select `Postman_Collection_v2.json`

2. **Set Environment:**
   - Create new environment
   - Set `base_url` = `http://localhost`

3. **Test Flow:**
   - Register user
   - Login and copy token
   - Create product
   - Place order
   - Process payment

## 📊 Troubleshooting

### Port Already in Use
```bash
# Windows/PowerShell
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

### Container Won't Start
```bash
docker-compose logs service-name
docker-compose build --no-cache service-name
docker-compose up service-name
```

### Database Connection Failed
```bash
docker-compose restart mysql
docker-compose ps  # Check STATUS
```

### Kafka Issues
```bash
docker-compose logs kafka
docker-compose restart kafka zookeeper
```

## 🔐 Security

### Required Changes for Production

1. **JWT Secret** (`config/settings.py`)
   ```python
   JWT_SECRET = "your-super-secret-key-change-this"
   ```

2. **Database Passwords**
   - Change MySQL root password
   - Change MongoDB credentials

3. **API Gateway**
   - Enable HTTPS/SSL
   - Configure CORS properly
   - Add rate limiting

4. **Environment Variables**
   - Use `.env` file for secrets
   - Never commit secrets to git

## 📈 Scaling

### Horizontal Scaling
```bash
docker-compose up -d --scale order-service=3
```

### Performance Optimizations
- Redis caching for products
- Database indexing
- Connection pooling
- Load balancing (Nginx)

## 🔄 Service Communication

```
Client → Nginx (Port 80)
  ↓
Nginx routes to service
  ↓
Service auth with JWT
  ↓
Process request
  ↓
Publish event to Kafka (if needed)
  ↓
Other services consume event
  ↓
Update databases
  ↓
Response to client
```

## 📚 Additional Resources

- **Health Check**: http://localhost/health
- **Service Discovery**: http://localhost:8000/services
- **Kafka Topics**: `docker exec kafka kafka-topics.sh --list --bootstrap-server kafka:9092`

## 📝 License

MIT License - Open source project

## 👥 Development Team

Comprehensive e-commerce microservices platform built with modern technologies.

---

**Last Updated**: December 2, 2024
**Version**: 2.0.0
**Status**: ✅ Production Ready

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

## 🧩 Microservices

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
- **MySQL**: Relational database cho dữ liệu có cấu trúc
- **MongoDB**: NoSQL database cho dữ liệu flexible
- **Redis**: In-memory cache, session store, service registry

### Message Queue
- **Apache Kafka**: Event streaming, asynchronous communication
- **Zookeeper**: Kafka cluster coordinator

### API Gateway
- **Nginx**: Reverse proxy, routing, load balancing
- **CORS**: Cross-origin resource sharing

### Security
- **JWT**: Token-based authentication
- **BCrypt**: Password hashing

### Containerization
- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration

## 📦 Cấu trúc Dự án

```
ecommerce-microservices/
├── config/
│   ├── __init__.py
│   ├── settings.py           # Global configuration
│   ├── database.py           # Database connections
│   ├── kafka.py              # Kafka utilities
│   ├── jwt_auth.py           # JWT authentication
│   └── registry.py           # Service discovery registry
├── api-gateway/
│   ├── Dockerfile
│   └── nginx.conf            # Nginx configuration
├── discovery-service/
│   ├── main.py
│   ├── routers/
│   ├── models/
│   ├── services/
│   ├── Dockerfile
│   └── requirements.txt
├── [user|product|order|payment|...]-service/
│   ├── main.py
│   ├── routers/
│   │   └── [service_name].py
│   ├── models/
│   │   ├── [entity].py
│   │   └── schema.py
│   ├── services/
│   │   └── [service_name]_service.py
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml        # Docker Compose configuration
├── Postman_Collection.json   # API testing collection
└── README.md
```

## 🚀 Cách Chạy Hệ Thống

### 1. Prerequisites
- Docker Desktop (v20.10+)
- Docker Compose (v1.29+)
- Postman (optional, for testing)

### 2. Clone/Setup
```bash
# Navigate to project directory
cd ecommerce-microservices

# Ensure all services directories exist
# (Các thư mục services đã được tạo)
```

### 3. Start All Services
```bash
# Start all containers
docker-compose up -d

# Hoặc build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f user-service
```

### 4. Verify Services
```bash
# Check container status
docker-compose ps

# Test health endpoints
curl http://localhost/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

### 5. Stop Services
```bash
docker-compose down

# Remove volumes (data)
docker-compose down -v
```

## 📝 API Usage Examples

### 1. User Registration & Authentication

**Register:**
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

### 2. Product Management

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
    "sku": "LT-001",
    "images": ["image1.jpg"]
  }'
```

**List Products:**
```bash
curl http://localhost/api/products/?skip=0&limit=10&category=Electronics
```

**Search Products:**
```bash
curl http://localhost/api/search/?keyword=laptop&limit=10
```

### 3. Order Management

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
    "shipping_address": "123 Main St, City, Country"
  }'
```

**Get Order:**
```bash
curl http://localhost/api/orders/1
```

### 4. Payment Processing

**Process Payment:**
```bash
curl -X POST http://localhost/api/payments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "order_id": 1,
    "user_id": 1,
    "amount": 3000,
    "payment_method": "credit_card"
  }'
```

### 5. Inventory Management

**Check Stock:**
```bash
curl http://localhost/api/inventory/507f1f77bcf86cd799439011/check-stock?quantity=10
```

### 6. Notifications

**Get User Notifications:**
```bash
curl http://localhost/api/notifications/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json"
```

## 🔌 Kafka Events

Services publish các event sau:

```
Topic: order-events
- order_created: Khi order được tạo
- order_status_updated: Khi status thay đổi
- order_cancelled: Khi order bị hủy

Topic: payment-events
- payment_processed: Khi thanh toán thành công
- payment_refunded: Khi refund được xử lý

Topic: inventory-events
- inventory_updated: Khi stock thay đổi

Topic: shipping-events
- shipment_created: Khi shipment được tạo
- shipment_updated: Khi status thay đổi

Topic: notification-events
- notification_created: Khi notification được tạo
```

## 💾 Database Schemas

### MySQL Tables
```sql
users
├── id (INT, PK)
├── email (VARCHAR, UNIQUE)
├── username (VARCHAR, UNIQUE)
├── hashed_password (VARCHAR)
├── full_name, phone, address
└── created_at, updated_at

orders
├── id (INT, PK)
├── user_id (INT, FK)
├── total_amount (FLOAT)
├── status (VARCHAR)
├── shipping_address (VARCHAR)
└── created_at, updated_at

order_items
├── id (INT, PK)
├── order_id (INT, FK)
├── product_id (VARCHAR)
├── quantity (INT)
└── price (FLOAT)

payments
├── id (INT, PK)
├── order_id (INT)
├── amount (FLOAT)
├── payment_method (VARCHAR)
├── transaction_id (VARCHAR, UNIQUE)
├── status (VARCHAR)
└── created_at, updated_at
```

### MongoDB Collections
```javascript
products
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  sku: String,
  images: [String],
  attributes: Object,
  created_at: Date,
  updated_at: Date
}
```

## 🔍 Monitoring & Debugging

### View Container Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Last 100 lines
docker-compose logs --tail=100 order-service
```

### Access Services Directly
```bash
# User Service
curl http://localhost:8001/health

# Product Service
curl http://localhost:8002/health

# Order Service
curl http://localhost:8003/health
```

### Database Access

**MySQL:**
```bash
# Connect to MySQL container
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce

# View tables
SHOW TABLES;
DESC users;
```

**MongoDB:**
```bash
# Connect to MongoDB container
docker exec -it mongodb mongosh -u root -p root123

# Use database
use ecommerce

# View collections
show collections

# Query products
db.products.find()
```

**Redis:**
```bash
# Connect to Redis container
docker exec -it redis redis-cli

# View keys
KEYS *

# Get registry services
KEYS "service:registry:*"
GET "service:registry:user-service"
```

## 🧪 Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `Postman_Collection.json`

2. **Set Environment Variables:**
   - Set `base_url` = `http://localhost`
   - After login, save `token` from response

3. **Run Requests:**
   - Start with User Service (register/login)
   - Copy token and set it in Postman
   - Test other services

## 📊 Common Issues & Solutions

### Port Already in Use
```bash
# Find and stop service using port
lsof -i :80
kill -9 <PID>
```

### Container Won't Start
```bash
# Check logs
docker-compose logs service-name

# Rebuild without cache
docker-compose build --no-cache service-name
docker-compose up service-name
```

### Database Connection Error
```bash
# Check if MySQL is running
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Wait for health check
docker-compose ps  # Check STATUS column
```

### Kafka Connection Error
```bash
# Check Kafka logs
docker-compose logs kafka

# Restart Kafka cluster
docker-compose restart kafka zookeeper
```

## 🔐 Security Best Practices

1. **Change JWT Secret:** Trong `config/settings.py`, thay đổi `JWT_SECRET`
2. **Database Passwords:** Update MySQL/MongoDB passwords
3. **API Rates:** Add rate limiting ở Nginx
4. **HTTPS:** Enable SSL/TLS certificates
5. **CORS:** Restrict origins dựa vào yêu cầu

## 📈 Scaling & Performance

### Horizontal Scaling
```bash
# Run multiple instances
docker-compose up -d --scale order-service=3
```

### Load Balancing
Nginx tự động load balance giữa các instances

### Caching
- Redis caching cho products
- JWT token caching
- Search results caching

## 🔄 Service Communication Flow

```
1. Client → API Gateway (Nginx)
   ↓
2. Nginx routes to appropriate service
   ↓
3. Service authenticates with JWT
   ↓
4. Service processes request
   ↓
5. If needed, publish event to Kafka
   ↓
6. Other services consume events
   ↓
7. Services update their databases
   ↓
8. Response back to client
```

## 📚 Thêm Thông Tin

- **FastAPI Docs**: http://localhost:8001/docs (User Service)
- **Kafka Topics**: `docker exec kafka kafka-topics.sh --list --bootstrap-server kafka:9092`
- **Service Discovery**: GET http://localhost:8000/services

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributors

Developed as a comprehensive microservices architecture demonstration.

---

**Last Updated**: November 30, 2024
**Version**: 1.0.0

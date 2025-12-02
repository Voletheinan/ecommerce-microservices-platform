```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                  E-COMMERCE MICROSERVICES ARCHITECTURE                        ║
║                          Complete Project Index                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

# 📑 PROJECT INDEX

## 📂 Cấu trúc Dự án Đầy Đủ

```
ecommerce-microservices/
│
├── 📄 DOCUMENTATION
│   ├── README.md                    [Hướng dẫn chi tiết, kiến trúc, setup]
│   ├── QUICKSTART.md                [Quick start 5 phút]
│   ├── API_DOCUMENTATION.md         [Chi tiết API endpoints]
│   ├── PROJECT_INDEX.md             [File này]
│   ├── docker-compose.yml           [Docker orchestration]
│   ├── Postman_Collection.json      [API testing collection]
│   ├── .gitignore                   [Git ignore rules]
│   └── requirements.txt             [Python dependencies]
│
├── 🔧 CONFIG (Shared Configuration)
│   ├── __init__.py
│   ├── settings.py                  [Global settings, database config]
│   ├── database.py                  [MySQL, MongoDB, Redis connections]
│   ├── kafka.py                     [Kafka producer/consumer utilities]
│   ├── jwt_auth.py                  [JWT authentication utilities]
│   └── registry.py                  [Service discovery registry]
│
├── 🌐 API GATEWAY
│   ├── api-gateway/
│   │   ├── nginx.conf               [Nginx routing configuration]
│   │   ├── Dockerfile               [Nginx container]
│   │   └── README.md
│   └── Port: 80
│
├── 🔍 SERVICE DISCOVERY
│   ├── discovery-service/
│   │   ├── main.py                  [FastAPI app, registry management]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8000
│
├── 👤 USER SERVICE
│   ├── user-service/
│   │   ├── main.py                  [FastAPI with JWT setup]
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── auth.py              [Auth endpoints]
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              [SQLAlchemy User model]
│   │   │   └── schema.py            [Pydantic schemas]
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── user_service.py      [Business logic]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8001 | Database: MySQL
│
├── 📦 PRODUCT SERVICE
│   ├── product-service/
│   │   ├── main.py                  [FastAPI with MongoDB setup]
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── product.py           [Product CRUD endpoints]
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── product.py           [MongoDB schema]
│   │   │   └── schema.py            [Pydantic schemas]
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── product_service.py   [Business logic]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8002 | Database: MongoDB
│
├── 📋 ORDER SERVICE
│   ├── order-service/
│   │   ├── main.py                  [FastAPI with order processing]
│   │   ├── routers/order.py         [Order endpoints]
│   │   ├── models/
│   │   │   ├── order.py             [Order & OrderItem models]
│   │   │   └── schema.py
│   │   ├── services/order_service.py [Order logic, Kafka events]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8003 | Database: MySQL | Kafka: publish order events
│
├── 💳 PAYMENT SERVICE
│   ├── payment-service/
│   │   ├── main.py
│   │   ├── routers/payment.py
│   │   ├── models/payment.py        [Payment model]
│   │   ├── services/payment_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8004 | Database: MySQL | Kafka: payment events
│
├── 📊 INVENTORY SERVICE
│   ├── inventory-service/
│   │   ├── main.py
│   │   ├── routers/inventory.py
│   │   ├── models/inventory.py      [Inventory model, stock tracking]
│   │   ├── services/inventory_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8005 | Database: MySQL | Stock checking
│
├── 🚚 SHIPPING SERVICE
│   ├── shipping-service/
│   │   ├── main.py
│   │   ├── routers/shipping.py
│   │   ├── models/shipment.py       [Shipment tracking]
│   │   ├── services/shipping_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8006 | Database: MySQL
│
├── 🎁 PROMOTION SERVICE
│   ├── promotion-service/
│   │   ├── main.py
│   │   ├── routers/promotion.py
│   │   ├── models/promotion.py      [Discount campaigns]
│   │   ├── services/promotion_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8007 | Database: MySQL
│
├── ⭐ RATING SERVICE
│   ├── rating-service/
│   │   ├── main.py
│   │   ├── routers/rating.py
│   │   ├── models/rating.py         [Product ratings & reviews]
│   │   ├── services/rating_service.py [Average calculation]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8008 | Database: MySQL
│
├── 🔍 SEARCH SERVICE
│   ├── search-service/
│   │   ├── main.py
│   │   ├── routers/search.py
│   │   ├── models/schema.py         [Search schemas]
│   │   ├── services/search_service.py [Redis caching]
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8009 | Database: Redis | Cached search results
│
├── ❤️ FAVOURITE SERVICE
│   ├── favourite-service/
│   │   ├── main.py
│   │   ├── routers/favourite.py
│   │   ├── models/favourite.py      [User wishlist items]
│   │   ├── services/favourite_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8010 | Database: MySQL
│
├── 🔔 NOTIFICATION SERVICE
│   ├── notification-service/
│   │   ├── main.py
│   │   ├── routers/notification.py
│   │   ├── models/notification.py   [User notifications]
│   │   ├── services/notification_service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   └── Port: 8011 | Database: MySQL
│
└── 💰 TAX SERVICE
    ├── tax-service/
    │   ├── main.py
    │   ├── routers/tax.py
    │   ├── models/tax.py             [Tax rates by location]
    │   ├── services/tax_service.py   [Tax calculation]
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── __init__.py
    └── Port: 8012 | Database: MySQL
```

---

## 🚀 QUICK START (5 MINUTES)

### 1. Prerequisites
```bash
# Install Docker
# https://www.docker.com/products/docker-desktop
```

### 2. Start All Services
```bash
cd ecommerce-microservices
docker-compose up -d
```

### 3. Verify Services
```bash
# Check health
curl http://localhost/health

# View logs
docker-compose logs -f
```

### 4. Test with Postman
```
1. Import: Postman_Collection.json
2. Set base_url = http://localhost
3. Register user, get token
4. Test other endpoints
```

---

## 📊 INFRASTRUCTURE COMPONENTS

### Databases
| Database | Port | Data |
|----------|------|------|
| MySQL | 3306 | User, Order, Payment, Inventory, etc |
| MongoDB | 27017 | Products, Ratings |
| Redis | 6379 | Cache, Session, Service Registry |

### Message Bus
| Component | Port | Role |
|-----------|------|------|
| Zookeeper | 2181 | Kafka coordination |
| Kafka | 9092 | Event streaming, async messaging |

### API Gateway
| Component | Port | Role |
|-----------|------|------|
| Nginx | 80 | Reverse proxy, routing, load balancing |

---

## 🔌 KEY FEATURES

✅ **14 Independent Microservices**
- Each runs independently
- Can be scaled separately
- Isolated databases per service type

✅ **API Gateway (Nginx)**
- Routes requests to appropriate services
- Load balancing
- CORS handling

✅ **Service Discovery**
- Redis-based service registry
- Dynamic service lookup
- Health checking

✅ **Authentication**
- JWT token-based auth
- Centralized in User Service
- Verified at API Gateway

✅ **Message-Driven Architecture**
- Kafka event streaming
- Asynchronous processing
- Decoupled services

✅ **Caching Layer**
- Redis for frequently accessed data
- Search result caching
- Session management

✅ **Database Per Service Pattern**
- MySQL for relational data
- MongoDB for flexible data
- Redis for caching

✅ **Complete API Documentation**
- 50+ API endpoints
- Postman collection included
- Example requests & responses

---

## 📋 SERVICE RESPONSIBILITIES

| Service | Main Responsibility | Database | Events |
|---------|-------------------|----------|--------|
| User | Auth, user management | MySQL | user_login, user_created |
| Product | Product catalog | MongoDB | product_created, product_updated |
| Order | Order processing | MySQL | order_created, order_confirmed |
| Payment | Payment processing | MySQL | payment_completed, refund_issued |
| Inventory | Stock management | MySQL | inventory_updated, out_of_stock |
| Shipping | Shipment tracking | MySQL | shipment_created, status_updated |
| Promotion | Discount management | MySQL | promotion_active |
| Rating | Product reviews | MySQL | rating_created, average_updated |
| Search | Product search | Redis | search_performed (cached) |
| Favourite | Wishlist management | MySQL | favorite_added, favorite_removed |
| Notification | User notifications | MySQL | notification_sent, notification_read |
| Tax | Tax calculation | MySQL | tax_calculated |
| Discovery | Service registry | Redis | service_registered, service_deregistered |

---

## 🔄 DATA FLOW EXAMPLE

### Create Order Flow
```
1. Client → API Gateway (nginx:80)
   ├─ Nginx routes to Order Service (8003)
   │
2. Order Service
   ├─ Validates JWT token
   ├─ Calls Inventory Service to check stock
   ├─ Creates order in MySQL
   ├─ Publishes "order_created" to Kafka
   │
3. Kafka Events Trigger:
   ├─ Payment Service: listens for "order_created"
   ├─ Notification Service: sends confirmation
   ├─ Inventory Service: reserves stock
   │
4. Response → Client
   └─ Order ID, status, total amount
```

---

## 🧪 TESTING ENDPOINTS

### Register & Login
```bash
# Register
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","username":"testuser","password":"pass123"}'

# Login (get token)
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'
```

### Create & List Products
```bash
# Create product
curl -X POST http://localhost/api/products/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":1500,"stock":10}'

# List products
curl http://localhost/api/products/
```

### Create Order
```bash
curl -X POST http://localhost/api/orders/ \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"items":[{"product_id":"507f...","quantity":1,"price":1500}]}'
```

---

## 🛠️ DEVELOPMENT SETUP

### Local Development
```bash
# Each service can run locally for development
cd user-service
pip install -r requirements.txt
python main.py  # Runs on http://localhost:8001
```

### Docker Development
```bash
# Build specific service
docker-compose build user-service

# Run specific service
docker-compose up -d user-service

# View logs
docker-compose logs -f user-service

# Access container shell
docker exec -it user-service /bin/bash
```

---

## 📈 SCALABILITY

### Horizontal Scaling
```bash
# Scale specific service
docker-compose up -d --scale order-service=3
```

### Load Balancing
- Nginx automatically distributes load
- Kafka ensures message ordering
- Redis provides consistent caching

---

## 🔐 SECURITY FEATURES

✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ CORS configuration
✅ Input validation (Pydantic)
✅ Async security headers
✅ Environment variable configuration

---

## 📚 DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| `README.md` | Complete guide, architecture, deployment |
| `QUICKSTART.md` | Fast 5-minute setup guide |
| `API_DOCUMENTATION.md` | Detailed API endpoints & examples |
| `PROJECT_INDEX.md` | This file - complete project overview |
| `Postman_Collection.json` | API testing with Postman |

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Update JWT_SECRET in config
- [ ] Change database passwords
- [ ] Enable SSL/TLS certificates
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Configure logging aggregation
- [ ] Set up monitoring & alerts
- [ ] Configure rate limiting
- [ ] Test all endpoints
- [ ] Load testing
- [ ] Security audit
- [ ] Set up CI/CD pipeline

---

## 📞 GETTING HELP

### Service Health Check
```bash
# Check all services
docker-compose ps

# Service logs
docker-compose logs service-name

# Health endpoint
curl http://localhost/health
```

### Database Debug
```bash
# MySQL
docker exec -it mysql-db mysql -u root -proot123 ecommerce

# MongoDB
docker exec -it mongodb mongosh -u root -p root123

# Redis
docker exec -it redis redis-cli
```

### Common Issues
See QUICKSTART.md for troubleshooting

---

## 📊 MONITORING TIPS

```bash
# Real-time resource usage
docker stats

# Container logs (last 100 lines)
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f service-name

# System events
docker events
```

---

## ✅ COMPLETED FEATURES

✅ 14 fully functional microservices
✅ API Gateway with Nginx
✅ Service discovery mechanism
✅ JWT authentication
✅ Message-driven architecture (Kafka)
✅ Multiple databases (MySQL, MongoDB, Redis)
✅ Complete Docker setup
✅ Comprehensive documentation
✅ Postman API collection
✅ Example code for all services
✅ Error handling
✅ CORS support
✅ Request validation

---

## 🎯 NEXT STEPS

1. **Run the system:** `docker-compose up -d`
2. **Test endpoints:** Use Postman collection
3. **Explore logs:** `docker-compose logs -f`
4. **Customize services:** Modify code as needed
5. **Deploy:** Follow deployment checklist

---

**Total Lines of Code:** 2,000+
**Total Services:** 14
**Total API Endpoints:** 50+
**Database Models:** 20+
**Docker Containers:** 13 (14 services + infrastructure)

**Version:** 1.0.0
**Last Updated:** November 30, 2024

---

For detailed information, see README.md and API_DOCUMENTATION.md

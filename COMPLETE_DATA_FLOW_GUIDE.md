# E-Commerce Microservices - Complete Data Flow Testing Guide
# ==============================================================

## 1. SYSTEM ARCHITECTURE & DATA FLOW

```
┌─────────────────┐
│   CLIENT/CURL   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   API Gateway (Nginx:80)    │
│   Routing & Load Balancing  │
└────────┬────────────────────┘
         │
    ┌────┼────┬────────────┬──────────┐
    ▼    ▼    ▼            ▼          ▼
┌──────┬──────┬────────┬────────┬─────────┐
│User  │Prod  │Order   │Payment │Inventory│
│Svc   │Svc   │Svc     │Svc     │Svc      │
│:8001 │:8002 │:8003   │:8004   │:8005    │
└──┬───┴──┬───┴────┬────┴────┬───┴────┬────┘
   │      │        │         │        │
   ▼      ▼        ▼         ▼        ▼
┌──────┬──────┬────────────────────────────┐
│ MySQL│MongoDB│    Kafka Message Bus       │
│      │       │  (Event Streaming)        │
└──────┴──────┴────────────────────────────┘
```

## 2. COMPLETE USER JOURNEY WITH DATA FLOW

### Step 1: User Registration
```
CLIENT → API Gateway → User Service → MySQL
↓
Stores: user_id, email, hashed_password
Returns: user_id, email, JWT token
```

**Test Command:**
```bash
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "john_doe",
    "password": "MyPassword123!",
    "full_name": "John Doe",
    "phone": "0123456789",
    "address": "123 Main St, City"
  }'
```

**Expected Response:**
```json
{
  "user_id": 1,
  "email": "john@example.com",
  "username": "john_doe",
  "full_name": "John Doe",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Data Stored in MySQL (users table):**
- id: 1
- email: john@example.com
- username: john_doe
- hashed_password: (bcrypt hash)
- full_name: John Doe
- phone: 0123456789
- address: 123 Main St, City
- created_at: 2025-12-01 14:00:00
- updated_at: 2025-12-01 14:00:00

---

### Step 2: User Login
```
CLIENT → API Gateway → User Service → MySQL (verify password)
↓
Returns: access_token (JWT)
```

**Test Command:**
```bash
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "MyPassword123!"
  }'
```

**Response contains TOKEN:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzMzMDAwMDAwLCJleHAiOjE3MzMwODY0MDB9.Signature...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "john@example.com"
}
```

**Save this TOKEN for next requests!**

---

### Step 3: Create Products
```
CLIENT (with TOKEN) → API Gateway → Product Service → MongoDB
↓
Stores: product_id, name, price, stock, etc.
Returns: product_id
```

**Test Commands:**
```bash
# Save token in variable (on Windows PowerShell)
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzMzMDAwMDAwLCJleHAiOjE3MzMwODY0MDB9.Signature..."

# Create Product 1
curl -X POST http://localhost/api/products/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Laptop Pro 15",
    "description": "High-performance laptop",
    "price": 1500.00,
    "category": "Electronics",
    "stock": 50,
    "sku": "LT-PRO-001",
    "images": ["https://example.com/laptop1.jpg"]
  }'

# Save the returned product_id (e.g., "507f1f77bcf86cd799439011")
```

**Data Stored in MongoDB (products collection):**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Laptop Pro 15",
  "description": "High-performance laptop",
  "price": 1500.00,
  "category": "Electronics",
  "stock": 50,
  "sku": "LT-PRO-001",
  "images": ["https://example.com/laptop1.jpg"],
  "created_at": ISODate("2025-12-01T14:00:00Z"),
  "updated_at": ISODate("2025-12-01T14:00:00Z")
}
```

**Create another product:**
```bash
curl -X POST http://localhost/api/products/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "USB-C Cable",
    "description": "Universal USB-C charging cable",
    "price": 15.00,
    "category": "Accessories",
    "stock": 200,
    "sku": "USB-C-001",
    "images": ["https://example.com/cable1.jpg"]
  }'
```

---

### Step 4: View Products (Search)
```
CLIENT → API Gateway → Search Service → Redis (cache)
↓
Returns: list of products from cache
```

**Test Command:**
```bash
curl http://localhost/api/search/?keyword=laptop
```

**Response:**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Laptop Pro 15",
      "price": 1500.00,
      "stock": 50
    }
  ],
  "count": 1
}
```

---

### Step 5: Create Order with Inventory Check
```
CLIENT (with TOKEN) → API Gateway → Order Service
    ↓
    ├→ Check Inventory Service (MySQL)
    │   └→ Verify stock available
    ├→ Store Order (MySQL)
    └→ Publish Event to Kafka (order-events topic)
        └→ Other services consume event
```

**Test Command:**
```bash
curl -X POST http://localhost/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "user_id": 1,
    "items": [
      {
        "product_id": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 1500.00
      },
      {
        "product_id": "507f1f77bcf86cd799439012",
        "quantity": 5,
        "price": 15.00
      }
    ],
    "shipping_address": "123 Main St, City, Country",
    "payment_method": "credit_card"
  }'
```

**Data Stored in MySQL (orders table):**
```
order_id: 1
user_id: 1
total_amount: 3075.00
status: pending
shipping_address: 123 Main St, City, Country
created_at: 2025-12-01 14:05:00
updated_at: 2025-12-01 14:05:00
```

**Data Stored in MySQL (order_items table):**
```
order_item_id | order_id | product_id                  | quantity | price
1             | 1        | 507f1f77bcf86cd799439011   | 2        | 1500.00
2             | 1        | 507f1f77bcf86cd799439012   | 5        | 15.00
```

**EVENT PUBLISHED TO KAFKA (order-events topic):**
```json
{
  "event_type": "order_created",
  "order_id": 1,
  "user_id": 1,
  "total_amount": 3075.00,
  "status": "pending",
  "items": [
    {
      "product_id": "507f1f77bcf86cd799439011",
      "quantity": 2
    },
    {
      "product_id": "507f1f77bcf86cd799439012",
      "quantity": 5
    }
  ],
  "timestamp": "2025-12-01T14:05:00Z"
}
```

---

### Step 6: View Kafka Event (Verify Inter-Service Communication)
```
Check what events were published to Kafka
```

**Test Command:**
```bash
# Terminal 1: Open Kafka consumer to watch events in real-time
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic order-events \
  --from-beginning

# You should see the JSON event from Step 5 printed here
```

**Other Kafka Topics to Monitor:**
```bash
# Watch payment events
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic payment-events \
  --from-beginning

# Watch inventory events
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic inventory-events \
  --from-beginning

# List all topics
docker exec -it kafka kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --list
```

---

### Step 7: Process Payment
```
CLIENT (with TOKEN) → API Gateway → Payment Service
    ↓
    ├→ Verify order (MySQL)
    ├→ Process payment
    ├→ Update order status to 'paid' (MySQL)
    └→ Publish Event to Kafka (payment-events topic)
        └→ Notification Service consumes and sends notification
```

**Test Command:**
```bash
curl -X POST http://localhost/api/payments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "order_id": 1,
    "user_id": 1,
    "amount": 3075.00,
    "payment_method": "credit_card",
    "card_number": "4111111111111111"
  }'
```

**Response:**
```json
{
  "payment_id": 1,
  "order_id": 1,
  "amount": 3075.00,
  "status": "completed",
  "transaction_id": "txn_123456789",
  "created_at": "2025-12-01T14:10:00Z"
}
```

**Data Stored in MySQL (payments table):**
```
payment_id: 1
order_id: 1
amount: 3075.00
payment_method: credit_card
transaction_id: txn_123456789
status: completed
created_at: 2025-12-01 14:10:00
```

**Data Updated in MySQL (orders table):**
```
order_id: 1
status: paid (changed from 'pending')
updated_at: 2025-12-01 14:10:00 (updated)
```

**EVENT PUBLISHED TO KAFKA (payment-events topic):**
```json
{
  "event_type": "payment_processed",
  "payment_id": 1,
  "order_id": 1,
  "user_id": 1,
  "amount": 3075.00,
  "status": "completed",
  "transaction_id": "txn_123456789",
  "timestamp": "2025-12-01T14:10:00Z"
}
```

**NOTIFICATION SERVICE CONSUMES EVENT:**
```
Notification Service reads from Kafka
→ Creates notification in MySQL (notifications table)
→ Sends email/SMS to user: "Payment received! Order #1 confirmed"
```

---

### Step 8: Check Inventory (Async Update)
```
CLIENT → API Gateway → Inventory Service → MySQL
↓
Reads stock level for product
```

**Test Command:**
```bash
curl "http://localhost/api/inventory/507f1f77bcf86cd799439011/check-stock?quantity=5"
```

**Response:**
```json
{
  "product_id": "507f1f77bcf86cd799439011",
  "stock_available": 48,
  "quantity_requested": 5,
  "available": true
}
```

**Inventory Data Changed in MySQL (after order):**
```
Before: stock = 50
After: stock = 48 (50 - 2 = 48)
```

**EVENT PUBLISHED TO KAFKA (inventory-events topic):**
```json
{
  "event_type": "inventory_updated",
  "product_id": "507f1f77bcf86cd799439011",
  "stock_before": 50,
  "stock_after": 48,
  "quantity_sold": 2,
  "order_id": 1,
  "timestamp": "2025-12-01T14:05:00Z"
}
```

---

### Step 9: Create Shipment (After Payment)
```
CLIENT (with TOKEN) → API Gateway → Shipping Service
    ↓
    ├→ Get order details (MySQL)
    ├→ Create shipment (MySQL)
    └→ Publish Event to Kafka (shipping-events topic)
```

**Test Command:**
```bash
curl -X POST http://localhost/api/shipments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "order_id": 1,
    "carrier": "DHL",
    "estimated_delivery": "2025-12-05"
  }'
```

**Response:**
```json
{
  "shipment_id": 1,
  "order_id": 1,
  "carrier": "DHL",
  "status": "pending",
  "tracking_number": "DHL123456789",
  "estimated_delivery": "2025-12-05",
  "created_at": "2025-12-01T14:15:00Z"
}
```

**EVENT PUBLISHED TO KAFKA (shipping-events topic):**
```json
{
  "event_type": "shipment_created",
  "shipment_id": 1,
  "order_id": 1,
  "carrier": "DHL",
  "tracking_number": "DHL123456789",
  "status": "pending",
  "estimated_delivery": "2025-12-05",
  "timestamp": "2025-12-01T14:15:00Z"
}
```

---

## 3. COMPLETE REAL-TIME TESTING SCENARIO

### Open 4 Terminal Windows:

**Terminal 1: Watch Kafka Order Events**
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic order-events \
  --from-beginning
```

**Terminal 2: Watch Kafka Payment Events**
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic payment-events \
  --from-beginning
```

**Terminal 3: Watch Kafka Shipping Events**
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic shipping-events \
  --from-beginning
```

**Terminal 4: Run API Commands**
```bash
# 1. Register user
curl -X POST http://localhost/api/users/register ...

# 2. Login to get token
curl -X POST http://localhost/api/users/login ...

# 3. Create product
curl -X POST http://localhost/api/products/ ...

# 4. Create order (watch Terminal 1 for event)
curl -X POST http://localhost/api/orders/ ...

# 5. Process payment (watch Terminal 2 for event)
curl -X POST http://localhost/api/payments/ ...

# 6. Create shipment (watch Terminal 3 for event)
curl -X POST http://localhost/api/shipments/ ...
```

---

## 4. DATABASE VERIFICATION

### Check MySQL Data:
```bash
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM users;"
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM orders;"
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM payments;"
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM shipments;"
```

### Check MongoDB Data:
```bash
docker exec -it mongodb mongosh --username root --password root123 << 'EOF'
use ecommerce
db.products.find().pretty()
EOF
```

### Check Redis Cache:
```bash
docker exec -it redis redis-cli
KEYS *
GET "product:507f1f77bcf86cd799439011"
KEYS "service:registry:*"
```

---

## 5. INTER-SERVICE COMMUNICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    Complete Data Flow                            │
└─────────────────────────────────────────────────────────────────┘

1. User Service (Port 8001)
   ├─ Register/Login users
   ├─ Generate JWT tokens
   ├─ Store in MySQL
   └─ Cache in Redis

2. Product Service (Port 8002)
   ├─ Manage products
   ├─ Store in MongoDB
   └─ Cache search results in Redis

3. Order Service (Port 8003)
   ├─ Create orders
   ├─ Call Inventory Service to check stock
   ├─ Store in MySQL
   ├─ Publish order_created event → Kafka
   └─ Trigger downstream services

4. Payment Service (Port 8004)
   ├─ Process payments
   ├─ Update order status
   ├─ Store in MySQL
   ├─ Publish payment_processed event → Kafka
   └─ Trigger Notification Service

5. Inventory Service (Port 8005)
   ├─ Manage stock levels
   ├─ Called by Order Service
   ├─ Publish inventory_updated event → Kafka
   └─ Consumed by Product Service (cache invalidation)

6. Notification Service (Port 8011)
   ├─ Listen to Kafka events (payment, order, shipping)
   ├─ Create notifications
   ├─ Send emails/SMS
   └─ Store in MySQL

7. Shipping Service (Port 8006)
   ├─ Create shipments
   ├─ Track shipments
   ├─ Publish shipping_events → Kafka
   └─ Store in MySQL

8. Search Service (Port 8009)
   ├─ Listen to product events
   ├─ Update search index in Redis
   └─ Serve fast searches

9. Kafka (Port 9092)
   ├─ order-events: Order Service → all subscribers
   ├─ payment-events: Payment Service → Notification, Order
   ├─ inventory-events: Inventory Service → Product, Search
   ├─ shipping-events: Shipping Service → Notification
   └─ Enables asynchronous communication
```

---

## 6. TROUBLESHOOTING

### Service not responding?
```bash
docker-compose logs service-name
```

### Kafka messages not appearing?
```bash
# Check Kafka broker connectivity
docker exec -it kafka kafka-broker-api-versions --bootstrap-server kafka:9092

# Check topics exist
docker exec -it kafka kafka-topics.sh --bootstrap-server kafka:9092 --list

# Create topic if missing
docker exec -it kafka kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --create \
  --topic order-events \
  --partitions 1 \
  --replication-factor 1
```

### Database connection errors?
```bash
# Check MySQL status
docker-compose logs mysql

# Test MySQL connection
docker exec -it mysql-db mysql -u root -proot123 -e "SELECT 1;"

# Check MongoDB status
docker-compose logs mongodb

# Test MongoDB connection
docker exec -it mongodb mongosh --eval "db.adminCommand('ping')"
```

### Services crashing on startup?
```bash
# Check startup logs (last 50 lines)
docker-compose logs --tail=50 user-service

# Service should retry connecting to database
# Wait 1-2 minutes for all services to fully initialize
```

---

## 7. FULL SCENARIO SCRIPT

Save this as `test_full_flow.sh`:

```bash
#!/bin/bash

echo "=== Starting E-Commerce Microservices Full Test ==="

# Get token
TOKEN=$(curl -s -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"MyPassword123!"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"

# Get products
curl -s http://localhost/api/products/ | jq .

# Create order
ORDER=$(curl -s -X POST http://localhost/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{...}' | jq -r '.order_id')

echo "Order ID: $ORDER"

# Process payment
curl -s -X POST http://localhost/api/payments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"order_id\":$ORDER,...}" | jq .
```

---

**This guide covers complete data flow across all services!**

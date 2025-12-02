# API Documentation

## Base URL
```
http://localhost  (Development)
http://api.ecommerce.com  (Production)
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Get token from login endpoint:
```bash
POST /api/users/login
{
  "username": "testuser",
  "password": "password123"
}
```

---

## User Service (Port 8001)

### Register User
```
POST /api/users/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "full_name": "Test User",
  "phone": "0123456789",
  "address": "123 Main St"
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser",
  "full_name": "Test User",
  "is_active": true,
  "created_at": "2024-11-30T10:00:00"
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

Request:
{
  "username": "testuser",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com"
}
```

### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser",
  "full_name": "Test User",
  "is_active": true
}
```

### Get User by ID
```
GET /api/users/{user_id}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser"
}
```

### Update User
```
PUT /api/users/{user_id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "email": "newemail@example.com",
  "full_name": "Updated Name",
  "phone": "9876543210"
}

Response: 200 OK
{
  "id": 1,
  "email": "newemail@example.com",
  "full_name": "Updated Name"
}
```

---

## Product Service (Port 8002)

### Create Product
```
POST /api/products/
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "Laptop Dell XPS",
  "description": "High-performance laptop",
  "price": 1500.00,
  "category": "Electronics",
  "stock": 50,
  "sku": "LAPTOP-XPS-001",
  "images": ["image1.jpg", "image2.jpg"],
  "attributes": {
    "processor": "Intel i9",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "message": "Product created successfully"
}
```

### Get Product
```
GET /api/products/{product_id}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop Dell XPS",
  "description": "High-performance laptop",
  "price": 1500.00,
  "category": "Electronics",
  "stock": 50,
  "created_at": "2024-11-30T10:00:00"
}
```

### List Products
```
GET /api/products/?skip=0&limit=10&category=Electronics

Query Parameters:
- skip: Number of items to skip (default: 0)
- limit: Number of items to return (default: 10, max: 100)
- category: Filter by category (optional)

Response: 200 OK
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Laptop",
      "price": 1500.00
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

### Search Products
```
GET /api/search/?keyword=laptop&limit=10

Query Parameters:
- keyword: Search keyword (required)
- limit: Max results (default: 10)

Response: 200 OK
{
  "keyword": "laptop",
  "results": [
    {
      "id": "1",
      "name": "Laptop Dell XPS",
      "price": 1500
    }
  ],
  "from_cache": false,
  "count": 1
}
```

### Update Product
```
PUT /api/products/{product_id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "price": 1400.00,
  "stock": 45
}

Response: 200 OK
{
  "message": "Product updated successfully"
}
```

---

## Order Service (Port 8003)

### Create Order
```
POST /api/orders/
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "user_id": 1,
  "items": [
    {
      "product_id": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 1500.00
    }
  ],
  "shipping_address": "123 Main St, New York, NY 10001"
}

Response: 200 OK
{
  "id": 1,
  "user_id": 1,
  "total_amount": 3000.00,
  "status": "pending",
  "items": [
    {
      "product_id": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 1500.00
    }
  ],
  "created_at": "2024-11-30T10:00:00"
}
```

### Get Order
```
GET /api/orders/{order_id}

Response: 200 OK
{
  "id": 1,
  "user_id": 1,
  "total_amount": 3000.00,
  "status": "pending"
}
```

### List Orders
```
GET /api/orders/?skip=0&limit=10&user_id=1

Query Parameters:
- skip: Pagination offset
- limit: Items per page
- user_id: Filter by user (optional)

Response: 200 OK
{
  "orders": [...],
  "count": 5
}
```

### Update Order Status
```
PUT /api/orders/{order_id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "status": "confirmed"
}

Response: 200 OK
{
  "id": 1,
  "status": "confirmed"
}

Valid statuses: pending, confirmed, shipped, delivered, cancelled
```

### Cancel Order
```
POST /api/orders/{order_id}/cancel
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Order cancelled successfully"
}
```

---

## Payment Service (Port 8004)

### Process Payment
```
POST /api/payments/
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "order_id": 1,
  "user_id": 1,
  "amount": 3000.00,
  "payment_method": "credit_card"
}

Payment Methods:
- credit_card
- paypal
- bank_transfer

Response: 200 OK
{
  "id": 1,
  "order_id": 1,
  "amount": 3000.00,
  "transaction_id": "TXN-123456789",
  "status": "completed"
}
```

### Get Payment
```
GET /api/payments/{payment_id}

Response: 200 OK
{
  "id": 1,
  "order_id": 1,
  "amount": 3000.00,
  "status": "completed"
}
```

### Refund Payment
```
POST /api/payments/{payment_id}/refund
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Payment refunded successfully"
}
```

---

## Inventory Service (Port 8005)

### Create Inventory
```
POST /api/inventory/
Content-Type: application/json

Request:
{
  "product_id": "507f1f77bcf86cd799439011",
  "quantity": 100,
  "warehouse_location": "A-1-1"
}

Response: 200 OK
{
  "id": 1,
  "product_id": "507f1f77bcf86cd799439011",
  "quantity": 100,
  "reserved": 0
}
```

### Get Inventory
```
GET /api/inventory/{product_id}

Response: 200 OK
{
  "id": 1,
  "product_id": "507f1f77bcf86cd799439011",
  "quantity": 100,
  "reserved": 10,
  "warehouse_location": "A-1-1"
}
```

### Check Stock
```
GET /api/inventory/{product_id}/check-stock?quantity=5

Response: 200 OK
{
  "product_id": "507f1f77bcf86cd799439011",
  "quantity": 5,
  "available": true
}
```

---

## Rating Service (Port 8008)

### Create Rating
```
POST /api/ratings/
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "product_id": "507f1f77bcf86cd799439011",
  "user_id": 1,
  "score": 4.5,
  "comment": "Great product, highly recommended!"
}

Score: 0-5 (float)

Response: 200 OK
{
  "id": 1,
  "product_id": "507f1f77bcf86cd799439011",
  "score": 4.5
}
```

### Get Product Ratings
```
GET /api/ratings/product/{product_id}

Response: 200 OK
{
  "ratings": [
    {
      "id": 1,
      "score": 4.5,
      "comment": "Great!"
    }
  ],
  "average": 4.5,
  "count": 1
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token",
  "headers": {"WWW-Authenticate": "Bearer"}
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- No rate limiting configured (configure in production)
- Recommended: 100 requests per minute per user

## API Versioning

Current Version: v1.0
- Base path: `/api/`
- Future: `/api/v2/` (if needed)

---

## Webhook Events

Services publish events via Kafka:

### Order Events
```
Topic: order-events
{
  "event": "order_created|order_status_updated|order_cancelled",
  "order_id": 1,
  "user_id": 1,
  "status": "pending|confirmed|shipped|delivered|cancelled"
}
```

### Payment Events
```
Topic: payment-events
{
  "event": "payment_processed|payment_refunded",
  "payment_id": 1,
  "order_id": 1,
  "status": "completed|refunded"
}
```

---

Last Updated: November 30, 2024

# 🎯 E-Commerce Microservices System - DEMO

## ✅ Hệ thống đang chạy trên:
- **API Gateway**: http://localhost (port 80)
- **Services**: port 8000-8012
- **Database**: MySQL (3307), MongoDB (27017), Redis (6379)

---

## 📋 TEST API GATEWAY & SERVICES

### 1️⃣ **Health Check** (Kiểm tra hệ thống sống)
```bash
curl http://localhost/health
```
**Kết quả mong đợi:**
```json
{"status": "healthy"}
```

---

### 2️⃣ **Discovery Service** (Dịch vụ Phát hiện)
Giúp các services tìm kiếm nhau

```bash
curl http://localhost/api/discovery/health
```
**Kết quả mong đợi:**
```json
{"status":"healthy","service":"discovery-service"}
```

---

### 3️⃣ **User Service** (Dịch vụ Người dùng)

#### 3.1 Tạo User mới
```bash
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

#### 3.2 Login
```bash
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123"
  }'
```
**Kết quả:** Nhận được JWT token

#### 3.3 Xem thông tin User
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/users/me
```

---

### 4️⃣ **Product Service** (Dịch vụ Sản phẩm)

#### 4.1 Lấy danh sách sản phẩm
```bash
curl http://localhost/api/products/
```

#### 4.2 Tạo sản phẩm mới
```bash
curl -X POST http://localhost/api/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop ASUS",
    "description": "Laptop gaming cao cấp",
    "price": 25000000,
    "stock": 10,
    "category": "Electronics"
  }'
```

#### 4.3 Tìm kiếm sản phẩm
```bash
curl "http://localhost/api/search/?q=laptop"
```

---

### 5️⃣ **Order Service** (Dịch vụ Đơn hàng)

#### 5.1 Tạo đơn hàng
```bash
curl -X POST http://localhost/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2, "price": 25000000}
    ]
  }'
```

#### 5.2 Lấy danh sách đơn hàng
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/orders/
```

#### 5.3 Xem chi tiết đơn hàng
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/orders/1
```

---

### 6️⃣ **Payment Service** (Dịch vụ Thanh toán)

#### 6.1 Xử lý thanh toán
```bash
curl -X POST http://localhost/api/payments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "order_id": 1,
    "amount": 50000000,
    "payment_method": "credit_card"
  }'
```

#### 6.2 Lấy lịch sử thanh toán
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/payments/
```

---

### 7️⃣ **Inventory Service** (Dịch vụ Kho hàng)

#### 7.1 Kiểm tra tồn kho
```bash
curl http://localhost/api/inventory/product/1
```

#### 7.2 Cập nhật tồn kho
```bash
curl -X PUT http://localhost/api/inventory/product/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50
  }'
```

---

### 8️⃣ **Shipping Service** (Dịch vụ Vận chuyển)

#### 8.1 Tạo đơn vận chuyển
```bash
curl -X POST http://localhost/api/shipments/ \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "address": "123 Đường ABC, Hà Nội",
    "phone": "0987654321"
  }'
```

#### 8.2 Cập nhật trạng thái vận chuyển
```bash
curl -X PUT http://localhost/api/shipments/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

### 9️⃣ **Rating Service** (Dịch vụ Đánh giá)

#### 9.1 Thêm đánh giá
```bash
curl -X POST http://localhost/api/ratings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": "1",
    "rating": 5,
    "comment": "Sản phẩm rất tốt!"
  }'
```

#### 9.2 Xem đánh giá sản phẩm
```bash
curl "http://localhost/api/ratings/product/1"
```

---

### 🔟 **Promotion Service** (Dịch vụ Khuyến mãi)

#### 10.1 Lấy danh sách khuyến mãi
```bash
curl http://localhost/api/promotions/active
```

#### 10.2 Tạo khuyến mãi
```bash
curl -X POST http://localhost/api/promotions/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sale 50%",
    "discount_percent": 50,
    "valid_from": "2025-12-01",
    "valid_to": "2025-12-31"
  }'
```

---

### 1️⃣1️⃣ **Favourite Service** (Dịch vụ Yêu thích)

#### 11.1 Thêm vào yêu thích
```bash
curl -X POST http://localhost/api/favourites/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "product_id": 1
  }'
```

#### 11.2 Lấy danh sách yêu thích
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/favourites/
```

---

### 1️⃣2️⃣ **Tax Service** (Dịch vụ Thuế)

#### 12.1 Tính thuế
```bash
curl "http://localhost/api/tax/calculate?amount=1000000&country=VN&state=HN"
```

#### 12.2 Lấy tỷ lệ thuế
```bash
curl "http://localhost/api/tax/rate?country=VN"
```

---

### 1️⃣3️⃣ **Notification Service** (Dịch vụ Thông báo)

#### 13.1 Gửi thông báo
```bash
curl -X POST http://localhost/api/notifications/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Đơn hàng được xác nhận",
    "message": "Đơn hàng #1 của bạn đã được xác nhận"
  }'
```

---

## 🐳 DOCKER COMMANDS

### Xem trạng thái tất cả services
```bash
docker-compose ps
```

### Xem logs của service
```bash
docker-compose logs discovery-service -f
docker-compose logs product-service -f
docker-compose logs user-service -f
```

### Xem logs tất cả
```bash
docker-compose logs -f
```

### Restart hệ thống
```bash
docker-compose restart
```

### Stop hệ thống
```bash
docker-compose down
```

### Start hệ thống
```bash
docker-compose up -d
```

---

## 📊 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX API GATEWAY (port 80)                  │
│  Routing tất cả requests tới các microservices                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │  User   │        │ Product │        │ Order   │
   │Service  │        │ Service │        │ Service │
   │(8001)   │        │(8002)   │        │(8003)   │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        │     ┌────────────┼────────────┐     │
        │     │            │            │     │
        ▼     ▼            ▼            ▼     ▼
   ┌────────────────────────────────────────────────┐
   │         Shared Databases & Message Queue       │
   ├────────────────────────────────────────────────┤
   │ • MySQL (3307)        - User data              │
   │ • MongoDB (27017)     - Product, Search data   │
   │ • Redis (6379)        - Caching, Sessions      │
   │ • Kafka (9092)        - Message Queue          │
   │ • Zookeeper (2181)    - Coordination           │
   └────────────────────────────────────────────────┘
```

---

## 🎯 QUICK DEMO SCRIPT

```bash
#!/bin/bash

echo "=== ECOMMERCE MICROSERVICES DEMO ==="
echo ""

# 1. Health check
echo "1. API Gateway Health:"
curl http://localhost/health
echo -e "\n"

# 2. Discovery service
echo "2. Discovery Service:"
curl http://localhost/api/discovery/health
echo -e "\n"

# 3. Product list
echo "3. Product List:"
curl http://localhost/api/products/ 2>/dev/null | head -20
echo -e "\n"

# 4. All services status
echo "4. All Services:"
docker-compose ps
echo -e "\n"

echo "✅ System Demo Complete!"
```

**Lưu và chạy:**
```bash
bash demo_script.sh
```

---

## 📝 NOTES
- Thay `YOUR_TOKEN_HERE` bằng token nhận được từ login
- Thay `1` bằng ID thực tế của product/order
- Tất cả requests đi qua **Nginx API Gateway** trên port **80**
- Mỗi service có port riêng (8000-8012) nhưng không cần dùng trực tiếp

---

**✨ Hệ thống sẵn sàng demo! 🚀**

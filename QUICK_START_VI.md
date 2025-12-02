# Hướng dẫn Khởi Động & Kiểm Tra Hệ Thống E-Commerce Microservices
# ====================================================================

## 🚀 KHỞI ĐỘNG HỆ THỐNG (5 PHÚT)

### 1. Đảm bảo Docker Desktop đang chạy
- **Windows**: Tìm kiếm "Docker Desktop" trong Start Menu → Click để mở
- **Hoặc chạy lệnh**: `& 'C:\Program Files\Docker\Docker\Docker Desktop.exe'`
- Chờ Docker hoàn toàn khởi động (khoảng 30 giây)

### 2. Mở PowerShell và chạy script khởi động
```powershell
cd 'C:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices'
.\START_SYSTEM.ps1
```

**Script sẽ:**
- ✓ Kiểm tra Docker đang chạy
- ✓ Dừng containers cũ
- ✓ Xóa volumes cũ
- ✓ Build & khởi động tất cả services
- ✓ Chờ services sẵn sàng
- ✓ Kiểm tra health endpoints

### 3. Kiểm tra trạng thái services
```powershell
docker-compose ps
```

**Bạn sẽ thấy tất cả 14 services:**
- ✓ api-gateway
- ✓ mysql-db
- ✓ mongodb
- ✓ redis
- ✓ kafka
- ✓ user-service
- ✓ product-service
- ✓ order-service
- ✓ payment-service
- ✓ inventory-service
- ✓ shipping-service
- ✓ ... (7 services còn lại)

---

## 📊 KIỂM TRA LUỒNG DỮ LIỆU GIỮA CÁC SERVICE

### Cách 1: Chạy Test Integration Tự động (DỄ NHẤT)

**Terminal 1 - Chạy test tự động:**
```powershell
cd 'C:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices'
python test_integration.py
```

**Kết quả:**
- Tự động đăng ký user
- Tự động đăng nhập
- Tự động tạo product
- Tự động tạo order
- Tự động thanh toán
- Kiểm tra inventory
- Tự động tạo shipment

Tất cả xong trong 1 phút!

---

### Cách 2: Kiểm Tra Thủ Công (CHI TIẾT HƠN)

#### **Terminal 1: Mở Kafka Consumer để xem events**
```powershell
docker exec -it kafka kafka-console-consumer `
  --bootstrap-server kafka:9092 `
  --topic order-events `
  --from-beginning
```

#### **Terminal 2: Mở Terminal khác cho API calls**
```powershell
cd 'C:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices'
```

#### **Bước 1: Đăng Ký User**
```powershell
$body = @{
    email = "john@example.com"
    username = "john_doe"
    password = "Pass123!"
    full_name = "John Doe"
    phone = "0123456789"
    address = "123 Main St"
} | ConvertTo-Json

curl -X POST http://localhost/api/users/register `
  -H "Content-Type: application/json" `
  -Body $body | ConvertFrom-Json | ConvertTo-Json
```

**Kết quả: Lưu `access_token` cho các bước tiếp theo**

#### **Bước 2: Đăng Nhập**
```powershell
$body = @{
    username = "john_doe"
    password = "Pass123!"
} | ConvertTo-Json

$response = curl -X POST http://localhost/api/users/login `
  -H "Content-Type: application/json" `
  -Body $body | ConvertFrom-Json

$TOKEN = $response.access_token
Write-Host "Token: $TOKEN"
```

#### **Bước 3: Tạo Product**
```powershell
$body = @{
    name = "Laptop Pro"
    description = "High-performance laptop"
    price = 1500
    category = "Electronics"
    stock = 50
    sku = "LT-001"
    images = @("https://via.placeholder.com/300")
} | ConvertTo-Json

$response = curl -X POST http://localhost/api/products/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -Body $body | ConvertFrom-Json

$PRODUCT_ID = $response._id
Write-Host "Product ID: $PRODUCT_ID"
```

#### **Bước 4: Tạo Order (XEM KAFKA EVENT)**
```powershell
$body = @{
    user_id = 1
    items = @(
        @{
            product_id = $PRODUCT_ID
            quantity = 2
            price = 1500
        }
    )
    shipping_address = "123 Main St, City"
    payment_method = "credit_card"
} | ConvertTo-Json

$response = curl -X POST http://localhost/api/orders/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -Body $body | ConvertFrom-Json

$ORDER_ID = $response.order_id
Write-Host "Order ID: $ORDER_ID"
```

**👉 Kiểm tra Terminal 1: Bạn sẽ thấy JSON event từ Kafka!**

#### **Bước 5: Thanh Toán (XEM KAFKA EVENT)**
```powershell
$body = @{
    order_id = $ORDER_ID
    user_id = 1
    amount = 3000
    payment_method = "credit_card"
} | ConvertTo-Json

curl -X POST http://localhost/api/payments/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -Body $body | ConvertFrom-Json | ConvertTo-Json
```

**👉 Kiểm tra Terminal 1: Bạn sẽ thấy payment event từ Kafka!**

#### **Bước 6: Kiểm Tra Inventory**
```powershell
curl "http://localhost/api/inventory/$PRODUCT_ID/check-stock?quantity=5" | ConvertFrom-Json | ConvertTo-Json
```

#### **Bước 7: Tạo Shipment (XEM KAFKA EVENT)**
```powershell
$body = @{
    order_id = $ORDER_ID
    carrier = "DHL"
    estimated_delivery = "2025-12-08"
} | ConvertTo-Json

curl -X POST http://localhost/api/shipments/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -Body $body | ConvertFrom-Json | ConvertTo-Json
```

**👉 Kiểm tra Terminal 1: Bạn sẽ thấy shipping event từ Kafka!**

---

## 🗄️ KIỂM TRA DỮ LIỆU TRONG DATABASE

### Kiểm tra MySQL
```powershell
# Xem users
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM users;"

# Xem orders
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM orders;"

# Xem payments
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT * FROM payments;"
```

### Kiểm tra MongoDB
```powershell
docker exec -it mongodb mongosh --username root --password root123 << 'EOF'
use ecommerce
db.products.find().pretty()
EOF
```

### Kiểm tra Redis Cache
```powershell
docker exec -it redis redis-cli
KEYS *
GET "product:product_id_here"
```

### Kiểm tra Kafka Topics
```powershell
# Danh sách topics
docker exec -it kafka kafka-topics.sh --bootstrap-server kafka:9092 --list

# Xem messages trong topic
docker exec -it kafka kafka-console-consumer `
  --bootstrap-server kafka:9092 `
  --topic order-events `
  --from-beginning
```

---

## 📋 LUỒNG DỮ LIỆU HOÀN CHỈNH

```
1. USER REGISTRATION (User Service)
   └→ Dữ liệu lưu: MySQL (users table)
   └→ Token: JWT

2. PRODUCT CREATION (Product Service)
   └→ Dữ liệu lưu: MongoDB (products collection)
   └→ Cache: Redis

3. ORDER CREATION (Order Service)
   ├→ Dữ liệu lưu: MySQL (orders + order_items tables)
   ├→ Kafka Event: order-events topic
   └→ Notify: Notification Service subscribe & gửi thông báo

4. PAYMENT PROCESSING (Payment Service)
   ├→ Dữ liệu lưu: MySQL (payments table)
   ├→ Update: Order status → paid
   ├→ Kafka Event: payment-events topic
   └→ Notify: Notification Service nhận event

5. SHIPMENT CREATION (Shipping Service)
   ├→ Dữ liệu lưu: MySQL (shipments table)
   ├→ Kafka Event: shipping-events topic
   └→ Notify: Notification Service nhận event

6. ASYNC EVENT PROCESSING (Kafka)
   ├→ order-events: Order → Payment, Notification, Shipping
   ├→ payment-events: Payment → Order, Notification
   ├→ inventory-events: Inventory → Product, Search
   └→ shipping-events: Shipping → Notification
```

---

## 🆘 TROUBLESHOOTING

### Service không respond?
```powershell
# Xem logs
docker-compose logs -f user-service

# Nếu thấy "Can't connect to MySQL", đợi 30 giây nữa (service đang retry)
# Nếu vẫn lỗi sau 2 phút, restart service:
docker-compose restart user-service
```

### Kafka không nhận events?
```powershell
# Kiểm tra Kafka running
docker-compose logs kafka | Select-Object -Last 10

# Test Kafka connection
docker exec -it kafka kafka-broker-api-versions --bootstrap-server kafka:9092

# Xem topics
docker exec -it kafka kafka-topics.sh --bootstrap-server kafka:9092 --list

# Nếu topic không có, tạo topic:
docker exec -it kafka kafka-topics.sh `
  --bootstrap-server kafka:9092 `
  --create `
  --topic order-events `
  --partitions 1 `
  --replication-factor 1
```

### API Gateway không forward requests?
```powershell
# Xem nginx logs
docker-compose logs nginx

# Kiểm tra nginx config
docker exec api-gateway nginx -t
```

### Database connection timeout?
```powershell
# Kiểm tra MySQL status
docker-compose logs mysql | Select-Object -Last 10

# Restart MySQL
docker-compose restart mysql

# Chờ MySQL sẵn sàng (1-2 phút), rồi restart services:
docker-compose restart user-service order-service payment-service
```

---

## 📁 IMPORTANT FILES

| File | Mục đích |
|------|---------|
| `docker-compose.yml` | Cấu hình tất cả containers |
| `START_SYSTEM.ps1` | Script khởi động tự động |
| `test_integration.py` | Python script test tự động |
| `COMPLETE_DATA_FLOW_GUIDE.md` | Hướng dẫn chi tiết về data flow |
| `config/` | Cấu hình chung cho tất cả services |
| `*-service/main.py` | Entry point của mỗi microservice |

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Docker Desktop đang chạy
- [ ] Chạy `.\START_SYSTEM.ps1` hoàn thành
- [ ] Tất cả services show `Up` khi `docker-compose ps`
- [ ] Test health endpoints thành công
- [ ] Chạy `python test_integration.py` và hoàn thành
- [ ] Xem Kafka events trong consumer terminal
- [ ] Kiểm tra dữ liệu trong MySQL/MongoDB/Redis

---

## 🎯 TIẾP THEO

1. **Phát triển thêm services**: Thêm endpoint mới vào routers/
2. **Thêm Kafka consumers**: Subscribe thêm topics
3. **Optimize caching**: Cấu hình Redis caching tối ưu
4. **Security**: Thay đổi JWT_SECRET, database passwords
5. **Monitoring**: Thêm logging và metrics
6. **Testing**: Viết unit tests cho từng service

---

**✓ Hệ thống sẵn sàng hoạt động!** 🚀

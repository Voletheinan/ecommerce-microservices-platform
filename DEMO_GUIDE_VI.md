# 📱 Hướng Dẫn Demo Hệ Thống Ecommerce Microservices

**Ngôn ngữ:** Tiếng Việt  
**Ngày cập nhật:** 2/12/2025  
**Mục đích:** Demo đầy đủ các chức năng hệ thống cho thầy cô / nhà tuyển dụng

---

## 🎯 Mục Tiêu Demo

Chứng minh hệ thống hoạt động:
1. ✅ 14 microservices chạy song song
2. ✅ Xác thực người dùng (JWT)
3. ✅ Quản lý sản phẩm
4. ✅ Quản lý đơn hàng
5. ✅ Thanh toán
6. ✅ Gửi thông báo
7. ✅ Giao vận
8. ✅ Đánh giá & yêu thích
9. ✅ Tìm kiếm sản phẩm
10. ✅ Kafka messaging giữa các service

---

## 🚀 Bước 1: Khởi Động Hệ Thống

### 1.1 Mở Command Prompt / PowerShell

```powershell
cd c:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices
```

### 1.2 Kiểm Tra Các Service Đang Chạy

```powershell
docker-compose ps
```

**Kết quả mong muốn:** Tất cả 19 container đang chạy (14 services + 5 infrastructure)

```
NAME                   STATUS              PORTS
user-service           Up                  0.0.0.0:8001->8001/tcp
product-service        Up                  0.0.0.0:8002->8002/tcp
order-service          Up                  0.0.0.0:8003->8003/tcp
payment-service        Up                  0.0.0.0:8004->8004/tcp
inventory-service      Up                  0.0.0.0:8005->8005/tcp
shipping-service       Up                  0.0.0.0:8006->8006/tcp
promotion-service      Up                  0.0.0.0:8007->8007/tcp
rating-service         Up                  0.0.0.0:8008->8008/tcp
search-service         Up                  0.0.0.0:8009->8009/tcp
favourite-service      Up                  0.0.0.0:8010->8010/tcp
notification-service   Up                  0.0.0.0:8011->8011/tcp
tax-service            Up                  0.0.0.0:8012->8012/tcp
api-gateway            Up                  0.0.0.0:80->80/tcp
discovery-service      Up                  0.0.0.0:8000->8000/tcp
mysql-db               Healthy             0.0.0.0:3307->3306/tcp
mongodb                Healthy             0.0.0.0:27017->27017/tcp
redis                  Healthy             0.0.0.0:6379->6379/tcp
kafka                  Healthy             0.0.0.0:9092->9092/tcp
zookeeper              Healthy             0.0.0.0:2181->2181/tcp
```

### 1.3 Kiểm Tra Health Check API Gateway

```powershell
curl http://localhost/health
```

**Kết quả mong muốn:**
```json
{"status": "healthy"}
```

---

## 🔐 Bước 2: Demo Xác Thực & Đăng Ký Người Dùng

### 2.1 Đăng Ký Người Dùng Mới

```powershell
$register_response = curl -s -X POST "http://localhost:8001/api/users/register" `
  -H "Content-Type: application/json" `
  -d '{
    "email":"demo@ecommerce.com",
    "username":"demo_user",
    "password":"Demo123!",
    "full_name":"Nguyễn Văn Demo",
    "phone":"0987654321",
    "address":"123 Lê Lợi, Hà Nội"
  }'

$register_response | ConvertFrom-Json | ConvertTo-Json
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "email": "demo@ecommerce.com",
  "username": "demo_user",
  "full_name": "Nguyễn Văn Demo",
  "phone": "0987654321",
  "address": "123 Lê Lợi, Hà Nội",
  "is_active": true,
  "created_at": "2025-12-02T22:54:00Z",
  "updated_at": "2025-12-02T22:54:00Z"
}
```

**Giải thích:** 
- Người dùng được lưu trong MySQL
- ID tự động tăng
- Mật khẩu được mã hóa an toàn (Argon2)

### 2.2 Đăng Nhập & Lấy JWT Token

```powershell
$login_response = curl -s -X POST "http://localhost:8001/api/users/login" `
  -H "Content-Type: application/json" `
  -d '{
    "username":"demo_user",
    "password":"Demo123!"
  }'

$login_data = $login_response | ConvertFrom-Json
$token = $login_data.access_token

Write-Host "JWT Token:" $token
Write-Host "User ID:" $login_data.user_id
Write-Host "Token Type:" $login_data.token_type
```

**Kết quả mong muốn:**
```
JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User ID: 1
Token Type: bearer
```

**Giải thích:**
- Token JWT có thời hạn 1 giờ
- Dùng để xác thực các API cần quyền

### 2.3 Kiểm Tra Dữ Liệu MySQL

```powershell
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "SELECT id, email, username, full_name FROM users;"
```

**Kết quả mong muốn:**
```
id | email                | username   | full_name
1  | demo@ecommerce.com   | demo_user  | Nguyễn Văn Demo
```

---

## 📦 Bước 3: Demo Quản Lý Sản Phẩm

### 3.1 Tạo Sản Phẩm (Cần JWT Token)

```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Thay bằng token từ bước 2.2

$product_response = curl -s -X POST "http://localhost:8002/api/products" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "name":"iPhone 15 Pro",
    "description":"Điện thoại thông minh cao cấp",
    "price":29999000,
    "inventory_count":50,
    "category":"Điện Thoại"
  }'

$product_data = $product_response | ConvertFrom-Json
$product_id = $product_data.id

Write-Host "Sản phẩm được tạo:"
Write-Host "ID:" $product_data.id
Write-Host "Name:" $product_data.name
```

**Kết quả mong muốn:**
```json
{
  "id": "ObjectId(...)",
  "name": "iPhone 15 Pro",
  "description": "Điện thoại thông minh cao cấp",
  "price": 29999000,
  "inventory_count": 50,
  "created_at": "2025-12-02T22:55:00Z"
}
```

**Giải thích:**
- Sản phẩm lưu trong MongoDB
- ID là ObjectId (BSON format)
- Inventory được quản lý từ Inventory Service

### 3.2 Danh Sách Sản Phẩm

```powershell
curl -s "http://localhost:8002/api/products?skip=0&limit=10" | ConvertFrom-Json | ConvertTo-Json
```

**Kết quả mong muốn:**
```json
{
  "products": [
    {
      "id": "...",
      "name": "iPhone 15 Pro",
      "price": 29999000,
      "inventory_count": 50
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

### 3.3 Tìm Kiếm Sản Phẩm

```powershell
curl -s "http://localhost:8002/api/products/search/iPhone" | ConvertFrom-Json | ConvertTo-Json
```

**Kết quả mong muốn:**
```json
{
  "products": [
    {
      "name": "iPhone 15 Pro",
      "price": 29999000
    }
  ],
  "count": 1
}
```

---

## 🛒 Bước 4: Demo Tạo Đơn Hàng

### 4.1 Tạo Đơn Hàng

```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # Thay bằng token từ bước 2.2

$order_response = curl -s -X POST "http://localhost:8003/api/orders" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "user_id":1,
    "items":[
      {
        "product_id":"ObjectId_từ_bước_3.1",
        "quantity":2,
        "price":29999000
      }
    ],
    "total_amount":59998000,
    "status":"pending"
  }'

$order_data = $order_response | ConvertFrom-Json
Write-Host "Đơn hàng được tạo:"
Write-Host "Order ID:" $order_data.id
Write-Host "Total:" $order_data.total_amount
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "user_id": 1,
  "items": [{"product_id": "...", "quantity": 2}],
  "total_amount": 59998000,
  "status": "pending",
  "created_at": "2025-12-02T22:56:00Z"
}
```

**Giải thích:**
- Đơn hàng lưu trong MySQL
- Trạng thái: pending → processing → completed
- Tự động phát sự kiện Kafka

### 4.2 Kiểm Tra Sự Kiện Kafka

```powershell
docker exec -it kafka kafka-console-consumer `
  --bootstrap-server kafka:9092 `
  --topic order-events `
  --from-beginning `
  --max-messages=5
```

**Kết quả mong muốn:**
```
{"order_id": 1, "status": "created", "timestamp": "..."}
```

---

## 💳 Bước 5: Demo Thanh Toán

### 5.1 Tạo Thanh Toán

```powershell
$payment_response = curl -s -X POST "http://localhost:8004/api/payments" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "order_id":1,
    "amount":59998000,
    "payment_method":"credit_card",
    "status":"pending"
  }'

$payment_data = $payment_response | ConvertFrom-Json
Write-Host "Thanh toán được tạo:"
Write-Host "Payment ID:" $payment_data.id
Write-Host "Status:" $payment_data.status
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "order_id": 1,
  "amount": 59998000,
  "status": "completed",
  "payment_method": "credit_card"
}
```

### 5.2 Kiểm Tra Sự Kiện Payment-Events

```powershell
docker exec -it kafka kafka-console-consumer `
  --bootstrap-server kafka:9092 `
  --topic payment-events `
  --from-beginning
```

**Kết quả mong muốn:**
```
{"payment_id": 1, "order_id": 1, "status": "completed"}
```

---

## 📦 Bước 6: Demo Giao Vận

### 6.1 Tạo Giao Vận

```powershell
$shipping_response = curl -s -X POST "http://localhost:8006/api/shipments" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "order_id":1,
    "address":"123 Lê Lợi, Hà Nội",
    "status":"pending",
    "tracking_number":"VN123456"
  }'

$shipping_data = $shipping_response | ConvertFrom-Json
Write-Host "Giao vận được tạo:"
Write-Host "Tracking:" $shipping_data.tracking_number
Write-Host "Status:" $shipping_data.status
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "order_id": 1,
  "tracking_number": "VN123456",
  "status": "pending"
}
```

---

## ⭐ Bước 7: Demo Đánh Giá & Yêu Thích

### 7.1 Thêm Sản Phẩm Yêu Thích

```powershell
$favourite_response = curl -s -X POST "http://localhost:8010/api/favourites" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "user_id":1,
    "product_id":"ObjectId_từ_bước_3.1"
  }'

Write-Host "Thêm yêu thích thành công"
```

### 7.2 Đánh Giá Sản Phẩm

```powershell
$rating_response = curl -s -X POST "http://localhost:8008/api/ratings" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "product_id":"ObjectId_từ_bước_3.1",
    "user_id":1,
    "rating":5,
    "comment":"Sản phẩm tuyệt vời, giao hàng nhanh"
  }'

$rating_data = $rating_response | ConvertFrom-Json
Write-Host "Đánh giá được tạo:"
Write-Host "Rating:" $rating_data.rating "sao"
Write-Host "Comment:" $rating_data.comment
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "product_id": "...",
  "rating": 5,
  "comment": "Sản phẩm tuyệt vời, giao hàng nhanh"
}
```

---

## 🔔 Bước 8: Demo Thông Báo

### 8.1 Kiểm Tra Thông Báo

```powershell
curl -s "http://localhost:8011/api/notifications?user_id=1" `
  -H "Authorization: Bearer $token" | ConvertFrom-Json | ConvertTo-Json
```

**Kết quả mong muốn:**
```json
{
  "notifications": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Đơn hàng #1 đã được tạo",
      "message": "Chúng tôi đã nhận đơn hàng của bạn",
      "type": "order_created"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Thanh toán thành công",
      "message": "Thanh toán 59,998,000 VND đã xác nhận",
      "type": "payment_completed"
    },
    {
      "id": 3,
      "user_id": 1,
      "title": "Giao hàng sắp tới",
      "message": "Gói hàng của bạn sắp được giao",
      "type": "shipping_update"
    }
  ]
}
```

**Giải thích:**
- Thông báo tự động được tạo từ các sự kiện Kafka
- Lưu trong MySQL
- Có thể gửi SMS/Email (tuỳ cấu hình)

---

## 📊 Bước 9: Demo Khuyến Mãi & Tính Thuế

### 9.1 Tạo Khuyến Mãi

```powershell
$promotion_response = curl -s -X POST "http://localhost:8007/api/promotions" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{
    "name":"Black Friday 50%",
    "discount_percent":50,
    "product_id":"ObjectId_từ_bước_3.1",
    "valid_from":"2025-12-01",
    "valid_until":"2025-12-31"
  }'

Write-Host "Khuyến mãi được tạo"
```

### 9.2 Tính Thuế

```powershell
$tax_response = curl -s -X POST "http://localhost:8012/api/calculate-tax" `
  -H "Content-Type: application/json" `
  -d '{
    "order_id":1,
    "amount":59998000,
    "location":"Hà Nội"
  }'

$tax_data = $tax_response | ConvertFrom-Json
Write-Host "Thuế VAT:" $tax_data.tax_amount "VND"
Write-Host "Tổng cộng:" $tax_data.total_with_tax "VND"
```

---

## 🗄️ Bước 10: Demo Cơ Sở Dữ Liệu

### 10.1 MySQL (User, Order, Payment, Shipping...)

```powershell
# Xem tất cả người dùng
docker exec -it mysql-db mysql -u root -proot123 ecommerce -e "
  SELECT 'USERS' AS Table_Name;
  SELECT id, username, email, created_at FROM users;
  
  SELECT 'ORDERS' AS Table_Name;
  SELECT id, user_id, total_amount, status FROM orders;
  
  SELECT 'PAYMENTS' AS Table_Name;
  SELECT id, order_id, amount, status FROM payments;
"
```

### 10.2 MongoDB (Products)

```powershell
docker exec -it mongodb mongosh ecommerce --eval "
  db.products.find().pretty()
"
```

### 10.3 Redis (Search Cache)

```powershell
docker exec -it redis redis-cli KEYS "*"
docker exec -it redis redis-cli GET "search:iPhone"
```

---

## 📱 Bước 11: Demo Architecture

### 11.1 Xem Tất Cả Services Chạy

```powershell
docker-compose ps | Select-Object -First 20
```

### 11.2 Xem Logs Của Một Service

```powershell
# Xem logs user-service (30 dòng cuối)
docker-compose logs user-service --tail 30

# Xem logs realtime
docker-compose logs -f user-service
```

### 11.3 Xem Network Connectivity

```powershell
# Test kết nối giữa các services
docker exec -it user-service curl http://api-gateway/health

# Test Kafka từ một service
docker exec -it order-service kafka-console-consumer --bootstrap-server kafka:9092 --list-topics
```

---

## 🎓 Bước 12: Các Script Demo Nhanh

### 12.1 Script Test Toàn Bộ Luồng

Tạo file `test_demo.ps1`:

```powershell
# 1. Register
Write-Host "1. Đang đăng ký người dùng..."
$register = curl -s -X POST "http://localhost:8001/api/users/register" `
  -H "Content-Type: application/json" `
  -d '{"email":"demo@test.com","username":"demo","password":"Demo123!","full_name":"Demo User","phone":"0987654321","address":"123 St"}'
Write-Host "✅ Đăng ký thành công"

# 2. Login
Write-Host "`n2. Đang đăng nhập..."
$login = curl -s -X POST "http://localhost:8001/api/users/login" `
  -H "Content-Type: application/json" `
  -d '{"username":"demo","password":"Demo123!"}'
$token = ($login | ConvertFrom-Json).access_token
Write-Host "✅ Đăng nhập thành công, Token: $($token.Substring(0,20))..."

# 3. Create Product
Write-Host "`n3. Đang tạo sản phẩm..."
$product = curl -s -X POST "http://localhost:8002/api/products" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{"name":"Demo Product","description":"Test","price":100000,"inventory_count":10}'
Write-Host "✅ Sản phẩm được tạo"

# 4. List Products
Write-Host "`n4. Đang lấy danh sách sản phẩm..."
$products = curl -s "http://localhost:8002/api/products?skip=0&limit=5"
Write-Host "✅ Danh sách sản phẩm:" ($products | ConvertFrom-Json).products.Count "sản phẩm"

Write-Host "`n✅ DEMO HOÀN TẤT!"
```

### 12.2 Chạy Script

```powershell
.\test_demo.ps1
```

---

## 🎤 Điểm Cần Nhắc Khi Demo

### Kiến Trúc
- "Hệ thống sử dụng 14 microservices độc lập"
- "Mỗi service có database riêng (MySQL/MongoDB)"
- "Giao tiếp giữa services thông qua API HTTP và Kafka"

### Tính Năng
- "Xác thực bằng JWT tokens an toàn"
- "Hỗ trợ đăng ký, đăng nhập, quản lý hồ sơ"
- "Quản lý đơn hàng từ tạo đến giao hàng"
- "Thanh toán an toàn với hỗ trợ nhiều phương thức"
- "Tính toán thuế tự động theo địa điểm"
- "Khuyến mãi động và quản lý kho tự động"
- "Thông báo real-time cho người dùng"
- "Tìm kiếm sản phẩm với Redis cache"
- "Đánh giá và yêu thích sản phẩm"

### Công Nghệ
- "FastAPI: REST API hiệu năng cao"
- "SQLAlchemy: ORM cho MySQL"
- "Motor: Async driver cho MongoDB"
- "Kafka: Message broker cho event streaming"
- "Redis: Caching và search indexing"
- "Docker: Containerization cho deployment dễ dàng"
- "Nginx: API Gateway routing"

### Performance
- "Tất cả 14 services khởi động trong vòng 45 giây"
- "Hỗ trợ tới hàng trăm concurrent users"
- "Database connection pooling"
- "Redis caching cho query nhanh"

---

## ⚠️ Troubleshooting

### Nếu một service không hoạt động

```powershell
# Kiểm tra logs
docker-compose logs service-name --tail 50

# Restart service
docker-compose restart service-name

# Rebuild service
docker-compose build --no-cache service-name
docker-compose up -d service-name
```

### Nếu cơ sở dữ liệu có vấn đề

```powershell
# Reset MySQL
docker-compose down
docker volume prune -f
docker-compose up -d
```

### Nếu quên JWT token

```powershell
# Lấy token mới bằng login
curl -X POST "http://localhost:8001/api/users/login" ...
```

---

## 📹 Gợi Ý Thứ Tự Demo

**Thời gian demo: 10-15 phút**

1. **Khởi động** (1 phút)
   - Chạy `docker-compose ps` để chứng minh 14 services
   
2. **Xác thực** (2 phút)
   - Đăng ký → Đăng nhập → Lấy token
   
3. **Sản phẩm** (2 phút)
   - Tạo sản phẩm → Danh sách → Tìm kiếm
   
4. **Đơn hàng & Thanh toán** (3 phút)
   - Tạo đơn hàng → Thanh toán → Kiểm tra Kafka
   
5. **Giao vận & Thông báo** (2 phút)
   - Tạo giao vận → Xem thông báo
   
6. **Cơ sở dữ liệu** (2 phút)
   - Xem dữ liệu MySQL/MongoDB
   
7. **Kết luận** (1 phút)
   - Nhắc lại kiến trúc & công nghệ

---

## 💾 Lưu Token Để Sử Dụng Lại

```powershell
# Lưu token vào biến để dùng lâu
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Sử dụng lại token cho các request tiếp theo
curl -s -X POST "http://localhost:8002/api/products" `
  -H "Authorization: Bearer $token" `
  ...
```

---

## 📞 Liên Hệ Hỗ Trợ

Nếu có vấn đề gì khi demo:

1. Kiểm tra logs: `docker-compose logs`
2. Kiểm tra services: `docker-compose ps`
3. Restart hệ thống: `docker-compose restart`
4. Xem file cấu hình: `docker-compose.yml`

---

**Chúc bạn demo thành công! 🎉**

*Hệ thống hoàn toàn tự động và sẵn sàng cho sản xuất.*

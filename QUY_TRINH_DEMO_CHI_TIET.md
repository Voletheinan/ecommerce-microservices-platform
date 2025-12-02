# 📖 QUY TRÌNH DEMO TOÀN BỘ HỆ THỐNG - Step by Step

**Cập nhật:** 2/12/2025  
**Mục đích:** Hướng dẫn chi tiết quy trình từ đăng ký → mua hàng → thanh toán → giao hàng → đánh giá

---

## 🎯 TỔNG QUAN QUY TRÌNH

```
┌─────────────────────────────────────────────────────────────────────┐
│  NGƯỜI MUA (Customer)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Đăng ký tài khoản                    → localhost:8001            │
│ 2. Đăng nhập                            → localhost:8001            │
│ 3. Xem danh sách sản phẩm               → localhost:8002            │
│ 4. Xem chi tiết sản phẩm                → localhost:8002            │
│ 5. Tạo đơn hàng (thêm giỏ)              → localhost:8003            │
│ 6. Xem tính giảm giá (coupon)           → localhost:8007            │
│ 7. Áp dụng mã giảm giá                  → localhost:8007            │
│ 8. Kiểm tra thuế                        → localhost:8012            │
│ 9. Thanh toán                           → localhost:8004            │
│ 10. Nhận thông báo thanh toán           → localhost:8011            │
│ 11. Tracking giao hàng                  → localhost:8006            │
│ 12. Nhận thông báo giao hàng            → localhost:8011            │
│ 13. Đánh giá sản phẩm                   → localhost:8008            │
│ 14. Thêm yêu thích                      → localhost:8010            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  ADMIN (Quản lý cửa hàng)                                            │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Đăng nhập admin                      → localhost:8001            │
│ 2. Thêm/sửa sản phẩm                    → localhost:8002            │
│ 3. Kiểm tra kho                         → localhost:8005            │
│ 4. Xác nhận đơn hàng (quan sát trạng thái)                          │
│ 5. Xác nhận thanh toán (quan sát trạng thái)                        │
│ 6. Tạo giao vận                         → localhost:8006            │
│ 7. Kiểm tra đánh giá                    → localhost:8008            │
│ 8. Tạo khuyến mãi                       → localhost:8007            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 👤 PHẦN 1: NGƯỜI MUA (CUSTOMER FLOW)

## ⏱️ Bước 1: Mở Trình Duyệt & Đăng Ký Tài Khoản

### 1.1 Đăng Ký (Sign Up)

**URL:** `http://localhost:8001/api/users/register`  
**Phương thức:** POST  
**Công cụ:** PowerShell / Postman / curl

```powershell
# Mở PowerShell và chạy lệnh này:
$register_response = curl -s -X POST "http://localhost:8001/api/users/register" `
  -H "Content-Type: application/json" `
  -d '{
    "email": "customer@example.com",
    "username": "customer_001",
    "password": "Customer@123",
    "full_name": "Nguyễn Văn A",
    "phone": "0987654321",
    "address": "123 Lê Lợi, Quận 1, TP.HCM"
  }'

# Xem kết quả
$register_response | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Kết quả mong muốn:**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "username": "customer_001",
  "full_name": "Nguyễn Văn A",
  "phone": "0987654321",
  "address": "123 Lê Lợi, Quận 1, TP.HCM",
  "is_active": true,
  "created_at": "2025-12-02T10:00:00Z",
  "updated_at": "2025-12-02T10:00:00Z"
}
```

✅ **Yêu cầu được tạo thành công!**  
**Nơi lưu:** MySQL database → table `users`

---

## ⏱️ Bước 2: Đăng Nhập & Lấy JWT Token

**URL:** `http://localhost:8001/api/users/login`  
**Phương thức:** POST

```powershell
# Đăng nhập
$login_response = curl -s -X POST "http://localhost:8001/api/users/login" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "customer_001",
    "password": "Customer@123"
  }'

# Lấy token
$login_data = $login_response | ConvertFrom-Json
$token = $login_data.access_token
$user_id = $login_data.user_id

# Lưu token để dùng trong các bước tiếp theo
Write-Host "✅ Đăng nhập thành công!"
Write-Host "Token: $token"
Write-Host "User ID: $user_id"
Write-Host "Token Type: $($login_data.token_type)"
```

**Kết quả:**
```
✅ Đăng nhập thành công!
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJjdXN0b21lckBleGFtcGxlLmNvbSIsImV4cCI6MTcyNDY5MDAwMH0.xxx
User ID: 1
Token Type: bearer
```

✅ **Token sẽ được sử dụng trong tất cả các request tiếp theo (header: Authorization: Bearer $token)**

---

## ⏱️ Bước 3: Xem Danh Sách Sản Phẩm

**URL:** `http://localhost:8002/api/products`  
**Phương thức:** GET  
**Không cần token**

```powershell
# Xem danh sách sản phẩm (10 sản phẩm đầu tiên)
$products_response = curl -s "http://localhost:8002/api/products?skip=0&limit=10"

$products_data = $products_response | ConvertFrom-Json
Write-Host "📦 Danh sách sản phẩm:"
Write-Host "Tổng sản phẩm: $($products_data.total)"
Write-Host ""

$products_data.products | ForEach-Object {
    Write-Host "ID: $($_.id)"
    Write-Host "Tên: $($_.name)"
    Write-Host "Giá: $($_.price) VND"
    Write-Host "Kho: $($_.inventory_count) cái"
    Write-Host "---"
}

# Lưu ID sản phẩm đầu tiên để dùng tiếp
$product_id = $products_data.products[0].id
Write-Host "✅ Product ID để mua: $product_id"
```

**Kết quả mong muốn:**
```
📦 Danh sách sản phẩm:
Tổng sản phẩm: 5

ID: 507f1f77bcf86cd799439011
Tên: iPhone 15 Pro
Giá: 29999000 VND
Kho: 50 cái
---

ID: 507f1f77bcf86cd799439012
Tên: Samsung Galaxy S24
Giá: 24999000 VND
Kho: 30 cái
---
```

---

## ⏱️ Bước 4: Xem Chi Tiết Sản Phẩm

**URL:** `http://localhost:8002/api/products/{product_id}`  
**Phương thức:** GET

```powershell
# Xem chi tiết sản phẩm (ví dụ: iPhone 15 Pro)
$product_id = "507f1f77bcf86cd799439011"
$product_detail = curl -s "http://localhost:8002/api/products/$product_id" | ConvertFrom-Json

Write-Host "📱 Chi tiết sản phẩm:"
Write-Host "Tên: $($product_detail.name)"
Write-Host "Giá: $($product_detail.price) VND"
Write-Host "Mô tả: $($product_detail.description)"
Write-Host "Danh mục: $($product_detail.category)"
Write-Host "Kho: $($product_detail.inventory_count) cái"
Write-Host "SKU: $($product_detail.sku)"
```

**Kết quả:**
```
📱 Chi tiết sản phẩm:
Tên: iPhone 15 Pro
Giá: 29999000 VND
Mô tả: Điện thoại thông minh cao cấp, chip A17 Pro
Danh mục: Điện Thoại
Kho: 50 cái
SKU: IP15P-001
```

---

## ⏱️ Bước 5: Tìm Kiếm Sản Phẩm (Search)

**URL:** `http://localhost:8009/api/search`  
**Phương thức:** GET  
**Tìm kiếm qua Search Service**

```powershell
# Tìm kiếm sản phẩm
$search_query = "iPhone"
$search_result = curl -s "http://localhost:8009/api/search?q=$search_query&sort_by=price&order=asc" | ConvertFrom-Json

Write-Host "🔍 Kết quả tìm kiếm: $search_query"
Write-Host "Tìm được: $($search_result.results.Count) sản phẩm"
Write-Host ""

$search_result.results | ForEach-Object {
    Write-Host "- $($_.name): $($_.price) VND (Rating: $($_.rating)⭐)"
}
```

---

## ⏱️ Bước 6: Tạo Đơn Hàng (Add to Cart & Create Order)

**URL:** `http://localhost:8003/api/orders`  
**Phương thức:** POST  
**Cần token**

```powershell
# Tạo đơn hàng (giỏ hàng)
$product_id = "507f1f77bcf86cd799439011"
$product_price = 29999000
$quantity = 2

$order_response = curl -s -X POST "http://localhost:8003/api/orders" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "user_id": $user_id,
  "items": [
    {
      "product_id": "$product_id",
      "quantity": $quantity,
      "price": $product_price
    }
  ],
  "total_amount": $($product_price * $quantity),
  "status": "pending"
}
"@

$order_data = $order_response | ConvertFrom-Json
$order_id = $order_data.id

Write-Host "✅ Đơn hàng được tạo!"
Write-Host "Order ID: $order_id"
Write-Host "Trạng thái: $($order_data.status)"
Write-Host "Tổng tiền: $($order_data.total_amount) VND (chưa tính thuế, khuyến mãi)"
```

**Kết quả:**
```
✅ Đơn hàng được tạo!
Order ID: 1
Trạng thái: pending
Tổng tiền: 59998000 VND (chưa tính thuế, khuyến mãi)
```

**Kafka Event được gửi:** `order-events` → `{"order_id": 1, "status": "created"}`

---

## ⏱️ Bước 7: Xem Danh Sách Khuyến Mãi & Áp Dụng Mã Giảm Giá

**URL:** `http://localhost:8007/api/promotions`  
**Phương thức:** GET

```powershell
# Xem danh sách khuyến mãi đang hoạt động
$promotions = curl -s "http://localhost:8007/api/promotions?status=active" | ConvertFrom-Json

Write-Host "🎉 Khuyến mãi đang hoạt động:"
$promotions.promotions | ForEach-Object {
    Write-Host "- $($_.name)"
    Write-Host "  Giảm: $($_.discount_value)% (Loại: $($_.discount_type))"
    Write-Host "  Còn: $($_.max_usage - $_.current_usage) lần sử dụng"
}
```

### Áp Dụng Mã Giảm Giá

**URL:** `http://localhost:8007/api/coupons/apply`  
**Phương thức:** POST

```powershell
# Áp dụng mã giảm giá (nếu có)
$coupon_code = "BLACKFRIDAY50"  # Ví dụ mã giảm 50%
$original_amount = 59998000

$coupon_response = curl -s -X POST "http://localhost:8007/api/coupons/apply" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "coupon_code": "$coupon_code",
  "order_id": $order_id,
  "original_amount": $original_amount
}
"@

$coupon_data = $coupon_response | ConvertFrom-Json

Write-Host "🎁 Áp dụng khuyến mãi:"
Write-Host "Mã: $($coupon_data.coupon_code)"
Write-Host "Giá gốc: $original_amount VND"
Write-Host "Giảm giá: $($coupon_data.discount_amount) VND"
Write-Host "Giá sau giảm: $($coupon_data.final_amount) VND"

$amount_after_coupon = $coupon_data.final_amount
```

**Kết quả:**
```
🎁 Áp dụng khuyến mãi:
Mã: BLACKFRIDAY50
Giá gốc: 59998000 VND
Giảm giá: 29999000 VND
Giá sau giảm: 29999000 VND
```

---

## ⏱️ Bước 8: Tính Toán Thuế

**URL:** `http://localhost:8012/api/calculate-tax`  
**Phương thức:** POST

```powershell
# Tính thuế (VAT 10%)
$tax_response = curl -s -X POST "http://localhost:8012/api/calculate-tax" `
  -H "Content-Type: application/json" `
  -d @"
{
  "order_id": $order_id,
  "amount": $amount_after_coupon,
  "location": "TP.HCM",
  "items": [
    {
      "product_id": "$product_id",
      "name": "iPhone 15 Pro",
      "quantity": 2,
      "price": 29999000
    }
  ]
}
"@

$tax_data = $tax_response | ConvertFrom-Json

Write-Host "💰 Tính toán tổng giá:"
Write-Host "Giá sau khuyến mãi: $($tax_data.subtotal) VND"
Write-Host "Thuế VAT (10%): $($tax_data.tax_amount) VND"
Write-Host "🔴 TỔNG CỘNG: $($tax_data.total_with_tax) VND"

$final_total = $tax_data.total_with_tax
```

**Kết quả:**
```
💰 Tính toán tổng giá:
Giá sau khuyến mãi: 29999000 VND
Thuế VAT (10%): 2999900 VND
🔴 TỔNG CỘNG: 32998900 VND
```

---

## ⏱️ Bước 9: THANH TOÁN

**URL:** `http://localhost:8004/api/payments`  
**Phương thức:** POST  
**Cần token**

```powershell
# Thanh toán
$payment_response = curl -s -X POST "http://localhost:8004/api/payments" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "order_id": $order_id,
  "amount": $final_total,
  "payment_method": "credit_card",
  "card_number": "4111111111111111",
  "card_holder": "NGUYEN VAN A",
  "expiry_month": 12,
  "expiry_year": 2026,
  "cvv": "123",
  "status": "pending"
}
"@

$payment_data = $payment_response | ConvertFrom-Json
$payment_id = $payment_data.id

Write-Host "💳 Thanh toán được xử lý:"
Write-Host "Payment ID: $payment_id"
Write-Host "Số tiền: $($payment_data.amount) VND"
Write-Host "Trạng thái: $($payment_data.status)"
Write-Host "Transaction ID: $($payment_data.transaction_id)"
Write-Host "✅ THANH TOÁN THÀNH CÔNG!"
```

**Kết quả:**
```
💳 Thanh toán được xử lý:
Payment ID: 1
Số tiền: 32998900 VND
Trạng thái: completed
Transaction ID: TXN-2025-12-02-001
✅ THANH TOÁN THÀNH CÔNG!
```

**Kafka Events được gửi:**
- `order-events` → `{"order_id": 1, "status": "processing"}`
- `payment-events` → `{"payment_id": 1, "order_id": 1, "status": "completed"}`

---

## ⏱️ Bước 10: Nhận Thông Báo Thanh Toán

**URL:** `http://localhost:8011/api/notifications`  
**Phương thức:** GET  
**Cần token**

```powershell
# Kiểm tra thông báo
$notifications = curl -s "http://localhost:8011/api/notifications?user_id=$user_id&skip=0&limit=10" `
  -H "Authorization: Bearer $token" | ConvertFrom-Json

Write-Host "📬 Thông báo của bạn:"
Write-Host "Tổng thông báo chưa đọc: $($notifications.unread_count)"
Write-Host ""

$notifications.notifications | ForEach-Object {
    $status = if ($_.read) { "✓" } else { "🆕" }
    Write-Host "$status [$($_.type)] $($_.title)"
    Write-Host "   $($_.message)"
    Write-Host "   Lúc: $($_.created_at)"
}
```

**Kết quả (Thông báo tự động được tạo):**
```
📬 Thông báo của bạn:
Tổng thông báo chưa đọc: 3

🆕 [order_created] Đơn hàng #1 đã được tạo
   Chúng tôi đã nhận đơn hàng của bạn
   Lúc: 2025-12-02T10:05:00Z

🆕 [payment_completed] Thanh toán thành công
   Thanh toán 32,998,900 VND đã xác nhận
   Lúc: 2025-12-02T10:06:00Z

🆕 [shipping_update] Giao hàng sắp tới
   Đơn hàng của bạn sắp được giao
   Lúc: 2025-12-02T10:07:00Z
```

---

## ⏱️ Bước 11: Tracking Giao Hàng (Shipping)

**URL:** `http://localhost:8006/api/shipments`  
**Phương thức:** GET

```powershell
# Kiểm tra giao vận
$shipments = curl -s "http://localhost:8006/api/shipments?order_id=$order_id" | ConvertFrom-Json

if ($shipments.shipments.Count -gt 0) {
    $shipment = $shipments.shipments[0]
    
    Write-Host "📦 Tracking Giao Hàng:"
    Write-Host "Tracking Number: $($shipment.tracking_number)"
    Write-Host "Carrier: $($shipment.carrier)"
    Write-Host "Trạng thái: $($shipment.status)"
    Write-Host "Địa chỉ giao: $($shipment.address)"
    Write-Host "Dự kiến giao: $($shipment.estimated_delivery)"
}
```

**Kết quả:**
```
📦 Tracking Giao Hàng:
Tracking Number: VN123456789
Carrier: GHN
Trạng thái: pending
Địa chỉ giao: 123 Lê Lợi, Quận 1, TP.HCM
Dự kiến giao: 2025-12-05
```

### Xem Chi Tiết Tracking

```powershell
# Tracking chi tiết
$tracking_number = "VN123456789"
$tracking = curl -s "http://localhost:8006/api/shipments/track/$tracking_number" | ConvertFrom-Json

Write-Host "📍 Lịch sử giao hàng:"
$tracking.updates | ForEach-Object {
    Write-Host "[$($_.status)] - $($_.timestamp)"
}
```

**Kết quả:**
```
📍 Lịch sử giao hàng:
[pending] - 2025-12-02T10:08:00Z
[picked_up] - 2025-12-02T11:00:00Z
[in_transit] - 2025-12-02T14:00:00Z
[out_for_delivery] - 2025-12-02T18:00:00Z
[delivered] - 2025-12-03T09:00:00Z
```

---

## ⏱️ Bước 12: Thêm Sản Phẩm Yêu Thích

**URL:** `http://localhost:8010/api/favourites`  
**Phương thức:** POST  
**Cần token**

```powershell
# Thêm vào yêu thích
$favourite_response = curl -s -X POST "http://localhost:8010/api/favourites" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "user_id": $user_id,
  "product_id": "$product_id"
}
"@

$favourite_data = $favourite_response | ConvertFrom-Json
Write-Host "❤️ Thêm vào yêu thích thành công!"
Write-Host "Favourite ID: $($favourite_data.id)"

# Xem danh sách yêu thích
$favourites = curl -s "http://localhost:8010/api/favourites?user_id=$user_id" `
  -H "Authorization: Bearer $token" | ConvertFrom-Json

Write-Host ""
Write-Host "📋 Danh sách yêu thích của bạn:"
$favourites.favourites | ForEach-Object {
    Write-Host "- $($_.product.name): $($_.product.price) VND"
}
```

**Kết quả:**
```
❤️ Thêm vào yêu thích thành công!
Favourite ID: 1

📋 Danh sách yêu thích của bạn:
- iPhone 15 Pro: 29999000 VND
```

---

## ⏱️ Bước 13: Đánh Giá Sản Phẩm

**URL:** `http://localhost:8008/api/ratings`  
**Phương thức:** POST  
**Cần token**

```powershell
# Đánh giá sản phẩm (chỉ sau khi đã nhận hàng)
$rating_response = curl -s -X POST "http://localhost:8008/api/ratings" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "product_id": "$product_id",
  "user_id": $user_id,
  "rating": 5,
  "title": "Sản phẩm tuyệt vời!",
  "comment": "iPhone 15 Pro rất tốt. Chất lượng camera cực kỳ xuất sắc, hiệu năng mạnh mẽ. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!",
  "verified_purchase": true
}
"@

$rating_data = $rating_response | ConvertFrom-Json

Write-Host "⭐ Đánh giá sản phẩm:"
Write-Host "Rating ID: $($rating_data.id)"
Write-Host "Sao: $($rating_data.rating)/5"
Write-Host "Nhận xét: $($rating_data.comment)"
Write-Host "✅ Cảm ơn bạn đã đánh giá!"
```

**Kết quả:**
```
⭐ Đánh giá sản phẩm:
Rating ID: 1
Sao: 5/5
Nhận xét: iPhone 15 Pro rất tốt. Chất lượng camera cực kỳ xuất sắc...
✅ Cảm ơn bạn đã đánh giá!
```

### Xem Đánh Giá Của Sản Phẩm

```powershell
# Xem tất cả đánh giá
$product_ratings = curl -s "http://localhost:8008/api/ratings/product/$product_id" | ConvertFrom-Json

Write-Host "📊 Đánh giá sản phẩm:"
Write-Host "Điểm trung bình: $($product_ratings.average_rating)/5"
Write-Host "Tổng đánh giá: $($product_ratings.total_ratings)"
Write-Host ""
Write-Host "Các nhận xét:"
$product_ratings.ratings | ForEach-Object {
    Write-Host "- [$($_.rating)⭐] $($_.title)"
    Write-Host "  Người đánh giá: $($_.user.username)"
    Write-Host "  $($_.comment)"
}
```

---

# 👨‍💼 PHẦN 2: ADMIN FLOW (Quản Lý Cửa Hàng)

## ⏱️ Admin Bước 1: Đăng Nhập Admin

```powershell
# Đăng nhập với tài khoản admin
$admin_login = curl -s -X POST "http://localhost:8001/api/users/login" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "admin_user",
    "password": "AdminPass@123"
  }'

$admin_data = $admin_login | ConvertFrom-Json
$admin_token = $admin_data.access_token

Write-Host "👨‍💼 Admin đăng nhập thành công!"
Write-Host "Admin Token: $admin_token"
```

---

## ⏱️ Admin Bước 2: Thêm/Sửa Sản Phẩm

**URL:** `http://localhost:8002/api/products`  
**Phương thức:** POST (thêm) / PUT (sửa)

```powershell
# Thêm sản phẩm mới (Admin)
$new_product = curl -s -X POST "http://localhost:8002/api/products" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{
    "name": "MacBook Pro M3",
    "description": "Laptop cao cấp cho lập trình viên",
    "price": 45000000,
    "inventory_count": 20,
    "category": "Laptop",
    "sku": "MBP-M3-001"
  }'

$new_product_data = $new_product | ConvertFrom-Json
Write-Host "✅ Sản phẩm được thêm:"
Write-Host "ID: $($new_product_data.id)"
Write-Host "Tên: $($new_product_data.name)"
```

### Cập Nhật Sản Phẩm

```powershell
# Sửa giá sản phẩm
$update_product = curl -s -X PUT "http://localhost:8002/api/products/$product_id" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{
    "price": 27999000,
    "inventory_count": 45
  }'

Write-Host "✅ Sản phẩm được cập nhật"
```

---

## ⏱️ Admin Bước 3: Kiểm Tra Kho Hàng

**URL:** `http://localhost:8005/api/inventory`  
**Phương thức:** GET

```powershell
# Kiểm tra kho
$inventory = curl -s "http://localhost:8005/api/inventory/$product_id" | ConvertFrom-Json

Write-Host "📦 Kiểm tra kho:"
Write-Host "Sản phẩm: iPhone 15 Pro"
Write-Host "Tồn kho: $($inventory.quantity_in_stock) cái"
Write-Host "Đã đặt: $($inventory.quantity_reserved) cái"
Write-Host "Còn bán: $($inventory.quantity_available) cái"
Write-Host "Mức tái nhập: $($inventory.reorder_level) cái"

# Xem sản phẩm sắp hết
$low_stock = curl -s "http://localhost:8005/api/inventory/low-stock" | ConvertFrom-Json

Write-Host ""
Write-Host "⚠️ Sản phẩm sắp hết:"
$low_stock.low_stock_items | ForEach-Object {
    Write-Host "- $($_.product_name): $($_.quantity_in_stock) cái (mức: $($_.reorder_level))"
}
```

---

## ⏱️ Admin Bước 4: Xác Nhận Đơn Hàng (Quan Sát Trạng Thái)

**URL:** `http://localhost:8003/api/orders`  
**Phương thức:** GET / PUT

```powershell
# Xem danh sách đơn hàng
$orders = curl -s "http://localhost:8003/api/orders?skip=0&limit=20" | ConvertFrom-Json

Write-Host "📋 Danh sách đơn hàng:"
$orders.orders | ForEach-Object {
    Write-Host "Order #$($_.id) - User: $($_.user_id)"
    Write-Host "  Tổng tiền: $($_.total_amount) VND"
    Write-Host "  Trạng thái: $($_.status)"
    Write-Host "  Ngày tạo: $($_.created_at)"
}

# Cập nhật trạng thái đơn hàng
$update_order_status = curl -s -X PUT "http://localhost:8003/api/orders/$order_id/status" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{
    "status": "processing"
  }'

Write-Host ""
Write-Host "✅ Trạng thái đơn hàng được cập nhật thành: processing"
```

**Trạng thái có thể:** pending → processing → shipped → delivered → cancelled

---

## ⏱️ Admin Bước 5: Xác Nhận Thanh Toán (Quan Sát)

```powershell
# Xem danh sách thanh toán
$payments = curl -s "http://localhost:8004/api/payments?skip=0&limit=20" | ConvertFrom-Json

Write-Host "💳 Danh sách thanh toán:"
$payments.payments | ForEach-Object {
    Write-Host "Payment #$($_.id) - Order #$($_.order_id)"
    Write-Host "  Số tiền: $($_.amount) VND"
    Write-Host "  Trạng thái: $($_.status)"
    Write-Host "  Transaction ID: $($_.transaction_id)"
}

# Admin có thể kiểm tra và xác nhận (hệ thống tự động confirm nếu không lỗi)
Write-Host ""
Write-Host "✅ Tất cả thanh toán đã được xác nhận!"
```

---

## ⏱️ Admin Bước 6: Tạo Giao Vận

**URL:** `http://localhost:8006/api/shipments`  
**Phương thức:** POST

```powershell
# Tạo giao vận cho đơn hàng
$create_shipment = curl -s -X POST "http://localhost:8006/api/shipments" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d @"
{
  "order_id": $order_id,
  "address": "123 Lê Lợi, Quận 1, TP.HCM",
  "phone": "0987654321",
  "carrier": "GHN",
  "status": "pending"
}
"@

$shipment_data = $create_shipment | ConvertFrom-Json

Write-Host "✅ Giao vận được tạo:"
Write-Host "Shipment ID: $($shipment_data.id)"
Write-Host "Tracking Number: $($shipment_data.tracking_number)"
Write-Host "Carrier: $($shipment_data.carrier)"
Write-Host "Dự kiến giao: $($shipment_data.estimated_delivery)"
```

### Cập Nhật Trạng Thái Giao Vận

```powershell
# Cập nhật trạng thái giao vận (when picking up from warehouse)
curl -s -X PUT "http://localhost:8006/api/shipments/$($shipment_data.id)/status" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{"status": "picked_up"}'

# Sau đó: in_transit
curl -s -X PUT "http://localhost:8006/api/shipments/$($shipment_data.id)/status" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{"status": "in_transit"}'

# Cuối cùng: delivered
curl -s -X PUT "http://localhost:8006/api/shipments/$($shipment_data.id)/status" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{"status": "delivered"}'

Write-Host "✅ Giao vận đã hoàn thành!"
```

---

## ⏱️ Admin Bước 7: Tạo Khuyến Mãi

**URL:** `http://localhost:8007/api/promotions`  
**Phương thức:** POST

```powershell
# Tạo khuyến mãi
$create_promotion = curl -s -X POST "http://localhost:8007/api/promotions" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{
    "name": "Holiday 50% OFF",
    "description": "Giảm giá 50% cho các sản phẩm điện thoại",
    "discount_type": "percentage",
    "discount_value": 50,
    "product_id": "'$product_id'",
    "valid_from": "2025-12-01",
    "valid_until": "2025-12-31",
    "max_usage": 1000
  }'

$promo_data = $create_promotion | ConvertFrom-Json
Write-Host "✅ Khuyến mãi được tạo:"
Write-Host "ID: $($promo_data.id)"
Write-Host "Tên: $($promo_data.name)"
Write-Host "Giảm: $($promo_data.discount_value)%"
```

### Tạo Mã Giảm Giá (Coupon)

```powershell
# Tạo mã giảm giá
$create_coupon = curl -s -X POST "http://localhost:8007/api/coupons" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $admin_token" `
  -d '{
    "code": "NEWYEAR2025",
    "discount_percentage": 30,
    "max_usage": 500,
    "valid_from": "2025-01-01",
    "valid_until": "2025-01-31"
  }'

Write-Host "✅ Mã giảm giá được tạo:"
Write-Host "Mã: NEWYEAR2025"
Write-Host "Giảm: 30%"
```

---

## ⏱️ Admin Bước 8: Kiểm Tra Đánh Giá

```powershell
# Xem danh sách đánh giá
$ratings = curl -s "http://localhost:8008/api/ratings/product/$product_id" | ConvertFrom-Json

Write-Host "⭐ Đánh giá sản phẩm:"
Write-Host "Điểm trung bình: $($ratings.average_rating)/5"
Write-Host "Tổng đánh giá: $($ratings.total_ratings)"
Write-Host ""

$ratings.ratings | ForEach-Object {
    Write-Host "⭐$($_.rating) - $($_.title)"
    Write-Host "  Từ: $($_.user.username)"
    Write-Host "  Nhận xét: $($_.comment)"
    Write-Host "---"
}
```

---

# 🔗 BẢNG TÓMBỘ LOCALHOST

| Chức Năng | Localhost | Phương Thức | Cần Token |
|-----------|-----------|------------|-----------|
| **Đăng ký** | `8001/api/users/register` | POST | ❌ |
| **Đăng nhập** | `8001/api/users/login` | POST | ❌ |
| **Danh sách sản phẩm** | `8002/api/products` | GET | ❌ |
| **Chi tiết sản phẩm** | `8002/api/products/{id}` | GET | ❌ |
| **Tìm kiếm sản phẩm** | `8009/api/search` | GET | ❌ |
| **Tạo đơn hàng** | `8003/api/orders` | POST | ✅ |
| **Danh sách đơn hàng** | `8003/api/orders` | GET | ✅ |
| **Xem khuyến mãi** | `8007/api/promotions` | GET | ❌ |
| **Áp dụng coupon** | `8007/api/coupons/apply` | POST | ✅ |
| **Tính thuế** | `8012/api/calculate-tax` | POST | ❌ |
| **Thanh toán** | `8004/api/payments` | POST | ✅ |
| **Thông báo** | `8011/api/notifications` | GET | ✅ |
| **Tracking giao hàng** | `8006/api/shipments/track/{number}` | GET | ❌ |
| **Yêu thích** | `8010/api/favourites` | POST/GET | ✅ |
| **Đánh giá** | `8008/api/ratings` | POST/GET | ✅ |
| **Danh sách đánh giá** | `8008/api/ratings/product/{id}` | GET | ❌ |

---

# 📊 BẢNG TRẠNG THÁI & KAFKA EVENTS

## Trạng Thái Đơn Hàng
```
pending → processing → shipped → delivered
              ↓
          cancelled (nếu hủy)
```

## Trạng Thái Thanh Toán
```
pending → completed
      ↓
     refunded (nếu hoàn tiền)
```

## Trạng Thái Giao Hàng
```
pending → picked_up → in_transit → out_for_delivery → delivered
                  ↓
              returned (nếu trả lại)
```

## Kafka Events

| Sự kiện | Topic | Payload |
|---------|-------|---------|
| Tạo đơn hàng | `order-events` | `{"order_id": 1, "status": "created"}` |
| Cập nhật đơn hàng | `order-events` | `{"order_id": 1, "status": "processing"}` |
| Thanh toán hoàn thành | `payment-events` | `{"payment_id": 1, "order_id": 1, "status": "completed"}` |
| Giao hàng bắt đầu | `shipping-events` | `{"shipment_id": 1, "status": "picked_up"}` |
| Giao hàng hoàn thành | `shipping-events` | `{"shipment_id": 1, "status": "delivered"}` |

---

# 🎬 SCRIPT DEMO HOÀN CHỈNH (Copy & Paste)

Tạo file `demo_complete.ps1`:

```powershell
# ============================================
# COMPLETE ECOMMERCE DEMO SCRIPT
# ============================================

Write-Host "🚀 START DEMO: Complete Ecommerce Flow" -ForegroundColor Green
Write-Host ""

# BƯỚC 1: ĐĂNG KÝ
Write-Host "STEP 1️⃣: Đăng ký tài khoản"
$register = curl -s -X POST "http://localhost:8001/api/users/register" `
  -H "Content-Type: application/json" `
  -d '{
    "email":"demo@test.com",
    "username":"demo_user",
    "password":"Demo@123",
    "full_name":"Nguyễn Văn Demo",
    "phone":"0987654321",
    "address":"123 Lê Lợi, TP.HCM"
  }'
$reg_data = $register | ConvertFrom-Json
Write-Host "✅ Đăng ký thành công! User ID: $($reg_data.id)"
Write-Host ""

# BƯỚC 2: ĐĂNG NHẬP
Write-Host "STEP 2️⃣: Đăng nhập"
$login = curl -s -X POST "http://localhost:8001/api/users/login" `
  -H "Content-Type: application/json" `
  -d '{"username":"demo_user","password":"Demo@123"}'
$log_data = $login | ConvertFrom-Json
$token = $log_data.access_token
$user_id = $log_data.user_id
Write-Host "✅ Đăng nhập thành công!"
Write-Host ""

# BƯỚC 3: XEM DANH SÁCH SẢN PHẨM
Write-Host "STEP 3️⃣: Xem danh sách sản phẩm"
$products = curl -s "http://localhost:8002/api/products?skip=0&limit=5" | ConvertFrom-Json
Write-Host "✅ Tìm được $($products.total) sản phẩm"
$product_id = $products.products[0].id
$product_price = $products.products[0].price
Write-Host "   - Chọn: $($products.products[0].name) - $product_price VND"
Write-Host ""

# BƯỚC 4: TẠO ĐƠN HÀNG
Write-Host "STEP 4️⃣: Tạo đơn hàng"
$order = curl -s -X POST "http://localhost:8003/api/orders" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "user_id": $user_id,
  "items": [{"product_id":"$product_id","quantity":1,"price":$product_price}],
  "total_amount": $product_price,
  "status": "pending"
}
"@
$ord_data = $order | ConvertFrom-Json
$order_id = $ord_data.id
Write-Host "✅ Đơn hàng được tạo! Order ID: $order_id"
Write-Host ""

# BƯỚC 5: TÍNH THUẾ
Write-Host "STEP 5️⃣: Tính thuế"
$tax = curl -s -X POST "http://localhost:8012/api/calculate-tax" `
  -H "Content-Type: application/json" `
  -d @"
{"order_id":$order_id,"amount":$product_price,"location":"TP.HCM","items":[{"product_id":"$product_id","quantity":1,"price":$product_price}]}
"@
$tax_data = $tax | ConvertFrom-Json
Write-Host "✅ Thuế tính toán: $($tax_data.tax_amount) VND"
Write-Host "   Tổng cộng: $($tax_data.total_with_tax) VND"
Write-Host ""

# BƯỚC 6: THANH TOÁN
Write-Host "STEP 6️⃣: Thanh toán"
$payment = curl -s -X POST "http://localhost:8004/api/payments" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "order_id": $order_id,
  "amount": $($tax_data.total_with_tax),
  "payment_method": "credit_card",
  "card_number": "4111111111111111",
  "status": "pending"
}
"@
$pay_data = $payment | ConvertFrom-Json
Write-Host "✅ Thanh toán hoàn thành! Payment ID: $($pay_data.id)"
Write-Host ""

# BƯỚC 7: THÔNG BÁO
Write-Host "STEP 7️⃣: Kiểm tra thông báo"
$notifs = curl -s "http://localhost:8011/api/notifications?user_id=$user_id" `
  -H "Authorization: Bearer $token" | ConvertFrom-Json
Write-Host "✅ Có $($notifs.unread_count) thông báo mới"
Write-Host ""

# BƯỚC 8: TRACKING GIAO HÀNG
Write-Host "STEP 8️⃣: Tracking giao hàng"
$shipments = curl -s "http://localhost:8006/api/shipments?order_id=$order_id" | ConvertFrom-Json
if ($shipments.shipments.Count -gt 0) {
    Write-Host "✅ Tracking: $($shipments.shipments[0].tracking_number)"
}
Write-Host ""

# BƯỚC 9: ĐÁNH GIÁ
Write-Host "STEP 9️⃣: Đánh giá sản phẩm"
$rating = curl -s -X POST "http://localhost:8008/api/ratings" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d @"
{
  "product_id": "$product_id",
  "user_id": $user_id,
  "rating": 5,
  "title": "Tuyệt vời!",
  "comment": "Sản phẩm chất lượng tốt, giao hàng nhanh"
}
"@
Write-Host "✅ Đánh giá hoàn thành!"
Write-Host ""

Write-Host "🎉 DEMO HOÀN TẤT!" -ForegroundColor Green
```

---

**✅ Quy trình hoàn chỉnh từ đăng ký đến đánh giá!**

Sử dụng tài liệu này để demo cho thầy cô bạn! 📚

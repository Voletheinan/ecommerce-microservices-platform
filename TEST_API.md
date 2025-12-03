# 🧪 Test API - Hướng dẫn Chi Tiết

## ✅ **Bước 1: Đăng ký User (POST)**

**URL:** `http://localhost:8001/api/users/register`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "full_name": "Test User",
  "phone": "0123456789",
  "address": "123 Main St"
}
```

**Response nếu thành công (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "testuser",
  "full_name": "Test User",
  "phone": "0123456789",
  "address": "123 Main St",
  "is_active": true,
  "created_at": "2025-12-03T01:40:00",
  "updated_at": "2025-12-03T01:40:00"
}
```

---

## ✅ **Bước 2: Đăng nhập (POST)**

**URL:** `http://localhost:8001/api/users/login`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response nếu thành công (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "email": "user@example.com"
}
```

**⚠️ Copy giá trị `access_token` để dùng cho các request tiếp theo**

---

## ✅ **Bước 3: Tạo sản phẩm (POST)**

**URL:** `http://localhost:8002/api/products/`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
(Thay `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` bằng token từ bước 2)

**Body (JSON):**
```json
{
  "name": "Laptop Dell XPS",
  "description": "High-performance gaming laptop",
  "price": 1500,
  "category": "Electronics",
  "stock": 50,
  "sku": "LAPTOP-DELL-001"
}
```

**Response nếu thành công (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop Dell XPS",
  "description": "High-performance gaming laptop",
  "price": 1500,
  "category": "Electronics",
  "stock": 50,
  "sku": "LAPTOP-DELL-001"
}
```

---

## ✅ **Bước 4: Lấy danh sách sản phẩm (GET)**

**URL:** `http://localhost:8002/api/products/?skip=0&limit=10`

**Method:** `GET`

**Headers:**
```
Content-Type: application/json
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop Dell XPS",
    "price": 1500,
    ...
  }
]
```

---

## ✅ **Bước 5: Tạo đơn hàng (POST)**

**URL:** `http://localhost:8003/api/orders/`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body (JSON):**
```json
{
  "user_id": 1,
  "items": [
    {
      "product_id": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 1500
    }
  ],
  "shipping_address": "123 Main St, City, Country"
}
```

**Response nếu thành công (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "items": [...],
  "total_amount": 3000,
  "status": "pending",
  "shipping_address": "123 Main St, City, Country"
}
```

---

## 📋 **Checklist - Điểm cần lưu ý**

- [ ] **Email phải hợp lệ** (có dấu @)
- [ ] **Username ít nhất 3 ký tự**
- [ ] **Password ít nhất 6 ký tự**
- [ ] **Method phải đúng: POST hoặc GET**
- [ ] **Headers phải có `Content-Type: application/json`**
- [ ] **Token phải có `Bearer` ở trước**
- [ ] **Tất cả field bắt buộc phải điền**

---

## ❌ **Lỗi thường gặp**

| Lỗi | Nguyên nhân | Cách fix |
|-----|-----------|---------|
| **400** | JSON format sai hoặc field thiếu | Kiểm tra JSON syntax, đảm bảo tất cả field bắt buộc |
| **422** | Dùng GET thay vì POST | Thay đổi method thành POST |
| **401** | Token sai hoặc hết hạn | Đăng nhập lại để lấy token mới |
| **409** | Email/username đã tồn tại | Dùng email/username khác |

---

## 🚀 **Các URL Services**

| Service | Port | Base URL |
|---------|------|----------|
| User | 8001 | http://localhost:8001 |
| Product | 8002 | http://localhost:8002 |
| Order | 8003 | http://localhost:8003 |
| Payment | 8004 | http://localhost:8004 |
| Inventory | 8005 | http://localhost:8005 |

---

**Tất cả test xong chưa?** Hãy cho tôi biết kết quả! 😊

# Thông Tin Database - E-Commerce Microservices Platform

## 📊 Tổng Quan Database

Hệ thống sử dụng **kiến trúc đa database** (Polyglot Persistence) với các loại database khác nhau cho từng service:

### 1. **MySQL** (Port 3307)
- **Lưu trữ:** Users, Orders, Payments, Inventory, Shipping, Promotions, Ratings, Favourites, Notifications, Tax
- **Services sử dụng:**
  - User Service (port 8001)
  - Order Service (port 8003)
  - Payment Service (port 8004)
  - Inventory Service (port 8005)
  - Shipping Service (port 8006)
  - Promotion Service (port 8007)
  - Rating Service (port 8008)
  - Favourite Service (port 8010)
  - Notification Service (port 8011)
  - Tax Service (port 8012)

**Kết nối:**
- Host: `mysql` (trong Docker) hoặc `localhost:3307` (từ máy local)
- Database: `ecommerce`
- Username: `root`
- Password: `root123`

**Dữ liệu lưu ở đâu:**
- Dữ liệu được lưu trong Docker volume: `mysql_data`
- Để xem dữ liệu: `docker exec -it mysql-db mysql -u root -proot123 -D ecommerce`

### 2. **MongoDB** (Port 27017)
- **Lưu trữ:** Products, Search indexes
- **Services sử dụng:**
  - Product Service (port 8002)
  - Search Service (port 8009)

**Kết nối:**
- Host: `mongodb` (trong Docker) hoặc `localhost:27017` (từ máy local)
- Database: `ecommerce`
- Username: `root`
- Password: `root123`
- Auth Database: `admin`

**Dữ liệu lưu ở đâu:**
- Dữ liệu được lưu trong Docker volume: `mongodb_data`
- Để xem dữ liệu: `docker exec -it mongodb mongosh -u root -p root123 --authenticationDatabase admin ecommerce`

### 3. **Redis** (Port 6379)
- **Lưu trữ:** Cache, Service Registry, Session data
- **Services sử dụng:**
  - Discovery Service (port 8000)
  - Tất cả services (cho caching)

**Kết nối:**
- Host: `redis` (trong Docker) hoặc `localhost:6379` (từ máy local)
- Không cần authentication (development)

**Dữ liệu lưu ở đâu:**
- Dữ liệu được lưu trong Docker volume: `redis_data`
- Để xem dữ liệu: `docker exec -it redis redis-cli`

### 4. **Kafka + Zookeeper**
- **Lưu trữ:** Message queue cho event-driven communication
- **Port:** Kafka (9092), Zookeeper (2181)

---

## 🔍 Kiểm Tra Dữ Liệu

### Kiểm tra Users trong MySQL:
```bash
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce -e "SELECT id, email, username, full_name, role FROM users;"
```

### Kiểm tra Products trong MongoDB:
```bash
docker exec -it mongodb mongosh -u root -p root123 --authenticationDatabase admin ecommerce --eval "db.products.find().pretty()"
```

### Đếm số lượng:
```bash
# Users
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce -e "SELECT COUNT(*) as total_users FROM users;"

# Products
docker exec -it mongodb mongosh -u root -p root123 --authenticationDatabase admin ecommerce --eval "db.products.countDocuments({})"
```

---

## 👤 Tài Khoản Test Đã Tạo

**Thông tin đăng nhập:**
- **Email:** `testing@gmail.com`
- **Username:** `testuser`
- **Password:** `123123`
- **Full Name:** `Test User`
- **Role:** `client`

**Tài khoản Admin (nếu đã tạo):**
- **Email:** `admin@example.com`
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `admin`

---

## 📦 Sản Phẩm Mẫu Đã Seed

Đã thêm **10 sản phẩm mẫu** vào MongoDB:

1. iPhone 15 Pro Max - 29,990,000 VNĐ
2. Samsung Galaxy S24 Ultra - 27,990,000 VNĐ
3. MacBook Pro 14 inch M3 - 49,990,000 VNĐ
4. Dell XPS 15 - 45,990,000 VNĐ
5. AirPods Pro 2 - 5,990,000 VNĐ
6. Sony WH-1000XM5 - 8,990,000 VNĐ
7. iPad Pro 12.9 inch M2 - 32,990,000 VNĐ
8. Samsung Galaxy Tab S9 Ultra - 24,990,000 VNĐ
9. Apple Watch Series 9 - 12,990,000 VNĐ
10. Samsung Galaxy Watch 6 Classic - 9,990,000 VNĐ

**Categories:**
- Điện thoại (2 sản phẩm)
- Laptop (2 sản phẩm)
- Tai nghe (2 sản phẩm)
- Máy tính bảng (2 sản phẩm)
- Đồng hồ thông minh (2 sản phẩm)

---

## 🛠️ Các Lệnh Hữu Ích

### Xem tất cả tables trong MySQL:
```bash
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce -e "SHOW TABLES;"
```

### Xem tất cả collections trong MongoDB:
```bash
docker exec -it mongodb mongosh -u root -p root123 --authenticationDatabase admin ecommerce --eval "show collections"
```

### Xem logs của service:
```bash
docker-compose logs -f user-service
docker-compose logs -f product-service
```

### Restart một service:
```bash
docker-compose restart user-service
docker-compose restart product-service
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Dữ liệu được lưu trong Docker volumes**, nên khi chạy `docker-compose down -v` sẽ xóa tất cả dữ liệu
2. **Lần đầu chạy:** Database sẽ tự động tạo tables/collections khi services khởi động
3. **Nếu không thấy sản phẩm:** Kiểm tra xem product-service đã kết nối MongoDB chưa
4. **Nếu không login được:** Kiểm tra user-service và MySQL connection

---

## 🔄 Backup & Restore

### Backup MySQL:
```bash
docker exec mysql-db mysqldump -u root -proot123 ecommerce > backup.sql
```

### Restore MySQL:
```bash
docker exec -i mysql-db mysql -u root -proot123 ecommerce < backup.sql
```

### Backup MongoDB:
```bash
docker exec mongodb mongodump -u root -p root123 --authenticationDatabase admin --db ecommerce --out /tmp/backup
docker cp mongodb:/tmp/backup ./mongodb_backup
```

### Restore MongoDB:
```bash
docker cp ./mongodb_backup mongodb:/tmp/backup
docker exec mongodb mongorestore -u root -p root123 --authenticationDatabase admin --db ecommerce /tmp/backup/ecommerce
```


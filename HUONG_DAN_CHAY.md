# Hướng Dẫn Chạy E-Commerce Microservices Platform

## 📋 Yêu Cầu Hệ Thống

### 1. Cài Đặt Docker Desktop

**Bước 1:** Tải Docker Desktop
- Truy cập: https://www.docker.com/products/docker-desktop
- Tải phiên bản cho Windows
- Cài đặt và khởi động lại máy tính (nếu cần)

**Bước 2:** Khởi động Docker Desktop
- Mở Docker Desktop từ Start Menu
- Đợi cho đến khi Docker Desktop hiển thị "Docker Desktop is running" (biểu tượng cá voi xanh ở system tray)
- Có thể mất 1-2 phút để Docker khởi động hoàn toàn

**Bước 3:** Kiểm tra cài đặt
Mở PowerShell và chạy:
```powershell
docker --version
docker-compose --version
```

Nếu thấy version numbers, bạn đã cài đặt thành công!

---

## 🚀 Cách Chạy Dự Án

### Phương Pháp 1: Sử Dụng Script Tự Động (Khuyên Dùng)

1. **Mở PowerShell** (Run as Administrator nếu cần)
2. **Chuyển đến thư mục dự án:**
   ```powershell
   cd "c:\Users\minht\OneDrive\Documents\Trường học\Lập trình phân tán\GKI_LTPT\ecomerce-microservices-platform"
   ```

3. **Chạy script khởi động:**
   ```powershell
   .\start-services.ps1
   ```

Script sẽ tự động:
- ✓ Kiểm tra Docker đã cài đặt chưa
- ✓ Kiểm tra Docker đang chạy chưa
- ✓ Build và khởi động tất cả services
- ✓ Kiểm tra trạng thái services
- ✓ Test các endpoints

### Phương Pháp 2: Chạy Thủ Công

1. **Mở PowerShell** và chuyển đến thư mục dự án:
   ```powershell
   cd "c:\Users\minht\OneDrive\Documents\Trường học\Lập trình phân tán\GKI_LTPT\ecomerce-microservices-platform"
   ```

2. **Khởi động tất cả services:**
   ```powershell
   docker-compose up -d --build
   ```
   
   Lệnh này sẽ:
   - Build các Docker images (lần đầu có thể mất 5-10 phút)
   - Khởi động tất cả containers
   - Chạy ở chế độ background (-d)

3. **Kiểm tra trạng thái:**
   ```powershell
   docker-compose ps
   ```
   
   Bạn sẽ thấy danh sách tất cả services và trạng thái của chúng.

4. **Xem logs (nếu cần):**
   ```powershell
   # Xem logs của tất cả services
   docker-compose logs -f
   
   # Xem logs của một service cụ thể
   docker-compose logs -f user-service
   ```

---

## ✅ Kiểm Tra Services Đã Chạy

### 1. Kiểm Tra Containers

```powershell
docker-compose ps
```

Tất cả services nên có status là "Up" hoặc "Up (healthy)".

### 2. Test API Endpoints

**Test API Gateway:**
```powershell
curl http://localhost/health
# Hoặc trong trình duyệt: http://localhost/health
```

**Test User Service:**
```powershell
curl http://localhost:8001/health
# Hoặc trong trình duyệt: http://localhost:8001/health
```

**Test Product Service:**
```powershell
curl http://localhost:8002/health
# Hoặc trong trình duyệt: http://localhost:8002/health
```

**Lưu ý:** Nếu dùng PowerShell, có thể cần dùng `Invoke-WebRequest` thay vì `curl`:
```powershell
Invoke-WebRequest -Uri http://localhost/health
Invoke-WebRequest -Uri http://localhost:8001/health
Invoke-WebRequest -Uri http://localhost:8002/health
```

### 3. Danh Sách Tất Cả Services và Ports

| Service | Port | URL |
|---------|------|-----|
| API Gateway (Nginx) | 80 | http://localhost |
| Discovery Service | 8000 | http://localhost:8000 |
| User Service | 8001 | http://localhost:8001 |
| Product Service | 8002 | http://localhost:8002 |
| Order Service | 8003 | http://localhost:8003 |
| Payment Service | 8004 | http://localhost:8004 |
| Inventory Service | 8005 | http://localhost:8005 |
| Shipping Service | 8006 | http://localhost:8006 |
| Promotion Service | 8007 | http://localhost:8007 |
| Rating Service | 8008 | http://localhost:8008 |
| Search Service | 8009 | http://localhost:8009 |
| Favourite Service | 8010 | http://localhost:8010 |
| Notification Service | 8011 | http://localhost:8011 |
| Tax Service | 8012 | http://localhost:8012 |

---

## 🛑 Dừng Services

### Phương Pháp 1: Sử Dụng Script

```powershell
.\stop-services.ps1
```

### Phương Pháp 2: Thủ Công

```powershell
# Dừng tất cả services (giữ lại data)
docker-compose down

# Dừng và xóa tất cả data (volumes)
docker-compose down -v
```

---

## 🔍 Xử Lý Sự Cố

### 1. Port Đã Được Sử Dụng

**Lỗi:** `port is already allocated`

**Giải pháp:**
```powershell
# Kiểm tra port nào đang được sử dụng
netstat -ano | findstr :80
netstat -ano | findstr :8001

# Dừng process đang sử dụng port (thay <PID> bằng Process ID)
taskkill /PID <PID> /F
```

### 2. Docker Desktop Không Chạy

**Lỗi:** `Cannot connect to the Docker daemon`

**Giải pháp:**
- Mở Docker Desktop
- Đợi cho đến khi Docker khởi động hoàn toàn
- Kiểm tra biểu tượng Docker ở system tray (góc dưới bên phải)

### 3. Container Không Khởi Động

**Kiểm tra logs:**
```powershell
docker-compose logs [service-name]
# Ví dụ:
docker-compose logs user-service
docker-compose logs mysql
```

**Rebuild service:**
```powershell
docker-compose build --no-cache [service-name]
docker-compose up -d [service-name]
```

### 4. Database Connection Failed

**Kiểm tra database đã sẵn sàng:**
```powershell
docker-compose ps mysql
docker-compose logs mysql
```

**Restart database:**
```powershell
docker-compose restart mysql
```

### 5. Services Mất Nhiều Thời Gian Để Khởi Động

**Bình thường!** Lần đầu tiên chạy có thể mất:
- 5-10 phút để download images
- 2-5 phút để build images
- 1-2 phút để các services khởi động và kết nối với databases

**Kiểm tra tiến trình:**
```powershell
docker-compose ps
docker-compose logs -f
```

---

## 📊 Monitoring Services

### Xem Logs Real-time

```powershell
# Tất cả services
docker-compose logs -f

# Một service cụ thể
docker-compose logs -f user-service
docker-compose logs -f product-service
```

### Xem Resource Usage

```powershell
docker stats
```

### Kiểm Tra Network

```powershell
docker network ls
docker network inspect ecommerce-microservices-platform_ecommerce-network
```

---

## 🗄️ Truy Cập Databases

### MySQL

```powershell
docker exec -it mysql-db mysql -u root -proot123 -D ecommerce
```

Trong MySQL shell:
```sql
SHOW TABLES;
SELECT * FROM users;
EXIT;
```

### MongoDB

```powershell
docker exec -it mongodb mongosh -u root -p root123
```

Trong MongoDB shell:
```javascript
use ecommerce
show collections
db.products.find()
exit
```

### Redis

```powershell
docker exec -it redis redis-cli
```

Trong Redis CLI:
```redis
KEYS *
GET "service:registry:user-service"
EXIT
```

---

## 📝 Lưu Ý Quan Trọng

1. **Lần đầu chạy:** Có thể mất 10-15 phút để download và build tất cả images
2. **Docker Desktop:** Phải luôn chạy khi sử dụng services
3. **Ports:** Đảm bảo các ports 80, 8000-8012 không bị sử dụng bởi ứng dụng khác
4. **Memory:** Docker Desktop cần ít nhất 4GB RAM. Có thể cần tăng trong Docker Desktop Settings
5. **Windows Firewall:** Có thể cần cho phép Docker qua firewall

---

## 🎯 Quick Commands Reference

```powershell
# Khởi động
docker-compose up -d --build

# Dừng
docker-compose down

# Xem status
docker-compose ps

# Xem logs
docker-compose logs -f

# Restart một service
docker-compose restart user-service

# Rebuild một service
docker-compose build --no-cache user-service
docker-compose up -d user-service

# Xóa tất cả (bao gồm volumes)
docker-compose down -v
```

---

## 💡 Tips

- Sử dụng Docker Desktop Dashboard để xem trạng thái containers trực quan
- Giữ PowerShell window mở để dễ dàng chạy commands
- Nếu gặp lỗi, luôn kiểm tra logs trước: `docker-compose logs [service-name]`
- Services có thể mất 30-60 giây để khởi động hoàn toàn, đặc biệt là lần đầu

---

**Chúc bạn thành công! 🚀**



# Ecommerce Microservices Platform

Kiến trúc thương mại điện tử được xây dựng theo mô hình **Microservices**, sử dụng FastAPI, Docker, Kafka, Redis, MySQL, MongoDB, và Nginx Gateway.

Dự án bao gồm **15 microservices độc lập**, mỗi service quản lý một bounded context riêng, giao tiếp thông qua REST + Kafka events.

---

# 1. System Architecture Overview

```
┌──────────────────────────────────────────────┐
│                 Client Apps                  │
│    (Web, Mobile, Postman, Third-party)       │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
             ┌───────────────────────┐
             │     API Gateway       │
             │        Nginx          │
             │       (Port 80)       │
             └───────────────────────┘
                        │
 ┌──────────────┬──────────────┬──────────────┬───────────────────┐
 │              │              │               │                   │
 ▼              ▼              ▼               ▼                   ▼
User S.      Product S.     Order S.      Payment S.         Cart Service
8001         8002           8003          8004               8013

… cùng các Services khác (Inventory, Shipping, Promotion, Search…)
```

Tất cả services giao tiếp qua:

* **Kafka** (async event bus)
* **REST API** thông qua API Gateway
* **Redis Discovery** (service registry)

---

# 2. Microservices List (15 Services)

| Service              | Port     | Database  | Description                      |
| -------------------- | -------- | --------- | -------------------------------- |
| Discovery Service    | 8000     | Redis     | Service registry                 |
| User Service         | 8001     | MySQL     | Đăng ký, đăng nhập, quản lý user |
| Product Service      | 8002     | MongoDB   | Product catalog, categories      |
| Order Service        | 8003     | MySQL     | Quản lý đơn hàng                 |
| Payment Service      | 8004     | MySQL     | Thanh toán                       |
| Inventory Service    | 8005     | MySQL     | Kiểm soát tồn kho                |
| Shipping Service     | 8006     | MySQL     | Vận chuyển                       |
| Promotion Service    | 8007     | MySQL     | Promotions, discount rules       |
| Rating Service       | 8008     | MySQL     | Đánh giá sản phẩm                |
| Search Service       | 8009     | Redis     | Search indexing                  |
| Favourite Service    | 8010     | MySQL     | Danh sách yêu thích              |
| Notification Service | 8011     | MySQL     | Gửi email/SMS                    |
| Tax Service          | 8012     | MySQL     | Tính thuế vùng miền              |
| **Cart Service**     | **8013** | **Redis** | Giỏ hàng                         |
| API Gateway          | 80       | N/A       | CORS, routing                    |

---

# 3. Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Motor (MongoDB Async)

### Databases

* MySQL 8
* MongoDB 7
* Redis 7

### Messaging

* Apache Kafka
* Zookeeper

### Infrastructure

* Docker
* Docker Compose
* Nginx

### Security

* JWT
* BCrypt (password hashing)

---

# 4. Project Structure

```
ecommerce-microservices/
│
├── api-gateway/
├── discovery-service/
│
├── cart-service/                 # Port 8013
├── user-service/                 # 8001
├── product-service/              # 8002
├── order-service/                # 8003
├── payment-service/              # 8004
├── inventory-service/            # 8005
├── shipping-service/             # 8006
├── promotion-service/            # 8007
├── rating-service/               # 8008
├── search-service/               # 8009
├── favourite-service/            # 8010
├── notification-service/         # 8011
├── tax-service/                  # 8012
│
├── docker-compose.yml
├── README.md
└── Postman_Collection.json
```

---

# 5. Cart Service (8013) – Full Documentation

### Purpose

Cart Service quản lý toàn bộ logic giỏ hàng:

* Tạo giỏ hàng theo user
* Thêm sản phẩm
* Cập nhật số lượng
* Xoá sản phẩm
* Xoá giỏ toàn bộ
* Tự động tính tổng tiền

Redis được sử dụng nhằm:

* tốc độ nhanh
* session-based
* key-value store phù hợp cho cart

### Redis Key Structure

```
cart:{user_id} -> {
  items: [
    { product_id, quantity, price }
  ],
  total_price
}
```

### API Endpoints

| Method | Endpoint                             | Description       |
| ------ | ------------------------------------ | ----------------- |
| GET    | `/cart/{user_id}`                    | Lấy giỏ hàng      |
| POST   | `/cart/{user_id}`                    | Tạo giỏ mới       |
| POST   | `/cart/{user_id}/items`              | Thêm item         |
| PATCH  | `/cart/{user_id}/items/{product_id}` | Cập nhật quantity |
| DELETE | `/cart/{user_id}/items/{product_id}` | Xoá item          |
| DELETE | `/cart/{user_id}`                    | Xoá giỏ hàng      |

Example Payload:

```json
{
  "product_id": "P001",
  "quantity": 2
}
```

---

# 6. Kafka Topics (Event-Driven)

| Topic              | Producer      | Consumer           |
| ------------------ | ------------- | ------------------ |
| order_created      | Order Service | Inventory, Payment |
| payment_success    | Payment       | Order              |
| payment_failed     | Payment       | Order              |
| inventory_reserved | Inventory     | Order              |
| inventory_failed   | Inventory     | Order              |
| order_shipped      | Shipping      | Notification       |
| user_registered    | User          | Notification       |
| product_added      | Product       | Search             |

---

# 7. Database Schema Summary

### MySQL (Transactional Services)

* users
* orders
* order_items
* payments
* shipments
* promotions
* ratings
* tax_rules
* favourites

### MongoDB (Product)

```
products: {
  id,
  name,
  description,
  price,
  category,
  attributes,
  images: []
}
```

### Redis (Search + Cart + Discovery)

* cart:{user_id}
* search:index
* service_registry:*

---

# 8. Quick Start (Docker Compose)

### 1. Clone repo

```
git clone https://github.com/minhtamnguyen217-wq/Ecommerce-Microservices-Platform.git
cd Ecommerce-Microservices-Platform
```

### 2. Start full system

```
docker-compose up --build -d
```

### 3. Verify

* API Gateway: [http://localhost](http://localhost)
* User Service: [http://localhost:8001/docs](http://localhost:8001/docs)
* Product Service: [http://localhost:8002/docs](http://localhost:8002/docs)
* Cart Service: [http://localhost:8013/docs](http://localhost:8013/docs)

Kafka UI (nếu bật): [http://localhost:8080](http://localhost:8080)

---

# 9. Testing with Postman

File Postman collection có sẵn:

```
Postman_Collection.json
```

Bao gồm đầy đủ test cho 15 services.

---

# 10. Scaling Strategy

### Stateless scaling

* mỗi service có thể scale bằng Docker Swarm / Kubernetes
* API Gateway load-balancing

### Data scaling

* Sharding MongoDB cho Product
* Master-Slave MySQL
* Redis cluster cho Cart + Search

### Event scaling

* Kafka partitions

---

# 11. Logging & Monitoring

Suggested stack:

* Prometheus
* Grafana
* Loki
* ELK Stack (Elastic, Logstash, Kibana)

---

# 12. Security

* JWT Authentication
* Role-based authorization
* Rate limiting (API Gateway)
* Encrypted passwords (BCrypt)

---

# 13. License

MIT License

---

# 14. Authors

Ecommerce Microservices Platform – Development Team

---


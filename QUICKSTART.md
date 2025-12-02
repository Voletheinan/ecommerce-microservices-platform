# Development Quick Start Guide

## Quick Setup (5 minutes)

### 1. Install Docker
- Download from https://www.docker.com/products/docker-desktop
- Install and start Docker

### 2. Navigate to Project
```bash
cd ecommerce-microservices
```

### 3. Start All Services
```bash
docker-compose up -d
```

### 4. Wait for Startup (1-2 minutes)
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Test Services
```bash
# Test API Gateway
curl http://localhost/health

# Test User Service
curl http://localhost:8001/health

# Test Product Service
curl http://localhost:8002/health
```

## Common Development Tasks

### Add New Endpoint to Service
1. Create router file in `service/routers/`
2. Import in `service/main.py`
3. Add `app.include_router()`
4. Restart service: `docker-compose restart service-name`

### Debug Service
```bash
# View logs
docker-compose logs service-name

# Run service locally (stop container first)
cd service-name
python main.py  # Runs on default port

# Access interactive shell
docker exec -it service-name /bin/bash
```

### Database Access
```bash
# MySQL
docker exec -it mysql-db mysql -u root -proot123 ecommerce

# MongoDB
docker exec -it mongodb mongosh -u root -p root123

# Redis CLI
docker exec -it redis redis-cli
```

### Reset Databases
```bash
# Stop and remove volumes
docker-compose down -v

# Restart (fresh databases)
docker-compose up -d
```

## Performance Tips

1. **Use Redis for Caching**
   - Cache search results
   - Cache user sessions
   - Cache hot products

2. **Optimize Queries**
   - Add database indexes
   - Use pagination
   - Avoid N+1 queries

3. **Async Operations**
   - Use Kafka for events
   - Process async tasks
   - Don't block requests

4. **Monitor Resources**
   ```bash
   docker stats
   ```

## Testing Flow

1. **Register User**
   - POST /api/users/register

2. **Login**
   - POST /api/users/login
   - Copy token

3. **Create Product**
   - POST /api/products/
   - Use token from login

4. **Create Order**
   - POST /api/orders/
   - Reference created product

5. **Process Payment**
   - POST /api/payments/
   - Reference order

6. **Check Shipment**
   - POST /api/shipments/
   - Track order

## Environment Variables

Edit variables in `docker-compose.yml`:
- `MYSQL_PASSWORD`: MySQL root password
- `JWT_SECRET`: JWT signing secret
- `KAFKA_BROKER`: Kafka connection string
- `REDIS_HOST`: Redis hostname

## Production Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Update database passwords
- [ ] Configure SSL/TLS certificates
- [ ] Set up log aggregation
- [ ] Configure monitoring & alerts
- [ ] Set resource limits
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

---
For more details, see README.md

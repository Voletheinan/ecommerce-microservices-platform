# E-Commerce Microservices Startup Script
# =========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E-Commerce Microservices Startup Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "`n1. Checking Docker Desktop status..." -ForegroundColor Yellow
$dockerTest = docker ps 2>&1
if ($dockerTest -like "*error*" -or $dockerTest -like "*not found*") {
    Write-Host "   ⚠️  Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and run this script again." -ForegroundColor Red
    Write-Host "`n   On Windows, you can:" -ForegroundColor Yellow
    Write-Host "   - Click Start menu → search 'Docker' → Click Docker Desktop" -ForegroundColor Gray
    Write-Host "   - Or run: & 'C:\Program Files\Docker\Docker\Docker Desktop.exe'" -ForegroundColor Gray
    Write-Host "`n   Waiting 60 seconds for Docker to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
} else {
    Write-Host "   ✓ Docker is running" -ForegroundColor Green
}

# Navigate to project
Write-Host "`n2. Navigating to project directory..." -ForegroundColor Yellow
Set-Location 'C:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices'
Write-Host "   ✓ Current directory: $(Get-Location)" -ForegroundColor Green

# Stop existing containers
Write-Host "`n3. Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null
Write-Host "   ✓ Containers stopped" -ForegroundColor Green

# Remove old volumes
Write-Host "`n4. Cleaning up old volumes..." -ForegroundColor Yellow
docker-compose down -v 2>&1 | Out-Null
Write-Host "   ✓ Old volumes removed" -ForegroundColor Green

# Start services
Write-Host "`n5. Starting all microservices..." -ForegroundColor Yellow
Write-Host "   This may take 2-3 minutes on first run..." -ForegroundColor Gray
docker-compose up -d --build 2>&1 | Select-Object -Last 20

# Wait for services to stabilize
Write-Host "`n6. Waiting for services to initialize..." -ForegroundColor Yellow
Write-Host "   (This may take 1-2 minutes)..." -ForegroundColor Gray
Start-Sleep -Seconds 90

# Check service status
Write-Host "`n7. Checking service status..." -ForegroundColor Yellow
$services = docker-compose ps
Write-Host $services -ForegroundColor White

# Test health endpoints
Write-Host "`n8. Testing health endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{name="API Gateway"; url="http://localhost/health"; port=80},
    @{name="User Service"; url="http://localhost:8001/health"; port=8001},
    @{name="Product Service"; url="http://localhost:8002/health"; port=8002},
    @{name="Order Service"; url="http://localhost:8003/health"; port=8003}
)

foreach ($endpoint in $endpoints) {
    try {
        $result = curl -s -m 3 $endpoint.url 2>&1
        if ($result -like "*healthy*" -or $result -like "*OK*") {
            Write-Host "   ✓ $($endpoint.name) is healthy" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $($endpoint.name) responded but check logs" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ✗ $($endpoint.name) is not responding yet" -ForegroundColor Red
    }
}

# Display next steps
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "System Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Register a new user:" -ForegroundColor White
Write-Host "   curl -X POST http://localhost/api/users/register \" -ForegroundColor Gray
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor Gray
Write-Host "     -d '{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"pass123\"}'" -ForegroundColor Gray

Write-Host "`n2. Login to get token:" -ForegroundColor White
Write-Host "   curl -X POST http://localhost/api/users/login \" -ForegroundColor Gray
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor Gray
Write-Host "     -d '{\"username\":\"testuser\",\"password\":\"pass123\"}'" -ForegroundColor Gray

Write-Host "`n3. View service logs:" -ForegroundColor White
Write-Host "   docker-compose logs -f user-service" -ForegroundColor Gray
Write-Host "   docker-compose logs -f order-service" -ForegroundColor Gray

Write-Host "`n4. Access Kafka topics:" -ForegroundColor White
Write-Host "   docker exec -it kafka kafka-topics.sh --list --bootstrap-server kafka:9092" -ForegroundColor Gray

Write-Host "`n5. View Kafka messages:" -ForegroundColor White
Write-Host "   docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic order-events --from-beginning" -ForegroundColor Gray

Write-Host "`nUseful Commands:" -ForegroundColor Yellow
Write-Host "- Stop all services: docker-compose down" -ForegroundColor Gray
Write-Host "- View all logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "- Restart a service: docker-compose restart user-service" -ForegroundColor Gray
Write-Host "- View service status: docker-compose ps" -ForegroundColor Gray

Write-Host "`nAccess Points:" -ForegroundColor Yellow
Write-Host "- API Gateway: http://localhost" -ForegroundColor Cyan
Write-Host "- User Service: http://localhost:8001" -ForegroundColor Cyan
Write-Host "- Product Service: http://localhost:8002" -ForegroundColor Cyan
Write-Host "- Order Service: http://localhost:8003" -ForegroundColor Cyan
Write-Host "- Redis: localhost:6379" -ForegroundColor Cyan
Write-Host "- MySQL: localhost:3307 (use localhost, not 'mysql')" -ForegroundColor Cyan
Write-Host "- MongoDB: localhost:27017" -ForegroundColor Cyan
Write-Host "- Kafka: localhost:9092" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Cyan

# Script để khởi động E-Commerce Microservices Platform
# Chạy script này trong PowerShell với quyền Administrator (nếu cần)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "E-Commerce Microservices Platform" -ForegroundColor Cyan
Write-Host "Starting Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Docker
Write-Host "1. Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✓ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Docker is not installed or not running!" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Kiểm tra Docker Compose
Write-Host "2. Checking Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "   ✓ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Docker Compose not found!" -ForegroundColor Red
    exit 1
}

# Kiểm tra Docker daemon đang chạy
Write-Host "3. Checking Docker daemon..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "   ✓ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Docker daemon is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and wait for it to be ready." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4. Building and starting all services..." -ForegroundColor Yellow
Write-Host "   This may take several minutes on first run..." -ForegroundColor Gray
Write-Host ""

# Chuyển đến thư mục dự án
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Khởi động services
Write-Host "   Running: docker-compose up -d --build" -ForegroundColor Gray
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Services started successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "5. Checking service status..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    docker-compose ps
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Service URLs:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "API Gateway:      http://localhost" -ForegroundColor White
    Write-Host "Discovery:        http://localhost:8000" -ForegroundColor White
    Write-Host "User Service:     http://localhost:8001" -ForegroundColor White
    Write-Host "Product Service: http://localhost:8002" -ForegroundColor White
    Write-Host "Order Service:   http://localhost:8003" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs:     docker-compose logs -f" -ForegroundColor Gray
    Write-Host "To stop services: docker-compose down" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "6. Testing services..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host ""
    Write-Host "Testing API Gateway..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ API Gateway is responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠ API Gateway may still be starting..." -ForegroundColor Yellow
    }
    
    Write-Host "Testing User Service..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ User Service is responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠ User Service may still be starting..." -ForegroundColor Yellow
    }
    
    Write-Host "Testing Product Service..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8002/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ Product Service is responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠ Product Service may still be starting..." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Note: Some services may take 30-60 seconds to fully start." -ForegroundColor Yellow
    Write-Host "Use 'docker-compose logs -f [service-name]' to monitor startup." -ForegroundColor Gray
    
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Failed to start services!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

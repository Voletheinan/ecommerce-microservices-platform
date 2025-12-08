# Script kiểm tra Docker và môi trường

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kiểm Tra Môi Trường Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Docker
Write-Host "1. Kiểm tra Docker..." -ForegroundColor Yellow
$dockerCheck = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCheck) {
    $dockerVersion = docker --version 2>&1
    Write-Host "   ✓ Docker đã cài đặt: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker chưa được cài đặt!" -ForegroundColor Red
    Write-Host "   Vui lòng tải và cài đặt Docker Desktop từ:" -ForegroundColor Yellow
    Write-Host "   https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
    exit 1
}

# Kiểm tra Docker Compose
Write-Host "2. Kiểm tra Docker Compose..." -ForegroundColor Yellow
$composeCheck = Get-Command docker-compose -ErrorAction SilentlyContinue
if ($composeCheck) {
    $composeVersion = docker-compose --version 2>&1
    Write-Host "   ✓ Docker Compose đã cài đặt: $composeVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker Compose chưa được cài đặt!" -ForegroundColor Red
    exit 1
}

# Kiểm tra Docker daemon
Write-Host "3. Kiểm tra Docker daemon..." -ForegroundColor Yellow
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Docker daemon đang chạy" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Docker daemon không chạy!" -ForegroundColor Red
        Write-Host "   Vui lòng mở Docker Desktop và đợi cho đến khi nó sẵn sàng." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ✗ Không thể kết nối với Docker daemon!" -ForegroundColor Red
    Write-Host "   Vui lòng đảm bảo Docker Desktop đang chạy." -ForegroundColor Yellow
    exit 1
}

# Kiểm tra file docker-compose.yml
Write-Host "4. Kiểm tra file docker-compose.yml..." -ForegroundColor Yellow
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$composeFile = Join-Path $projectPath "docker-compose.yml"
if (Test-Path $composeFile) {
    Write-Host "   ✓ Tìm thấy docker-compose.yml" -ForegroundColor Green
} else {
    Write-Host "   ✗ Không tìm thấy docker-compose.yml!" -ForegroundColor Red
    Write-Host "   File tại: $composeFile" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Tất cả kiểm tra đều OK!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Bạn có thể chạy: .\start-services.ps1" -ForegroundColor Cyan
Write-Host ""

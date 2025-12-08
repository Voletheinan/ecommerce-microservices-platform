# Script để dừng E-Commerce Microservices Platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stopping E-Commerce Microservices..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "Stopping all services..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ All services stopped successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Error stopping services" -ForegroundColor Red
}

Write-Host ""
Write-Host "To remove volumes as well, run:" -ForegroundColor Gray
Write-Host "  docker-compose down -v" -ForegroundColor Gray

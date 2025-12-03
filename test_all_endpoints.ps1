# Test tất cả endpoints
$baseUrl = "http://localhost"

# Credentials
$adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJleHAiOjE3NjQ4MTMxMzB9.hY96PI9naKo-bX91cnZq5M1wLZkd91U0lEYXK2WH324"

$headers = @{
    "Authorization" = "Bearer $adminToken"
}

Write-Host "=== TESTING ALL SERVICES ===" -ForegroundColor Cyan

# Test User Service (8001)
Write-Host "`n[USER SERVICE - Port 8001]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8001/api/users/me" -Headers $headers -SkipHttpErrorCheck
    $status = "✓" + $r.StatusCode
    if($r.StatusCode -ne 200) { Write-Host "GET /api/users/me: $status" -ForegroundColor Yellow }
    else { Write-Host "GET /api/users/me: $status" -ForegroundColor Green }
} catch { Write-Host "GET /api/users/me: EXCEPTION" -ForegroundColor Red }

try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8001/api/users/" -SkipHttpErrorCheck
    $status = "✓" + $r.StatusCode
    if($r.StatusCode -ne 200) { Write-Host "GET /api/users/ (list): $status" -ForegroundColor Yellow }
    else { Write-Host "GET /api/users/ (list): $status" -ForegroundColor Green }
} catch { Write-Host "GET /api/users/: EXCEPTION" -ForegroundColor Red }

# Test Product Service (8002)
Write-Host "`n[PRODUCT SERVICE - Port 8002]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8002/api/products/" -SkipHttpErrorCheck
    Write-Host "GET /api/products/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/products/: ERROR" -ForegroundColor Red }

try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8002/api/products/search/laptop" -SkipHttpErrorCheck
    Write-Host "GET /api/products/search/laptop: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/products/search/laptop: ERROR" -ForegroundColor Red }

# Test Search Service (8009)
Write-Host "`n[SEARCH SERVICE - Port 8009]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8009/api/search/?keyword=laptop" -SkipHttpErrorCheck
    Write-Host "GET /api/search/ (with keyword): $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/search/: ERROR" -ForegroundColor Red }

# Test Order Service (8003)
Write-Host "`n[ORDER SERVICE - Port 8003]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8003/api/orders/" -Headers $headers -SkipHttpErrorCheck
    Write-Host "GET /api/orders/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/orders/: ERROR" -ForegroundColor Red }

# Test Payment Service (8004)
Write-Host "`n[PAYMENT SERVICE - Port 8004]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8004/api/payments/" -Headers $headers -SkipHttpErrorCheck
    Write-Host "GET /api/payments/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/payments/: ERROR" -ForegroundColor Red }

# Test Inventory Service (8005)
Write-Host "`n[INVENTORY SERVICE - Port 8005]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8005/api/inventory/" -SkipHttpErrorCheck
    Write-Host "GET /api/inventory/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/inventory/: ERROR" -ForegroundColor Red }

# Test Shipping Service (8006)
Write-Host "`n[SHIPPING SERVICE - Port 8006]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8006/api/shipments/" -SkipHttpErrorCheck
    Write-Host "GET /api/shipments/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/shipments/: ERROR" -ForegroundColor Red }

# Test Promotion Service (8007)
Write-Host "`n[PROMOTION SERVICE - Port 8007]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8007/api/promotions/" -SkipHttpErrorCheck
    Write-Host "GET /api/promotions/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/promotions/: ERROR" -ForegroundColor Red }

# Test Rating Service (8008)
Write-Host "`n[RATING SERVICE - Port 8008]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8008/api/ratings/" -SkipHttpErrorCheck
    Write-Host "GET /api/ratings/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/ratings/: ERROR" -ForegroundColor Red }

# Test Favourite Service (8010)
Write-Host "`n[FAVOURITE SERVICE - Port 8010]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8010/api/favourites/" -Headers $headers -SkipHttpErrorCheck
    Write-Host "GET /api/favourites/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/favourites/: ERROR" -ForegroundColor Red }

# Test Notification Service (8011)
Write-Host "`n[NOTIFICATION SERVICE - Port 8011]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8011/api/notifications/" -Headers $headers -SkipHttpErrorCheck
    Write-Host "GET /api/notifications/: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/notifications/: ERROR" -ForegroundColor Red }

# Test Tax Service (8012)
Write-Host "`n[TAX SERVICE - Port 8012]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8012/api/tax/rate?country=US" -SkipHttpErrorCheck
    Write-Host "GET /api/tax/rate: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /api/tax/rate: ERROR" -ForegroundColor Red }

# Test Discovery Service (8000)
Write-Host "`n[DISCOVERY SERVICE - Port 8000]" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl:8000/services" -SkipHttpErrorCheck
    Write-Host "GET /services: $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Host "GET /services: ERROR" -ForegroundColor Red }

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan

$services = @{
    "User Service" = 8001
    "Product Service" = 8002
    "Order Service" = 8003
    "Payment Service" = 8004
    "Inventory Service" = 8005
    "Shipping Service" = 8006
    "Promotion Service" = 8007
    "Rating Service" = 8008
    "Search Service" = 8009
    "Favourite Service" = 8010
    "Notification Service" = 8011
    "Tax Service" = 8012
    "Discovery Service" = 8000
}

Write-Host "=== SERVICES STATUS ===" -ForegroundColor Cyan
foreach($service in $services.GetEnumerator()) {
    $port = $service.Value
    $url = "http://localhost:$port/health"
    try {
        $r = Invoke-WebRequest -Uri $url -TimeoutSec 2 -ErrorAction SilentlyContinue
        if($r.StatusCode -eq 200) {
            Write-Host "✓ $($service.Key) (Port $port)" -ForegroundColor Green
        } else {
            Write-Host "✗ $($service.Key) (Port $port) - Status: $($r.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "✗ $($service.Key) (Port $port) - DOWN" -ForegroundColor Red
    }
}

Write-Host "`n=== QUICK API TEST ===" -ForegroundColor Cyan

# Login test
Write-Host "`n1. User Login:" -ForegroundColor Yellow
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$r = Invoke-WebRequest -Uri "http://localhost:8001/api/users/login" -Method Post -ContentType "application/json" -Body $body -SkipHttpErrorCheck
Write-Host "   Status: $($r.StatusCode)"
if($r.StatusCode -eq 200) {
    $token = ($r.Content | ConvertFrom-Json).access_token
    Write-Host "   ✓ Token received" -ForegroundColor Green
    
    # Search test
    Write-Host "`n2. Search Products:" -ForegroundColor Yellow
    $r = Invoke-WebRequest -Uri "http://localhost:8009/api/search/?keyword=laptop" -SkipHttpErrorCheck
    Write-Host "   Status: $($r.StatusCode)"
    if($r.StatusCode -eq 200) { Write-Host "   ✓ Search working" -ForegroundColor Green }
    
    # Product list test
    Write-Host "`n3. List Products:" -ForegroundColor Yellow
    $r = Invoke-WebRequest -Uri "http://localhost:8002/api/products/" -SkipHttpErrorCheck
    Write-Host "   Status: $($r.StatusCode)"
    if($r.StatusCode -eq 200) { Write-Host "   ✓ Product list working" -ForegroundColor Green }
    else { Write-Host "   Error: $($r.Content)" -ForegroundColor Red }
    
    # Order list test
    Write-Host "`n4. List Orders:" -ForegroundColor Yellow
    $headers = @{ "Authorization" = "Bearer $token" }
    $r = Invoke-WebRequest -Uri "http://localhost:8003/api/orders/" -Headers $headers -SkipHttpErrorCheck
    Write-Host "   Status: $($r.StatusCode)"
    if($r.StatusCode -eq 200) { Write-Host "   ✓ Order list working" -ForegroundColor Green }
}
else {
    Write-Host "   ✗ Login failed" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan

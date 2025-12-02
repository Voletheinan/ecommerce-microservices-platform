$services = @(
    @{name='user-service'; port=8001},
    @{name='product-service'; port=8002},
    @{name='order-service'; port=8003},
    @{name='payment-service'; port=8004},
    @{name='inventory-service'; port=8005},
    @{name='shipping-service'; port=8006},
    @{name='promotion-service'; port=8007},
    @{name='rating-service'; port=8008},
    @{name='search-service'; port=8009},
    @{name='favourite-service'; port=8010},
    @{name='notification-service'; port=8011},
    @{name='tax-service'; port=8012}
)

foreach ($service in $services) {
    $svc = $service.name
    $port = $service.port
    $dockerfile = "c:\Users\AnThiwn\Desktop\LTPT_TMDT\ecommerce-microservices\$svc\Dockerfile"
    
    $content = "FROM python:3.10-slim`r`n"
    $content += "`r`nWORKDIR /app`r`n"
    $content += "`r`nCOPY $svc/requirements.txt .`r`n"
    $content += "RUN pip install --no-cache-dir -r requirements.txt`r`n"
    $content += "`r`nCOPY config ./config`r`n"
    $content += "COPY $svc ./`r`n"
    $content += "`r`nEXPOSE $port`r`n"
    $content += "`r`nCMD [""python"", ""main.py""]"
    
    Set-Content -Path $dockerfile -Value $content
    Write-Host "✓ Updated $svc"
}

Write-Host "✓ All Dockerfiles updated successfully!"

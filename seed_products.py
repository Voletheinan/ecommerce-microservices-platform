#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để thêm 50 sản phẩm vào MongoDB
Tạo user admin trước, lấy token, rồi thêm sản phẩm
"""
import requests
import json
import time
import sys
import io

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

API_BASE = "http://localhost:8002"
USER_API = "http://localhost:8001"

# Dữ liệu sản phẩm mẫu
products = [
    {"name": "iPhone 15 Pro Max", "description": "Smartphone flagship Apple với camera 48MP", "price": 32999000, "category": "Điện thoại", "sku": "APP-IP15PM-001", "inventory_count": 50},
    {"name": "Samsung Galaxy S24 Ultra", "description": "Điện thoại cao cấp Samsung với AI Galaxy", "price": 29999000, "category": "Điện thoại", "sku": "SAM-S24U-001", "inventory_count": 45},
    {"name": "Xiaomi 14 Ultra", "description": "Camera chuyên nghiệp trên điện thoại", "price": 18999000, "category": "Điện thoại", "sku": "XIA-14U-001", "inventory_count": 60},
    {"name": "OnePlus 12", "description": "Điện thoại mạnh mẽ giá tốt", "price": 15999000, "category": "Điện thoại", "sku": "ONE-12-001", "inventory_count": 55},
    {"name": "Oppo Find X7", "description": "Thiết kế đẹp, hiệu năng mạnh", "price": 17999000, "category": "Điện thoại", "sku": "OPP-X7-001", "inventory_count": 40},
    {"name": "Vivo X100 Pro", "description": "Camera gimbal trên điện thoại", "price": 19999000, "category": "Điện thoại", "sku": "VIV-X100P-001", "inventory_count": 35},
    {"name": "MacBook Pro 16\" M3", "description": "Laptop mạnh nhất cho chuyên nghiệp", "price": 59999000, "category": "Laptop", "sku": "APP-MBP16-M3", "inventory_count": 25},
    {"name": "Dell XPS 15", "description": "Laptop Windows cao cấp", "price": 39999000, "category": "Laptop", "sku": "DEL-XPS15-001", "inventory_count": 30},
    {"name": "Lenovo ThinkPad X1 Carbon", "description": "Laptop doanh nhân đáng tin cậy", "price": 34999000, "category": "Laptop", "sku": "LEN-TP-X1C", "inventory_count": 28},
    {"name": "ASUS ROG Gaming Laptop", "description": "Laptop gaming hiệu năng cao", "price": 45999000, "category": "Laptop", "sku": "ASU-ROG-001", "inventory_count": 20},
    {"name": "Acer Swift 3", "description": "Laptop mỏng nhẹ giá rẻ", "price": 19999000, "category": "Laptop", "sku": "ACE-SWIFT3-001", "inventory_count": 40},
    {"name": "HP Pavilion 15", "description": "Laptop học tập tốt", "price": 16999000, "category": "Laptop", "sku": "HP-PAV15-001", "inventory_count": 35},
    {"name": "iPad Pro 12.9\" M2", "description": "Máy tính bảng chuyên nghiệp", "price": 24999000, "category": "Máy tính bảng", "sku": "APP-IPP-M2", "inventory_count": 30},
    {"name": "Samsung Galaxy Tab S9 Ultra", "description": "Tablet màn hình AMOLED lớn", "price": 19999000, "category": "Máy tính bảng", "sku": "SAM-TAB-S9U", "inventory_count": 25},
    {"name": "Xiaomi Pad 6", "description": "Tablet bao phủ toàn màn hình", "price": 12999000, "category": "Máy tính bảng", "sku": "XIA-PAD6-001", "inventory_count": 40},
    {"name": "Apple AirPods Pro", "description": "Tai nghe không dây chủ động khử tiếng ồn", "price": 7999000, "category": "Tai nghe", "sku": "APP-AIRP-PRO", "inventory_count": 80},
    {"name": "Sony WH-1000XM5", "description": "Tai nghe over-ear chặn tiếng ồn tốt nhất", "price": 8999000, "category": "Tai nghe", "sku": "SON-XM5-001", "inventory_count": 60},
    {"name": "Bose QuietComfort Ultra", "description": "Tai nghe cao cấp Bose", "price": 9999000, "category": "Tai nghe", "sku": "BOS-QC-ULTRA", "inventory_count": 45},
    {"name": "Samsung Galaxy Buds2 Pro", "description": "Tai nghe TWS chất lượng cao", "price": 4999000, "category": "Tai nghe", "sku": "SAM-GB2P-001", "inventory_count": 100},
    {"name": "JBL Flip 6", "description": "Loa di động chống nước", "price": 3999000, "category": "Loa", "sku": "JBL-FLIP6-001", "inventory_count": 70},
    {"name": "Apple Watch Series 9", "description": "Đồng hồ thông minh Apple", "price": 9999000, "category": "Đồng hồ", "sku": "APP-WS9-001", "inventory_count": 50},
    {"name": "Samsung Galaxy Watch 6", "description": "Đồng hồ thông minh Wear OS", "price": 7999000, "category": "Đồng hồ", "sku": "SAM-GW6-001", "inventory_count": 55},
    {"name": "Garmin Epix Gen 2", "description": "Đồng hồ thể thao cao cấp", "price": 12999000, "category": "Đồng hồ", "sku": "GAR-EPIX2-001", "inventory_count": 30},
    {"name": "DJI Air 3S", "description": "Drone 4K giá phải chăng", "price": 26999000, "category": "Drone", "sku": "DJI-AIR3S-001", "inventory_count": 20},
    {"name": "DJI Mini 3 Pro", "description": "Drone nhỏ gọn chất lượng cao", "price": 14999000, "category": "Drone", "sku": "DJI-MINI3P-001", "inventory_count": 25},
    {"name": "GoPro Hero 12", "description": "Camera hành động 5.3K", "price": 12999000, "category": "Camera", "sku": "GOP-H12-001", "inventory_count": 35},
    {"name": "Canon EOS R5C", "description": "Máy ảnh mirrorless full frame", "price": 52999000, "category": "Camera", "sku": "CAN-R5C-001", "inventory_count": 15},
    {"name": "Sony Alpha 7 IV", "description": "Máy ảnh full frame 61MP", "price": 48999000, "category": "Camera", "sku": "SON-A7IV-001", "inventory_count": 18},
    {"name": "Nikon Z8", "description": "Máy ảnh mirrorless chuyên nghiệp", "price": 55999000, "category": "Camera", "sku": "NIK-Z8-001", "inventory_count": 12},
    {"name": "Nintendo Switch OLED", "description": "Máy chơi game di động", "price": 10999000, "category": "Gaming", "sku": "NIN-OLED-001", "inventory_count": 40},
    {"name": "PlayStation 5", "description": "Máy chơi game console mới nhất", "price": 14999000, "category": "Gaming", "sku": "SON-PS5-001", "inventory_count": 25},
    {"name": "Xbox Series X", "description": "Console Xbox hiệu năng cao", "price": 13999000, "category": "Gaming", "sku": "MIC-XSX-001", "inventory_count": 22},
    {"name": "NVIDIA RTX 4090", "description": "GPU chuyên nghiệp cao cấp nhất", "price": 49999000, "category": "PC Components", "sku": "NVI-RTX4090-001", "inventory_count": 10},
    {"name": "Intel Core i9 14900KS", "description": "CPU Intel thế hệ mới nhất", "price": 16999000, "category": "PC Components", "sku": "INT-I9-14900KS", "inventory_count": 15},
    {"name": "AMD Ryzen 9 7950X3D", "description": "CPU AMD chuyên gaming", "price": 15999000, "category": "PC Components", "sku": "AMD-R9-7950X3D", "inventory_count": 18},
    {"name": "Corsair Crystal 570X Case", "description": "Vỏ PC hiển thị đẹp", "price": 3999000, "category": "PC Components", "sku": "COR-570X-001", "inventory_count": 30},
    {"name": "ASUS ROG Maximus Z790", "description": "Mainboard Z790 cao cấp", "price": 8999000, "category": "PC Components", "sku": "ASU-Z790-001", "inventory_count": 20},
    {"name": "Corsair H170 Elite Capellix", "description": "Tản nhiệt nước AIO 360mm", "price": 4999000, "category": "PC Components", "sku": "COR-H170-001", "inventory_count": 25},
    {"name": "Seagate Barracuda 4TB", "description": "Ổ cứng HDD 3.5 inch", "price": 3999000, "category": "Storage", "sku": "SEA-BAR-4TB", "inventory_count": 50},
    {"name": "Samsung 990 Pro 2TB", "description": "SSD NVMe PCIe 4.0", "price": 4999000, "category": "Storage", "sku": "SAM-990P-2TB", "inventory_count": 35},
    {"name": "WD Black SN850X 1TB", "description": "SSD chơi game cao tốc", "price": 2999000, "category": "Storage", "sku": "WD-BLK-1TB", "inventory_count": 40},
    {"name": "LG 27GP850 Gaming Monitor", "description": "Màn hình gaming 165Hz", "price": 8999000, "category": "Monitor", "sku": "LG-27GP850-001", "inventory_count": 20},
    {"name": "ASUS ProArt PA247CV", "description": "Màn hình chuyên nghiệp IPS", "price": 7999000, "category": "Monitor", "sku": "ASU-PA247CV-001", "inventory_count": 15},
    {"name": "Dell S2721DGF", "description": "Màn hình gaming 1440p 165Hz", "price": 6999000, "category": "Monitor", "sku": "DEL-S2721DGF-001", "inventory_count": 18},
    {"name": "BenQ EW2480", "description": "Màn hình 24 inch tiết kiệm điện", "price": 2999000, "category": "Monitor", "sku": "BEN-EW2480-001", "inventory_count": 40},
    {"name": "Razer DeathAdder V3", "description": "Chuột gaming siêu nhẹ", "price": 1999000, "category": "Peripherals", "sku": "RAZ-DA-V3", "inventory_count": 60},
    {"name": "Logitech MX Master 3S", "description": "Chuột cao cấp cho chuyên nghiệp", "price": 3999000, "category": "Peripherals", "sku": "LOG-MXM3S-001", "inventory_count": 35},
    {"name": "SteelSeries Apex Pro", "description": "Bàn phím cơ hall effect", "price": 2999000, "category": "Peripherals", "sku": "STE-APEX-PRO", "inventory_count": 45},
]

def register_admin():
    """Đăng ký tài khoản admin"""
    print("🔐 Đăng ký tài khoản admin...")
    try:
        response = requests.post(
            f"{USER_API}/api/users/register",
            json={
                "email": "admin@ecommerce.com",
                "username": "admin",
                "password": "Admin@123456789",
                "full_name": "Admin User",
                "phone": "0901234567",
                "address": "123 Admin Street, HCM"
            },
            timeout=5
        )
        if response.status_code == 200:
            print("✅ Tài khoản admin đã được tạo")
            return True
        else:
            print(f"⚠️  Tài khoản admin có thể đã tồn tại (Status: {response.status_code})")
            return True
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return False

def login_admin():
    """Đăng nhập lấy token"""
    print("🔓 Đăng nhập lấy token...")
    try:
        response = requests.post(
            f"{USER_API}/api/users/login",
            json={
                "username": "admin",
                "password": "Admin@123456789"
            },
            timeout=5
        )
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"✅ Đăng nhập thành công!")
            return token
        else:
            print(f"❌ Lỗi đăng nhập: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        return None

def seed_products(token):
    """Thêm sản phẩm vào database"""
    print(f"\n🔄 Đang thêm {len(products)} sản phẩm...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    success = 0
    failed = 0
    
    for i, product in enumerate(products, 1):
        try:
            # Convert inventory_count -> stock
            product_data = {
                "id": f"product_{i:03d}",
                "name": product["name"],
                "description": product["description"],
                "price": product["price"],
                "category": product["category"],
                "sku": product["sku"],
                "stock": product["inventory_count"],  # Đổi tên field
                "images": [],
                "attributes": {}
            }
            response = requests.post(
                f"{API_BASE}/api/products/",
                json=product_data,
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ [{i}/{len(products)}] {product['name']} - ID: {data.get('id', 'N/A')}")
                success += 1
            else:
                print(f"❌ [{i}/{len(products)}] {product['name']} - Status: {response.status_code}")
                failed += 1
        except Exception as e:
            print(f"❌ [{i}/{len(products)}] {product['name']} - Error: {str(e)}")
            failed += 1
        
        time.sleep(0.2)  # Rate limit
    
    print(f"\n{'='*60}")
    print(f"✅ Thêm thành công: {success} sản phẩm")
    print(f"❌ Thêm thất bại: {failed} sản phẩm")
    print(f"{'='*60}")

if __name__ == "__main__":
    try:
        # 1. Đăng ký admin
        if not register_admin():
            exit(1)
        
        time.sleep(1)
        
        # 2. Đăng nhập lấy token
        token = login_admin()
        if not token:
            exit(1)
        
        time.sleep(1)
        
        # 3. Thêm sản phẩm
        seed_products(token)
        
    except KeyboardInterrupt:
        print("\n⚠️  Đã hủy!")
    except Exception as e:
        print(f"❌ Lỗi: {e}")

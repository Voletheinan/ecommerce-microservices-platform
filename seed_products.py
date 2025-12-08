#!/usr/bin/env python3
"""
Seed sample products into MongoDB
"""
import sys
import os
import asyncio
from datetime import datetime

# Add paths
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'product-service'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'config'))

from config.database import connect_mongodb, close_mongodb, get_mongodb

async def seed_products():
    """Seed sample products"""
    # Connect to MongoDB
    await connect_mongodb()
    db = get_mongodb()
    
    if not db:
        print("✗ Failed to connect to MongoDB")
        return
    
    collection = db.products
    
    # Check if products already exist
    count = await collection.count_documents({})
    if count > 0:
        print(f"✓ Found {count} existing products in database")
        print("  Products already seeded. Skipping...")
        await close_mongodb()
        return
    
    # Sample products
    products = [
        {
            "name": "iPhone 15 Pro Max",
            "description": "Điện thoại iPhone 15 Pro Max 256GB - Màn hình 6.7 inch, chip A17 Pro, camera 48MP",
            "price": 29990000,
            "category": "Điện thoại",
            "stock": 50,
            "sku": "IPHONE-15-PRO-MAX-256",
            "images": [
                "/images/iphone-15-pro-max.jpg"
            ],
            "attributes": {
                "brand": "Apple",
                "storage": "256GB",
                "color": "Titanium Blue",
                "screen_size": "6.7 inch"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Samsung Galaxy S24 Ultra",
            "description": "Điện thoại Samsung Galaxy S24 Ultra 512GB - Màn hình 6.8 inch, S Pen, camera 200MP",
            "price": 27990000,
            "category": "Điện thoại",
            "stock": 30,
            "sku": "SAMSUNG-S24-ULTRA-512",
            "images": [
                "/images/samsung-s24-ultra.jpg"
            ],
            "attributes": {
                "brand": "Samsung",
                "storage": "512GB",
                "color": "Titanium Black",
                "screen_size": "6.8 inch"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "MacBook Pro 14 inch M3",
            "description": "Laptop Apple MacBook Pro 14 inch M3 chip, 16GB RAM, 512GB SSD",
            "price": 49990000,
            "category": "Laptop",
            "stock": 20,
            "sku": "MACBOOK-PRO-14-M3",
            "images": [
                "/images/macbook-pro-14.jpg"
            ],
            "attributes": {
                "brand": "Apple",
                "processor": "M3",
                "ram": "16GB",
                "storage": "512GB SSD",
                "screen_size": "14 inch"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Dell XPS 15",
            "description": "Laptop Dell XPS 15 OLED, Intel Core i7, 16GB RAM, 1TB SSD, RTX 4050",
            "price": 45990000,
            "category": "Laptop",
            "stock": 15,
            "sku": "DELL-XPS-15-OLED",
            "images": [
                "/images/dell-xps-15.jpg"
            ],
            "attributes": {
                "brand": "Dell",
                "processor": "Intel Core i7",
                "ram": "16GB",
                "storage": "1TB SSD",
                "graphics": "RTX 4050",
                "screen_size": "15.6 inch"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "AirPods Pro 2",
            "description": "Tai nghe Apple AirPods Pro 2 với Active Noise Cancellation và Spatial Audio",
            "price": 5990000,
            "category": "Tai nghe",
            "stock": 100,
            "sku": "AIRPODS-PRO-2",
            "images": [
                "/images/airpods-pro-2.jpg"
            ],
            "attributes": {
                "brand": "Apple",
                "type": "True Wireless",
                "noise_cancellation": True,
                "battery_life": "6 hours"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Sony WH-1000XM5",
            "description": "Tai nghe chụp tai Sony WH-1000XM5 với công nghệ chống ồn hàng đầu",
            "price": 8990000,
            "category": "Tai nghe",
            "stock": 40,
            "sku": "SONY-WH1000XM5",
            "images": [
                "/images/sony-wh1000xm5.jpg"
            ],
            "attributes": {
                "brand": "Sony",
                "type": "Over-ear",
                "noise_cancellation": True,
                "battery_life": "30 hours"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "iPad Pro 12.9 inch M2",
            "description": "Máy tính bảng iPad Pro 12.9 inch M2 chip, 256GB, Wi-Fi + Cellular",
            "price": 32990000,
            "category": "Máy tính bảng",
            "stock": 25,
            "sku": "IPAD-PRO-12.9-M2",
            "images": [
                "/images/ipad-pro-12.9.jpg"
            ],
            "attributes": {
                "brand": "Apple",
                "processor": "M2",
                "storage": "256GB",
                "screen_size": "12.9 inch",
                "connectivity": "Wi-Fi + Cellular"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Samsung Galaxy Tab S9 Ultra",
            "description": "Máy tính bảng Samsung Galaxy Tab S9 Ultra 14.6 inch, 256GB, S Pen",
            "price": 24990000,
            "category": "Máy tính bảng",
            "stock": 18,
            "sku": "SAMSUNG-TAB-S9-ULTRA",
            "images": [
                "/images/samsung-tab-s9-ultra.jpg"
            ],
            "attributes": {
                "brand": "Samsung",
                "processor": "Snapdragon 8 Gen 2",
                "storage": "256GB",
                "screen_size": "14.6 inch",
                "s_pen": True
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Apple Watch Series 9",
            "description": "Đồng hồ thông minh Apple Watch Series 9 45mm, GPS + Cellular",
            "price": 12990000,
            "category": "Đồng hồ thông minh",
            "stock": 60,
            "sku": "APPLE-WATCH-S9-45",
            "images": [
                "/images/apple-watch-s9.jpg"
            ],
            "attributes": {
                "brand": "Apple",
                "size": "45mm",
                "connectivity": "GPS + Cellular",
                "battery_life": "18 hours"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Samsung Galaxy Watch 6 Classic",
            "description": "Đồng hồ thông minh Samsung Galaxy Watch 6 Classic 47mm, LTE",
            "price": 9990000,
            "category": "Đồng hồ thông minh",
            "stock": 35,
            "sku": "SAMSUNG-WATCH-6-CLASSIC",
            "images": [
                "/images/samsung-watch-6.jpg"
            ],
            "attributes": {
                "brand": "Samsung",
                "size": "47mm",
                "connectivity": "LTE",
                "battery_life": "40 hours"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    try:
        # Insert products
        result = await collection.insert_many(products)
        print(f"✓ Successfully seeded {len(result.inserted_ids)} products!")
        print("\nProducts added:")
        for i, product in enumerate(products, 1):
            print(f"  {i}. {product['name']} - {product['price']:,} VNĐ")
        
    except Exception as e:
        print(f"✗ Error seeding products: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await close_mongodb()

if __name__ == "__main__":
    asyncio.run(seed_products())


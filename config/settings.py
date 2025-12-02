"""
Global configuration for all microservices
"""
import os
from typing import Optional

# Database Configuration
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root123")
MYSQL_DB = os.getenv("MYSQL_DB", "ecommerce")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "ecommerce")

# Redis Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# Kafka Configuration
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
KAFKA_TOPICS = {
    "orders": "order-events",
    "payments": "payment-events",
    "inventory": "inventory-events",
    "notifications": "notification-events",
    "shipping": "shipping-events",
    "products": "product-events",
}

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Service Discovery
DISCOVERY_SERVICE_URL = os.getenv("DISCOVERY_SERVICE_URL", "http://discovery-service:8000")

# Service Ports
SERVICE_PORTS = {
    "user-service": 8001,
    "product-service": 8002,
    "order-service": 8003,
    "payment-service": 8004,
    "inventory-service": 8005,
    "shipping-service": 8006,
    "promotion-service": 8007,
    "rating-service": 8008,
    "search-service": 8009,
    "favourite-service": 8010,
    "notification-service": 8011,
    "tax-service": 8012,
    "discovery-service": 8000,
}

# CORS
CORS_ORIGINS = ["*"]

# API Documentation
API_TITLE = "E-Commerce Microservices"
API_VERSION = "1.0.0"

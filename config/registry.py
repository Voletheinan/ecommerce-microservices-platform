"""
Service registry for service discovery
"""
import json
import logging
from typing import Optional, Dict, List
from .database import get_redis_client
from .settings import SERVICE_PORTS

logger = logging.getLogger(__name__)

class ServiceRegistry:
    def __init__(self):
        self.redis = get_redis_client()
        self.registry_prefix = "service:registry:"
    
    def register_service(self, service_name: str, port: int, host: str = "localhost"):
        """Register a service"""
        try:
            service_info = {
                "name": service_name,
                "host": host,
                "port": port,
                "url": f"http://{host}:{port}",
                "timestamp": str(datetime.now())
            }
            key = f"{self.registry_prefix}{service_name}"
            self.redis.setex(key, 3600, json.dumps(service_info))  # 1 hour TTL
            logger.info(f"Service registered: {service_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to register service: {e}")
            return False
    
    def discover_service(self, service_name: str) -> Optional[Dict]:
        """Discover a service"""
        try:
            key = f"{self.registry_prefix}{service_name}"
            data = self.redis.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Failed to discover service: {e}")
            return None
    
    def list_services(self) -> List[Dict]:
        """List all registered services"""
        try:
            keys = self.redis.keys(f"{self.registry_prefix}*")
            services = []
            for key in keys:
                data = self.redis.get(key)
                if data:
                    services.append(json.loads(data))
            return services
        except Exception as e:
            logger.error(f"Failed to list services: {e}")
            return []
    
    def deregister_service(self, service_name: str):
        """Deregister a service"""
        try:
            key = f"{self.registry_prefix}{service_name}"
            self.redis.delete(key)
            logger.info(f"Service deregistered: {service_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to deregister service: {e}")
            return False

from datetime import datetime
service_registry = ServiceRegistry()

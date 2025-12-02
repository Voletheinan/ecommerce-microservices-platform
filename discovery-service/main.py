"""
Discovery Service - Service Registry Management
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from config.registry import service_registry
from config.settings import CORS_ORIGINS, API_TITLE, API_VERSION

app = FastAPI(title=API_TITLE, version=API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    """Initialize on startup"""
    print("Discovery Service started on port 8000")

@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    print("Discovery Service shutting down")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "discovery-service"}

@app.post("/register/{service_name}")
async def register_service(service_name: str, port: int, host: str = "localhost"):
    """Register a service"""
    result = service_registry.register_service(service_name, port, host)
    if result:
        return {
            "status": "registered",
            "service_name": service_name,
            "host": host,
            "port": port
        }
    raise HTTPException(status_code=500, detail="Failed to register service")

@app.get("/discover/{service_name}")
async def discover_service(service_name: str):
    """Discover a service"""
    service = service_registry.discover_service(service_name)
    if service:
        return service
    raise HTTPException(status_code=404, detail=f"Service {service_name} not found")

@app.get("/services")
async def list_services():
    """List all registered services"""
    services = service_registry.list_services()
    return {"services": services, "count": len(services)}

@app.delete("/deregister/{service_name}")
async def deregister_service(service_name: str):
    """Deregister a service"""
    result = service_registry.deregister_service(service_name)
    if result:
        return {"status": "deregistered", "service_name": service_name}
    raise HTTPException(status_code=500, detail="Failed to deregister service")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
Product Service Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from config.database import connect_mongodb, close_mongodb, get_mongodb
from config.settings import CORS_ORIGINS, API_TITLE, API_VERSION
from routers import product

app = FastAPI(title=API_TITLE, version=API_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product.router)

@app.on_event("startup")
async def startup():
    """Initialize on startup"""
    await connect_mongodb()
    print("Product Service started on port 8002")

@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    await close_mongodb()
    print("Product Service shutting down")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "product-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

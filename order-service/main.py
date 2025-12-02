"""
Order Service Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from config.database import engine
from config.settings import CORS_ORIGINS, API_TITLE, API_VERSION
from models.order import Base
from routers import order

app = FastAPI(title=API_TITLE, version=API_VERSION)

@app.on_event("startup")
def startup_event():
    """Initialize database with retry logic"""
    import time
    max_retries = 10
    retry_delay = 3
    for attempt in range(1, max_retries + 1):
        try:
            conn = engine.connect()
            conn.close()
            Base.metadata.create_all(bind=engine)
            print("Database connected and tables created")
            break
        except Exception as e:
            print(f"Database not ready (attempt {attempt}/{max_retries}): {e}")
            if attempt == max_retries:
                print("Exceeded max retries waiting for database")
                break
            time.sleep(retry_delay)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(order.router)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "order-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

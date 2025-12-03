"""Search Service"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from config.settings import CORS_ORIGINS, API_TITLE, API_VERSION
from routers import search
from services.search_service import search_service

app = FastAPI(title=API_TITLE, version=API_VERSION)
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    """Initialize MongoDB connection on startup"""
    await search_service.init_mongo()
    print("Search Service started on port 8009")

@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    if search_service.mongo_client:
        search_service.mongo_client.close()
    print("Search Service shutting down")

app.include_router(search.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "search-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)


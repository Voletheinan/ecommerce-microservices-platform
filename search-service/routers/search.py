"""Search routes"""
from fastapi import APIRouter, Query
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from services.search_service import search_service

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/")
def search(keyword: str = Query(...), category: str = Query(None), limit: int = Query(10)):
    result = search_service.search_products(keyword)
    return {"keyword": keyword, **result, "limit": limit}

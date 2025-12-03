"""Search routes"""
from fastapi import APIRouter, Query
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from services.search_service import search_service

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/")
async def search(keyword: str = Query(None), category: str = Query(None), limit: int = Query(10)):
    """Search products by keyword. If no keyword, returns all products"""
    search_term = keyword if keyword else "*"
    result = await search_service.search_products(search_term, limit=limit)
    return {"keyword": keyword, **result, "limit": limit}

"""Search routes"""
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/")
def search(keyword: str = Query(...), category: str = Query(None), limit: int = Query(10)):
    result = search_service.search_products(keyword)
    return {"keyword": keyword, **result, "limit": limit}

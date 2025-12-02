"""Search schemas"""
from pydantic import BaseModel
from typing import List, Optional

class SearchQuery(BaseModel):
    keyword: str
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    limit: int = 10

class SearchResult(BaseModel):
    results: List[dict]
    total: int

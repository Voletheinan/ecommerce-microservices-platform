"""Search service"""
from config.database import get_redis_client
import json

class SearchService:
    def __init__(self):
        self.redis = get_redis_client()
    
    def cache_search_result(self, query: str, results: list):
        key = f"search:{query}"
        self.redis.setex(key, 3600, json.dumps(results))
    
    def get_cached_results(self, query: str):
        key = f"search:{query}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def search_products(self, query: str):
        cached = self.get_cached_results(query)
        if cached:
            return {"results": cached, "from_cache": True}
        # Mock search results
        results = [{"id": "1", "name": f"Product for {query}", "price": 100}]
        self.cache_search_result(query, results)
        return {"results": results, "from_cache": False}

search_service = SearchService()

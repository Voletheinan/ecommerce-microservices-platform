"""Search service"""
from config.database import get_redis_client, MONGODB_URL, MONGODB_DB
import json

class SearchService:
    def __init__(self):
        self.redis = get_redis_client()
        self.mongo_client = None
        self.db = None
    
    async def init_mongo(self):
        """Initialize MongoDB connection"""
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self.mongo_client = AsyncIOMotorClient(MONGODB_URL)
            self.db = self.mongo_client[MONGODB_DB]
            print("MongoDB connected for search service")
        except Exception as e:
            print(f"MongoDB init error: {e}")
    
    def cache_search_result(self, query: str, results: list):
        key = f"search:{query}"
        self.redis.setex(key, 3600, json.dumps(results, default=str))
    
    def get_cached_results(self, query: str):
        key = f"search:{query}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    async def search_products_from_db(self, query: str, limit: int = 10):
        """Search products from MongoDB"""
        try:
            if self.db is None:
                await self.init_mongo()
            
            if self.db is None:
                print("MongoDB not initialized")
                return []
            
            # Search in name or description (case-insensitive)
            search_regex = {"$regex": query, "$options": "i"}
            filter_query = {
                "$or": [
                    {"name": search_regex},
                    {"description": search_regex},
                    {"category": search_regex}
                ]
            }
            
            products = await self.db.products.find(filter_query).limit(limit).to_list(limit)
            
            # Convert MongoDB ObjectId to string
            results = []
            for product in products:
                product["id"] = str(product.get("_id", ""))
                product.pop("_id", None)
                results.append(product)
            
            print(f"Search '{query}': found {len(results)} products")
            return results
        except Exception as e:
            print(f"Database search error: {e}")
            return []
    
    async def search_products(self, query: str, limit: int = 10):
        # Check cache first
        cached = self.get_cached_results(query)
        if cached:
            return {"results": cached, "from_cache": True, "count": len(cached)}
        
        # Search from database
        results = await self.search_products_from_db(query, limit)
        
        # If database results exist, cache them
        if results:
            self.cache_search_result(query, results)
            return {"results": results, "from_cache": False, "count": len(results)}
        
        # Return empty results
        return {"results": [], "from_cache": False, "count": 0}

search_service = SearchService()


"""
Product service business logic
"""
from bson import ObjectId
from datetime import datetime
from models.product import ProductCreate, ProductUpdate

class ProductService:
    def __init__(self, db):
        self.db = db
        self.collection = db.products
    
    async def create_product(self, product: ProductCreate):
        """Create new product"""
        product_dict = product.dict()
        product_dict["created_at"] = datetime.utcnow()
        product_dict["updated_at"] = datetime.utcnow()
        result = await self.collection.insert_one(product_dict)
        return str(result.inserted_id)
    
    async def get_product(self, product_id: str):
        """Get product by ID"""
        try:
            product = await self.collection.find_one({"_id": ObjectId(product_id)})
            if product:
                product["_id"] = str(product["_id"])
            return product
        except Exception:
            return None
    
    async def list_products(self, skip: int = 0, limit: int = 10, category: str = None):
        """List products with pagination"""
        query = {}
        if category:
            query["category"] = category
        
        products = []
        async for product in self.collection.find(query).skip(skip).limit(limit):
            product["_id"] = str(product["_id"])
            products.append(product)
        
        total = await self.collection.count_documents(query)
        return {"products": products, "total": total, "skip": skip, "limit": limit}
    
    async def update_product(self, product_id: str, product_update: ProductUpdate):
        """Update product"""
        try:
            update_dict = product_update.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_dict}
            )
            return result.modified_count > 0
        except Exception:
            return False
    
    async def delete_product(self, product_id: str):
        """Delete product"""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(product_id)})
            return result.deleted_count > 0
        except Exception:
            return False
    
    async def search_products(self, keyword: str, limit: int = 10):
        """Search products"""
        query = {
            "$or": [
                {"name": {"$regex": keyword, "$options": "i"}},
                {"description": {"$regex": keyword, "$options": "i"}}
            ]
        }
        products = []
        async for product in self.collection.find(query).limit(limit):
            product["_id"] = str(product["_id"])
            products.append(product)
        return products

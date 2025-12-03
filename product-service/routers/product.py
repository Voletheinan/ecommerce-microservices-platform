"""
Product API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
import sys
from config.database import get_mongodb
from config.jwt_auth import get_current_user, get_admin_user
from models.product import ProductCreate, ProductUpdate, Product
from services.product_service import ProductService

router = APIRouter(prefix="/api/products", tags=["products"])

async def get_product_service(db = Depends(get_mongodb)):
    return ProductService(db)

@router.post("/", response_model=dict)
async def create_product(product: ProductCreate, service: ProductService = Depends(get_product_service), admin_user: dict = Depends(get_admin_user)):
    """Create new product (admin only)"""
    product_id = await service.create_product(product)
    return {"id": product_id, "message": "Product created successfully"}

@router.get("/{product_id}")
async def get_product(product_id: str, service: ProductService = Depends(get_product_service)):
    """Get product by ID"""
    product = await service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/")
async def list_products(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), category: str = Query(None), service: ProductService = Depends(get_product_service)):
    """List products"""
    result = await service.list_products(skip=skip, limit=limit, category=category)
    return result

@router.put("/{product_id}")
async def update_product(product_id: str, product_update: ProductUpdate, service: ProductService = Depends(get_product_service), admin_user: dict = Depends(get_admin_user)):
    """Update product (admin only)"""
    success = await service.update_product(product_id, product_update)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated successfully"}

@router.delete("/{product_id}")
async def delete_product(product_id: str, service: ProductService = Depends(get_product_service), admin_user: dict = Depends(get_admin_user)):
    """Delete product (admin only)"""
    success = await service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.get("/search/{keyword}")
async def search_products(keyword: str, limit: int = Query(10, ge=1, le=100), service: ProductService = Depends(get_product_service)):
    """Search products"""
    products = await service.search_products(keyword, limit=limit)
    return {"products": products, "count": len(products)}

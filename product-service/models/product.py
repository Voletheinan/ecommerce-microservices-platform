"""
Product MongoDB models
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    stock: int
    sku: str
    images: List[str] = []
    attributes: Optional[dict] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    sku: Optional[str] = None
    images: Optional[List[str]] = None
    attributes: Optional[dict] = None

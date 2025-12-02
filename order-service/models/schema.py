"""
Order schemas
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    user_id: int
    items: List[OrderItemCreate]
    shipping_address: str

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    shipping_address: Optional[str] = None

class OrderItem(BaseModel):
    id: int
    order_id: int
    product_id: str
    quantity: int
    price: float

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_address: str
    items: List[OrderItem] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

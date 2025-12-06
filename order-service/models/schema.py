"""
Order schemas
"""
from pydantic import BaseModel, model_validator
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float  # Required - client must provide current price

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
    product_name: Optional[str] = None
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
    
    @model_validator(mode='before')
    @classmethod
    def handle_order_items(cls, data):
        # Map order_items to items if present
        if isinstance(data, dict) and 'order_items' in data and 'items' not in data:
            data['items'] = data.pop('order_items')
        # Also handle the case where it's an ORM object
        elif hasattr(data, 'order_items') and not hasattr(data, 'items'):
            data.items = data.order_items
        return data

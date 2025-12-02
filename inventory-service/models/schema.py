"""
Inventory schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InventoryCreate(BaseModel):
    product_id: str
    quantity: int
    warehouse_location: str

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    reserved: Optional[int] = None

class Inventory(BaseModel):
    id: int
    product_id: str
    quantity: int
    reserved: int
    warehouse_location: str
    updated_at: datetime
    
    class Config:
        from_attributes = True

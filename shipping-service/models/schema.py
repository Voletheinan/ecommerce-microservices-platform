"""Shipping schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ShipmentCreate(BaseModel):
    order_id: int
    carrier: str
    estimated_delivery: datetime

class Shipment(BaseModel):
    id: int
    order_id: int
    tracking_number: str
    carrier: str
    status: str
    estimated_delivery: datetime
    created_at: datetime
    class Config:
        from_attributes = True

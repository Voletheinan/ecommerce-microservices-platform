"""Promotion schemas"""
from pydantic import BaseModel
from datetime import datetime

class PromotionCreate(BaseModel):
    name: str
    description: str
    discount_percent: float
    start_date: datetime
    end_date: datetime

class Promotion(BaseModel):
    id: int
    name: str
    discount_percent: float
    is_active: bool
    class Config:
        from_attributes = True

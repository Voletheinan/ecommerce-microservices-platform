"""
Payment schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: int
    user_id: int
    amount: float
    payment_method: str

class PaymentUpdate(BaseModel):
    status: Optional[str] = None

class Payment(BaseModel):
    id: int
    order_id: int
    user_id: int
    amount: float
    payment_method: str
    transaction_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

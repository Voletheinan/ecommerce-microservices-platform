"""Tax schemas"""
from pydantic import BaseModel

class TaxRateCreate(BaseModel):
    country: str
    state: str = None
    tax_percent: float

class TaxRate(BaseModel):
    id: int
    country: str
    tax_percent: float
    class Config:
        from_attributes = True

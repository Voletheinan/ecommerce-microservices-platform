"""Application DTOs"""
from pydantic import BaseModel, Field
from typing import Optional


class TaxCalculationRequestDTO(BaseModel):
    """DTO for tax calculation request"""
    amount: float = Field(..., gt=0, description="Amount to calculate tax on")
    country: str = Field(..., min_length=1, description="Country code or name")
    state: Optional[str] = Field(None, description="State/Province (optional)")

    class Config:
        json_schema_extra = {
            "example": {
                "amount": 100,
                "country": "Vietnam",
                "state": None
            }
        }


class TaxCalculationResponseDTO(BaseModel):
    """DTO for tax calculation response"""
    amount: float
    tax_percent: float
    tax_amount: float
    total: float

    class Config:
        json_schema_extra = {
            "example": {
                "amount": 100.0,
                "tax_percent": 10.0,
                "tax_amount": 10.0,
                "total": 110.0
            }
        }


class TaxResponseDTO(BaseModel):
    """DTO for tax rate response"""
    id: int
    country: str
    state: Optional[str]
    tax_percent: float

    class Config:
        from_attributes = True


class TaxListResponseDTO(BaseModel):
    """DTO for tax list response"""
    taxes: list[TaxResponseDTO]
    count: int

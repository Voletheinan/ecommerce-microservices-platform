"""Application DTOs (Data Transfer Objects)"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CreatePromotionDTO(BaseModel):
    """DTO for creating a promotion"""
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=500)
    discount_percent: float = Field(..., gt=0, le=100)
    start_date: datetime
    end_date: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Black Friday",
                "description": "30% off all items",
                "discount_percent": 30,
                "start_date": "2025-12-01T00:00:00",
                "end_date": "2025-12-31T23:59:59"
            }
        }


class PromotionResponseDTO(BaseModel):
    """DTO for promotion response"""
    id: int
    name: str
    description: str
    discount_percent: float
    is_active: bool
    start_date: datetime
    end_date: datetime
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PromotionListResponseDTO(BaseModel):
    """DTO for promotion list response"""
    promotions: list[PromotionResponseDTO]
    count: int
    total_pages: Optional[int] = None
    current_page: Optional[int] = None

"""Application DTOs"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BaseDTO(BaseModel):
    """Base DTO for all responses"""
    id: Optional[int] = None
    
    class Config:
        from_attributes = True

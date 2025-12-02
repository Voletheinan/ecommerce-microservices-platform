"""Rating schemas"""
from pydantic import BaseModel

class RatingCreate(BaseModel):
    product_id: str
    user_id: int
    score: float
    comment: str

class Rating(BaseModel):
    id: int
    product_id: str
    score: float
    class Config:
        from_attributes = True

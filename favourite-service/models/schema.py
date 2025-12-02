"""Favourite schemas"""
from pydantic import BaseModel

class FavouriteCreate(BaseModel):
    product_id: str

class Favourite(BaseModel):
    id: int
    product_id: str
    class Config:
        from_attributes = True

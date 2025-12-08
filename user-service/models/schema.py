"""
Pydantic schemas for User API
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: Optional[str] = None  # Can be username or email
    email: Optional[str] = None
    password: str

class User(UserBase):
    id: int
    role: str = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    role: str = "client"
    
    class Config:
        populate_by_name = True

class UserProfile(BaseModel):
    user_id: int
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    total_orders: int = 0
    total_spent: int = 0

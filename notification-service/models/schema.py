"""Notification schemas"""
from pydantic import BaseModel

class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str

class Notification(BaseModel):
    id: int
    title: str
    is_read: bool
    class Config:
        from_attributes = True

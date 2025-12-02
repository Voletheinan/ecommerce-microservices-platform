"""Domain Entity: User_Service"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class User_ServiceEntity:
    """Domain entity for user_service"""
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    def is_valid(self) -> bool:
        """Validate business rules"""
        return True

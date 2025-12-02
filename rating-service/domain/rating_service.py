"""Domain Entity: Rating_Service"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Rating_ServiceEntity:
    """Domain entity for rating_service"""
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    def is_valid(self) -> bool:
        """Validate business rules"""
        return True

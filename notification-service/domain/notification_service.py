"""Domain Entity: Notification_Service"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Notification_ServiceEntity:
    """Domain entity for notification_service"""
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    def is_valid(self) -> bool:
        """Validate business rules"""
        return True

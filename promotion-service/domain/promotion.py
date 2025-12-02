"""Domain Entity: Promotion"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class PromotionEntity:
    """Promotion domain entity (pure business logic, framework-independent)"""
    name: str
    discount_percent: float
    description: str
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    def is_valid(self) -> bool:
        """Validate promotion business rules"""
        if not 0 < self.discount_percent <= 100:
            raise ValueError("Discount must be between 0 and 100")
        if self.start_date >= self.end_date:
            raise ValueError("Start date must be before end date")
        return True

    def is_active_now(self) -> bool:
        """Check if promotion is currently active"""
        now = datetime.utcnow()
        return self.is_active and self.start_date <= now <= self.end_date

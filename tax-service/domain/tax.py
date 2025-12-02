"""Domain Entity: Tax"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class TaxEntity:
    """Tax domain entity"""
    country: str
    state: Optional[str] = None
    tax_percent: float = 10.0  # Default 10%
    id: Optional[int] = None

    def is_valid(self) -> bool:
        """Validate tax business rules"""
        if not 0 <= self.tax_percent <= 100:
            raise ValueError("Tax percentage must be between 0 and 100")
        if not self.country:
            raise ValueError("Country is required")
        return True

    def calculate_tax(self, amount: float) -> dict:
        """Calculate tax amount"""
        if amount < 0:
            raise ValueError("Amount must be positive")
        
        tax_amount = amount * (self.tax_percent / 100)
        return {
            "amount": amount,
            "tax_percent": self.tax_percent,
            "tax_amount": tax_amount,
            "total": amount + tax_amount
        }

"""Application Use Cases"""
from typing import Optional
from domain.tax import TaxEntity
from application.dtos import TaxCalculationResponseDTO


class TaxUseCases:
    """Use cases for tax calculation"""

    def __init__(self, repository):
        """
        Args:
            repository: TaxRepository interface
        """
        self.repository = repository

    def calculate_tax(self, amount: float, country: str, state: Optional[str] = None) -> TaxCalculationResponseDTO:
        """Calculate tax for given amount and country"""
        # Get tax rate from repository or use default
        tax_entity = self.repository.find_by_country_state(country, state)
        
        if not tax_entity:
            # Default to 10% if no tax rate found
            tax_entity = TaxEntity(country=country, state=state, tax_percent=10.0)
        
        # Calculate using domain entity
        calculation = tax_entity.calculate_tax(amount)
        
        return TaxCalculationResponseDTO(
            amount=calculation["amount"],
            tax_percent=calculation["tax_percent"],
            tax_amount=calculation["tax_amount"],
            total=calculation["total"]
        )

    def get_tax_rate(self, country: str, state: Optional[str] = None) -> Optional[TaxEntity]:
        """Get tax rate for country/state"""
        return self.repository.find_by_country_state(country, state)

    def list_all_tax_rates(self) -> list:
        """List all tax rates"""
        return self.repository.find_all()

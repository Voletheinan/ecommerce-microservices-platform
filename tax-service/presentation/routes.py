"""FastAPI Routes (Presentation/Controller Layer)"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from application.use_cases import TaxUseCases
from application.dtos import TaxCalculationResponseDTO, TaxListResponseDTO, TaxResponseDTO
from infrastructure.repositories import SQLAlchemyTaxRepository
from config.database import get_db

router = APIRouter(prefix="/api/tax", tags=["tax"])


def get_use_cases(db: Session = Depends(get_db)) -> TaxUseCases:
    """Dependency injection for use cases"""
    repository = SQLAlchemyTaxRepository(db)
    return TaxUseCases(repository)


@router.get("/calculate", response_model=TaxCalculationResponseDTO)
def calculate_tax(
    amount: float = Query(..., gt=0, description="Amount to calculate tax for"),
    country: str = Query(..., min_length=1, description="Country name or code"),
    state: Optional[str] = Query(None, description="State/Province (optional)"),
    use_cases: TaxUseCases = Depends(get_use_cases)
):
    """Calculate tax for given amount and country"""
    try:
        return use_cases.calculate_tax(amount, country, state)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/rates", response_model=TaxListResponseDTO)
def list_tax_rates(use_cases: TaxUseCases = Depends(get_use_cases)):
    """List all tax rates"""
    taxes = use_cases.list_all_tax_rates()
    return TaxListResponseDTO(
        taxes=[TaxResponseDTO(id=t.id, country=t.country, state=t.state, tax_percent=t.tax_percent) for t in taxes],
        count=len(taxes)
    )


@router.get("/rates/{country}", response_model=TaxResponseDTO)
def get_tax_rate(
    country: str,
    state: Optional[str] = Query(None),
    use_cases: TaxUseCases = Depends(get_use_cases)
):
    """Get tax rate for specific country/state"""
    tax = use_cases.get_tax_rate(country, state)
    if not tax:
        raise HTTPException(status_code=404, detail=f"Tax rate not found for {country}")
    return TaxResponseDTO(id=tax.id, country=tax.country, state=tax.state, tax_percent=tax.tax_percent)

"""Tax routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from models.schema import TaxRateCreate, TaxRate
from services.tax_service import TaxService
from config.database import get_db

router = APIRouter(prefix="/api/tax", tags=["tax"])

@router.post("/rates", response_model=TaxRate)
def create_tax_rate(tax: TaxRateCreate, db: Session = Depends(get_db)):
    return TaxService.create_tax_rate(db, tax)

@router.get("/calculate")
def calculate_tax(amount: float = Query(...), country: str = Query(...), state: str = Query(None), db: Session = Depends(get_db)):
    return TaxService.calculate_tax(db, amount, country, state)

@router.get("/rate")
def get_tax_rate(country: str = Query(...), state: str = Query(None), db: Session = Depends(get_db)):
    tax = TaxService.get_tax_rate(db, country, state)
    if tax:
        return tax
    return {"message": "No tax rate found"}

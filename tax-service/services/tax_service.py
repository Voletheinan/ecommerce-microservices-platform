"""Tax service"""
from sqlalchemy.orm import Session
from models.tax import TaxRate
from models.schema import TaxRateCreate, TaxRate as TaxRateSchema

class TaxService:
    @staticmethod
    def create_tax_rate(db: Session, tax: TaxRateCreate):
        db_tax = TaxRate(**tax.dict())
        db.add(db_tax)
        db.commit()
        db.refresh(db_tax)
        return db_tax
    
    @staticmethod
    def get_tax_rate(db: Session, country: str, state: str = None):
        query = db.query(TaxRate).filter(TaxRate.country == country)
        if state:
            query = query.filter(TaxRate.state == state)
        return query.first()
    
    @staticmethod
    def calculate_tax(db: Session, amount: float, country: str, state: str = None):
        tax_rate = TaxService.get_tax_rate(db, country, state)
        if tax_rate:
            tax_percent = tax_rate.tax_percent
        else:
            tax_percent = 10.0  # mặc định 10%
        tax_amount = amount * (tax_percent / 100)
        return {"amount": amount, "tax_percent": tax_percent, "tax_amount": tax_amount, "total": amount + tax_amount}

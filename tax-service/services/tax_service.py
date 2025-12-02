"""Tax service"""
from sqlalchemy.orm import Session
from models.schema import TaxRate
from models.schema import TaxRateCreate

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
            tax_amount = amount * (tax_rate.tax_percent / 100)
            return {"amount": amount, "tax_percent": tax_rate.tax_percent, "tax_amount": tax_amount, "total": amount + tax_amount}
        return {"amount": amount, "tax_percent": 0, "tax_amount": 0, "total": amount}

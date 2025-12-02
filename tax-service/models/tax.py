"""Tax models"""
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TaxRate(Base):
    __tablename__ = "tax_rates"
    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(100))
    state = Column(String(100), nullable=True)
    tax_percent = Column(Float)

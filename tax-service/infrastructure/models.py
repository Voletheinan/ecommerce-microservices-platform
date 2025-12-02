"""SQLAlchemy ORM Models (Infrastructure Layer)"""
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class TaxRateORM(Base):
    """SQLAlchemy ORM model for TaxRate"""
    __tablename__ = "tax_rates"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=True, index=True)
    tax_percent = Column(Float, nullable=False)

    def to_entity(self):
        """Convert ORM model to domain entity"""
        from domain.tax import TaxEntity
        return TaxEntity(
            id=self.id,
            country=self.country,
            state=self.state,
            tax_percent=self.tax_percent
        )

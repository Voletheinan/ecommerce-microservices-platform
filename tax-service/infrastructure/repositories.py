"""Repository Interface and Implementation"""
from abc import ABC, abstractmethod
from typing import List, Optional
from sqlalchemy.orm import Session
from domain.tax import TaxEntity
from infrastructure.models import TaxRateORM


class TaxRepository(ABC):
    """Abstract repository interface"""

    @abstractmethod
    def find_by_country_state(self, country: str, state: Optional[str]) -> Optional[TaxEntity]:
        pass

    @abstractmethod
    def find_all(self) -> List[TaxEntity]:
        pass

    @abstractmethod
    def save(self, entity: TaxEntity) -> TaxEntity:
        pass

    @abstractmethod
    def delete(self, tax_id: int) -> bool:
        pass


class SQLAlchemyTaxRepository(TaxRepository):
    """SQLAlchemy implementation of TaxRepository"""

    def __init__(self, db: Session):
        self.db = db

    def find_by_country_state(self, country: str, state: Optional[str]) -> Optional[TaxEntity]:
        """Find tax rate by country and state"""
        query = self.db.query(TaxRateORM).filter(TaxRateORM.country == country)
        
        if state:
            query = query.filter(TaxRateORM.state == state)
        else:
            query = query.filter(TaxRateORM.state.is_(None))
        
        orm_model = query.first()
        return orm_model.to_entity() if orm_model else None

    def find_all(self) -> List[TaxEntity]:
        """Get all tax rates"""
        orm_models = self.db.query(TaxRateORM).all()
        return [orm.to_entity() for orm in orm_models]

    def save(self, entity: TaxEntity) -> TaxEntity:
        """Save tax rate"""
        orm_model = TaxRateORM(
            country=entity.country,
            state=entity.state,
            tax_percent=entity.tax_percent
        )
        self.db.add(orm_model)
        self.db.commit()
        self.db.refresh(orm_model)
        return orm_model.to_entity()

    def delete(self, tax_id: int) -> bool:
        """Delete tax rate"""
        orm_model = self.db.query(TaxRateORM).filter(TaxRateORM.id == tax_id).first()
        if not orm_model:
            return False

        self.db.delete(orm_model)
        self.db.commit()
        return True

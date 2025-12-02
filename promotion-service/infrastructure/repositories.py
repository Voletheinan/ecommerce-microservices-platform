"""Repository Interface and Implementation"""
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from domain.promotion import PromotionEntity
from infrastructure.models import PromotionORM


class PromotionRepository(ABC):
    """Abstract repository interface"""

    @abstractmethod
    def save(self, entity: PromotionEntity) -> PromotionEntity:
        pass

    @abstractmethod
    def find_by_id(self, promotion_id: int) -> Optional[PromotionEntity]:
        pass

    @abstractmethod
    def find_all(self) -> List[PromotionEntity]:
        pass

    @abstractmethod
    def find_active(self) -> List[PromotionEntity]:
        pass

    @abstractmethod
    def update(self, entity: PromotionEntity) -> Optional[PromotionEntity]:
        pass

    @abstractmethod
    def delete(self, promotion_id: int) -> bool:
        pass


class SQLAlchemyPromotionRepository(PromotionRepository):
    """SQLAlchemy implementation of PromotionRepository"""

    def __init__(self, db: Session):
        self.db = db

    def save(self, entity: PromotionEntity) -> PromotionEntity:
        """Save new promotion to database"""
        orm_model = PromotionORM(
            name=entity.name,
            description=entity.description,
            discount_percent=entity.discount_percent,
            start_date=entity.start_date,
            end_date=entity.end_date,
            is_active=entity.is_active
        )
        self.db.add(orm_model)
        self.db.commit()
        self.db.refresh(orm_model)
        return orm_model.to_entity()

    def find_by_id(self, promotion_id: int) -> Optional[PromotionEntity]:
        """Find promotion by ID"""
        orm_model = self.db.query(PromotionORM).filter(PromotionORM.id == promotion_id).first()
        return orm_model.to_entity() if orm_model else None

    def find_all(self) -> List[PromotionEntity]:
        """Get all promotions"""
        orm_models = self.db.query(PromotionORM).all()
        return [orm.to_entity() for orm in orm_models]

    def find_active(self) -> List[PromotionEntity]:
        """Get active promotions"""
        now = datetime.utcnow()
        orm_models = self.db.query(PromotionORM).filter(
            PromotionORM.is_active == True,
            PromotionORM.start_date <= now,
            PromotionORM.end_date >= now
        ).all()
        return [orm.to_entity() for orm in orm_models]

    def update(self, entity: PromotionEntity) -> Optional[PromotionEntity]:
        """Update existing promotion"""
        orm_model = self.db.query(PromotionORM).filter(PromotionORM.id == entity.id).first()
        if not orm_model:
            return None

        orm_model.name = entity.name
        orm_model.description = entity.description
        orm_model.discount_percent = entity.discount_percent
        orm_model.start_date = entity.start_date
        orm_model.end_date = entity.end_date
        orm_model.is_active = entity.is_active

        self.db.commit()
        self.db.refresh(orm_model)
        return orm_model.to_entity()

    def delete(self, promotion_id: int) -> bool:
        """Delete promotion"""
        orm_model = self.db.query(PromotionORM).filter(PromotionORM.id == promotion_id).first()
        if not orm_model:
            return False

        self.db.delete(orm_model)
        self.db.commit()
        return True

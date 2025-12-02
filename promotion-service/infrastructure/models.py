"""SQLAlchemy ORM Models (Infrastructure Layer)"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class PromotionORM(Base):
    """SQLAlchemy ORM model for Promotion (database persistence)"""
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    discount_percent = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_entity(self):
        """Convert ORM model to domain entity"""
        from domain.promotion import PromotionEntity
        return PromotionEntity(
            id=self.id,
            name=self.name,
            description=self.description,
            discount_percent=self.discount_percent,
            start_date=self.start_date,
            end_date=self.end_date,
            is_active=self.is_active,
            created_at=self.created_at
        )

"""Promotion service"""
from sqlalchemy.orm import Session
from models.schema import Promotion
from datetime import datetime
from models.schema import PromotionCreate

class PromotionService:
    @staticmethod
    def create_promotion(db: Session, promotion: PromotionCreate):
        db_promotion = Promotion(**promotion.dict())
        db.add(db_promotion)
        db.commit()
        db.refresh(db_promotion)
        return db_promotion
    
    @staticmethod
    def list_active_promotions(db: Session):
        return db.query(Promotion).filter(Promotion.is_active == True, Promotion.end_date >= datetime.utcnow()).all()
    
    @staticmethod
    def get_promotion(db: Session, promotion_id: int):
        return db.query(Promotion).filter(Promotion.id == promotion_id).first()

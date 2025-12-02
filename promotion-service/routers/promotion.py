"""Promotion routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.schema import PromotionCreate, Promotion
from services.promotion_service import PromotionService
from config.database import get_db

router = APIRouter(prefix="/api/promotions", tags=["promotions"])

@router.post("/", response_model=Promotion)
def create_promotion(promotion: PromotionCreate, db: Session = Depends(get_db)):
    return PromotionService.create_promotion(db, promotion)

@router.get("/active")
def get_active_promotions(db: Session = Depends(get_db)):
    promotions = PromotionService.list_active_promotions(db)
    return {"promotions": promotions, "count": len(promotions)}

@router.get("/{promotion_id}", response_model=Promotion)
def get_promotion(promotion_id: int, db: Session = Depends(get_db)):
    promotion = PromotionService.get_promotion(db, promotion_id)
    if not promotion:
        raise HTTPException(status_code=404)
    return promotion

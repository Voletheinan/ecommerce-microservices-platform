"""Rating routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.jwt_auth import get_current_user
from config.database import get_db
from models.schema import RatingCreate, Rating
from services.rating_service import RatingService

router = APIRouter(prefix="/api/ratings", tags=["ratings"])

@router.post("/", response_model=Rating)
def create_rating(rating: RatingCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return RatingService.create_rating(db, rating)

@router.get("/product/{product_id}")
def get_product_ratings(product_id: str, db: Session = Depends(get_db)):
    return RatingService.get_product_ratings(db, product_id)

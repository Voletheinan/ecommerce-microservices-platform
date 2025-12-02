"""Rating service"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.schema import Rating
from models.schema import RatingCreate

class RatingService:
    @staticmethod
    def create_rating(db: Session, rating: RatingCreate):
        db_rating = Rating(**rating.dict())
        db.add(db_rating)
        db.commit()
        db.refresh(db_rating)
        return db_rating
    
    @staticmethod
    def get_product_ratings(db: Session, product_id: str):
        ratings = db.query(Rating).filter(Rating.product_id == product_id).all()
        avg_score = db.query(func.avg(Rating.score)).filter(Rating.product_id == product_id).scalar() or 0
        return {"ratings": ratings, "average": round(avg_score, 2), "count": len(ratings)}

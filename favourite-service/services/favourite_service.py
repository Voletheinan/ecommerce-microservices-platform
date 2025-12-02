"""Favourite service"""
from sqlalchemy.orm import Session
from models.schema import Favourite
from models.schema import FavouriteCreate

class FavouriteService:
    @staticmethod
    def add_favourite(db: Session, user_id: int, fav: FavouriteCreate):
        existing = db.query(Favourite).filter(Favourite.user_id == user_id, Favourite.product_id == fav.product_id).first()
        if existing:
            return existing
        db_fav = Favourite(user_id=user_id, product_id=fav.product_id)
        db.add(db_fav)
        db.commit()
        db.refresh(db_fav)
        return db_fav
    
    @staticmethod
    def get_user_favourites(db: Session, user_id: int):
        return db.query(Favourite).filter(Favourite.user_id == user_id).all()
    
    @staticmethod
    def remove_favourite(db: Session, favourite_id: int):
        fav = db.query(Favourite).filter(Favourite.id == favourite_id).first()
        if fav:
            db.delete(fav)
            db.commit()
            return True
        return False

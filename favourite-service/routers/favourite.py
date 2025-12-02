"""Favourite routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from config.jwt_auth import get_current_user
from models.schema import FavouriteCreate, Favourite
from services.favourite_service import FavouriteService

router = APIRouter(prefix="/api/favourites", tags=["favourites"])

@router.post("/", response_model=Favourite)
def add_favourite(fav: FavouriteCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return FavouriteService.add_favourite(db, int(current_user["user_id"]), fav)

@router.get("/")
def get_favourites(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    favs = FavouriteService.get_user_favourites(db, int(current_user["user_id"]))
    return {"favourites": favs, "count": len(favs)}

@router.delete("/{favourite_id}")
def remove_favourite(favourite_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    success = FavouriteService.remove_favourite(db, favourite_id)
    if not success:
        raise HTTPException(status_code=404)
    return {"message": "Favourite removed"}

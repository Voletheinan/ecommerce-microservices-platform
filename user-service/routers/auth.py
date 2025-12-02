"""
User API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from config.jwt_auth import create_access_token, get_current_user
from models.schema import UserCreate, UserLogin, User, Token
from services.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register new user"""
    existing_user = UserService.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = UserService.get_user_by_username(db, user.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    db_user = UserService.create_user(db, user)
    return db_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = UserService.authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email
    }

@router.get("/me", response_model=User)
def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user information"""
    user = UserService.get_user_by_id(db, int(current_user["user_id"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user_data: UserCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user information"""
    if int(current_user["user_id"]) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = UserService.update_user(db, user_id, 
                                   email=user_data.email,
                                   full_name=user_data.full_name,
                                   phone=user_data.phone,
                                   address=user_data.address)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete user (deactivate)"""
    if int(current_user["user_id"]) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = UserService.update_user(db, user_id, is_active=False)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "user deactivated"}

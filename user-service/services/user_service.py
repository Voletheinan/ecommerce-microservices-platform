"""
User service business logic
"""
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import User
from models.schema import UserCreate

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class UserService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        hashed_password = UserService.hash_password(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hashed_password,
            full_name=user.full_name,
            phone=user.phone,
            address=user.address
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str):
        user = UserService.get_user_by_username(db, username)
        if not user:
            return None
        if not UserService.verify_password(password, user.hashed_password):
            return None
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, **kwargs):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            for key, value in kwargs.items():
                if value is not None:
                    setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user

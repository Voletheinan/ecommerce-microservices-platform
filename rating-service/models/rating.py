"""Rating models"""
from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(100))
    user_id = Column(Integer)
    score = Column(Float)
    comment = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

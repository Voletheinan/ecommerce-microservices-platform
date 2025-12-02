"""
Payment models
"""
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, index=True)
    user_id = Column(Integer)
    amount = Column(Float)
    payment_method = Column(String(50))  # credit_card, paypal, bank_transfer
    transaction_id = Column(String(255), unique=True)
    status = Column(String(50), default="pending")  # pending, completed, failed, refunded
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

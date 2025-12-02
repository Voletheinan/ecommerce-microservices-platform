"""
Payment API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import sys
from config.database import get_db
from config.jwt_auth import get_current_user
from models.schema import PaymentCreate, PaymentUpdate, Payment
from services.payment_service import PaymentService

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/", response_model=Payment)
def process_payment(payment: PaymentCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Process payment"""
    db_payment = PaymentService.process_payment(db, payment)
    return db_payment

@router.get("/{payment_id}", response_model=Payment)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get payment by ID"""
    payment = PaymentService.get_payment(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.get("/")
def list_payments(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), order_id: int = Query(None), db: Session = Depends(get_db)):
    """List payments"""
    payments = PaymentService.list_payments(db, order_id=order_id, skip=skip, limit=limit)
    return {"payments": payments, "count": len(payments)}

@router.post("/{payment_id}/refund")
def refund_payment(payment_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Refund payment"""
    success = PaymentService.refund_payment(db, payment_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot refund payment")
    return {"message": "Payment refunded successfully"}

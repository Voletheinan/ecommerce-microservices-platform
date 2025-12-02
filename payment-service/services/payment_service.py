"""
Payment service business logic
"""
from sqlalchemy.orm import Session
import uuid
from models.schema import Payment
from models.schema import PaymentCreate, PaymentUpdate
from config.kafka import kafka_service

class PaymentService:
    @staticmethod
    def process_payment(db: Session, payment: PaymentCreate):
        """Process payment"""
        transaction_id = str(uuid.uuid4())
        
        db_payment = Payment(
            order_id=payment.order_id,
            user_id=payment.user_id,
            amount=payment.amount,
            payment_method=payment.payment_method,
            transaction_id=transaction_id,
            status="completed"  # In production, integrate with actual payment gateway
        )
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        # Publish event
        kafka_service.publish_event("payment-events", {
            "event": "payment_processed",
            "payment_id": db_payment.id,
            "order_id": payment.order_id,
            "amount": payment.amount,
            "status": "completed"
        })
        
        return db_payment
    
    @staticmethod
    def get_payment(db: Session, payment_id: int):
        """Get payment by ID"""
        return db.query(Payment).filter(Payment.id == payment_id).first()
    
    @staticmethod
    def list_payments(db: Session, order_id: int = None, skip: int = 0, limit: int = 10):
        """List payments"""
        query = db.query(Payment)
        if order_id:
            query = query.filter(Payment.order_id == order_id)
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def refund_payment(db: Session, payment_id: int):
        """Refund payment"""
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if payment and payment.status == "completed":
            payment.status = "refunded"
            db.commit()
            db.refresh(payment)
            
            kafka_service.publish_event("payment-events", {
                "event": "payment_refunded",
                "payment_id": payment_id,
                "order_id": payment.order_id
            })
            return True
        return False

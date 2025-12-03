"""
Order service business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.schema import OrderCreate, OrderUpdate
from models.order import Order, OrderItem
from config.kafka import kafka_service

class OrderService:
    @staticmethod
    def create_order(db: Session, order: OrderCreate):
        """Create new order"""
        total_amount = sum(item.price * item.quantity for item in order.items)
        
        db_order = Order(
            user_id=order.user_id,
            total_amount=total_amount,
            shipping_address=order.shipping_address
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        # Create order items
        for item in order.items:
            db_item = OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            db.add(db_item)
        
        db.commit()
        
        # Publish event to Kafka
        kafka_service.publish_event("order-events", {
            "event": "order_created",
            "order_id": db_order.id,
            "user_id": order.user_id,
            "total_amount": total_amount
        })
        
        return db_order
    
    @staticmethod
    def get_order(db: Session, order_id: int):
        """Get order by ID"""
        return db.query(Order).filter(Order.id == order_id).first()
    
    @staticmethod
    def list_orders(db: Session, user_id: int = None, skip: int = 0, limit: int = 10):
        """List orders"""
        query = db.query(Order)
        if user_id:
            query = query.filter(Order.user_id == user_id)
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_order(db: Session, order_id: int, order_update: OrderUpdate):
        """Update order"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if order:
            if order_update.status:
                order.status = order_update.status
                # Publish status update event
                kafka_service.publish_event("order-events", {
                    "event": "order_status_updated",
                    "order_id": order_id,
                    "status": order_update.status
                })
            if order_update.shipping_address:
                order.shipping_address = order_update.shipping_address
            db.commit()
            db.refresh(order)
        return order
    
    @staticmethod
    def cancel_order(db: Session, order_id: int):
        """Cancel order"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if order and order.status in ["pending", "confirmed"]:
            order.status = "cancelled"
            db.commit()
            db.refresh(order)
            
            kafka_service.publish_event("order-events", {
                "event": "order_cancelled",
                "order_id": order_id
            })
            return True
        return False

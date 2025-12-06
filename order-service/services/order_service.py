"""
Order service business logic
"""
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.schema import OrderCreate, OrderUpdate
from models.order import Order, OrderItem
from config.kafka import kafka_service
import httpx
import os
from typing import Optional

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8002")

class OrderService:
    @staticmethod
    async def get_product_name(product_id: str) -> Optional[str]:
        """Fetch product name from product service"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{PRODUCT_SERVICE_URL}/api/products/{product_id}")
                if response.status_code == 200:
                    product = response.json()
                    return product.get("name")
        except Exception as e:
            print(f"Error fetching product {product_id}: {e}")
        return None
    
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
        db.flush()  # Flush to get the ID
        
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
        
        # Re-fetch fresh from DB
        db_order_fresh = db.query(Order).filter(Order.id == db_order.id).first()
        
        # Publish event to Kafka
        kafka_service.publish_event("order-events", {
            "event": "order_created",
            "order_id": db_order_fresh.id,
            "user_id": order.user_id,
            "total_amount": total_amount
        })
        
        return db_order_fresh
    
    @staticmethod
    def get_order(db: Session, order_id: int):
        """Get order by ID"""
        from sqlalchemy.orm import selectinload
        return db.query(Order).options(selectinload(Order.order_items)).filter(Order.id == order_id).first()
    
    @staticmethod
    def list_orders(db: Session, user_id: int = None, skip: int = 0, limit: int = 10):
        """List orders"""
        from sqlalchemy.orm import selectinload
        query = db.query(Order).options(selectinload(Order.order_items))
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

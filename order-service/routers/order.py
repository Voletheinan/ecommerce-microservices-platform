"""
Order API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import sys
from config.database import get_db
from config.jwt_auth import get_current_user
from models.schema import OrderCreate, OrderUpdate, Order
from services.order_service import OrderService

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create new order"""
    db_order = OrderService.create_order(db, order)
    return db_order

@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order by ID"""
    order = OrderService.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/")
def list_orders(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), user_id: int = Query(None), db: Session = Depends(get_db)):
    """List orders"""
    orders = OrderService.list_orders(db, user_id=user_id, skip=skip, limit=limit)
    return {"orders": orders, "count": len(orders)}

@router.put("/{order_id}", response_model=Order)
def update_order(order_id: int, order_update: OrderUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update order"""
    order = OrderService.update_order(db, order_id, order_update)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/cancel")
def cancel_order(order_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Cancel order"""
    success = OrderService.cancel_order(db, order_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot cancel order")
    return {"message": "Order cancelled successfully"}

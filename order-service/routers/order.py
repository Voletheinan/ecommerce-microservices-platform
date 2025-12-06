"""
Order API routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
import sys
from config.database import get_db
from config.jwt_auth import get_current_user
from models.schema import OrderCreate, OrderUpdate, Order, OrderItem
from services.order_service import OrderService
import httpx
import os

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8002")
router = APIRouter(prefix="/api/orders", tags=["orders"])

async def fetch_product_name(product_id: str) -> str:
    """Fetch product name from product service"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{PRODUCT_SERVICE_URL}/api/products/{product_id}")
            if response.status_code == 200:
                product = response.json()
                return product.get("name", "Unknown Product")
    except Exception as e:
        print(f"Error fetching product {product_id}: {e}")
    return "Unknown Product"

@router.post("/", response_model=Order)
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create new order"""
    db_order = OrderService.create_order(db, order)
    
    # Convert order items to schema
    items = [
        OrderItem(
            id=item.id,
            order_id=item.order_id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            price=item.price
        )
        for item in db_order.order_items
    ]
    
    return Order(
        id=db_order.id,
        user_id=db_order.user_id,
        total_amount=db_order.total_amount,
        status=db_order.status,
        shipping_address=db_order.shipping_address,
        items=items,
        created_at=db_order.created_at,
        updated_at=db_order.updated_at
    )

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order by ID"""
    order = OrderService.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert order items to schema
    items = [
        OrderItem(
            id=item.id,
            order_id=item.order_id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            price=item.price
        )
        for item in order.order_items
    ]
    
    return Order(
        id=order.id,
        user_id=order.user_id,
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        items=items,
        created_at=order.created_at,
        updated_at=order.updated_at
    )

@router.get("/")
async def list_orders(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), user_id: int = Query(None), db: Session = Depends(get_db)):
    """List orders with items"""
    orders = OrderService.list_orders(db, user_id=user_id, skip=skip, limit=limit)
    
    result_orders = []
    for order in orders:
        items = [
            OrderItem(
                id=item.id,
                order_id=item.order_id,
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                price=item.price
            )
            for item in order.order_items
        ]
        
        result_orders.append(Order(
            id=order.id,
            user_id=order.user_id,
            total_amount=order.total_amount,
            status=order.status,
            shipping_address=order.shipping_address,
            items=items,
            created_at=order.created_at,
            updated_at=order.updated_at
        ))
    
    return {"orders": result_orders, "count": len(result_orders)}

@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: int, order_update: OrderUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update order"""
    order = OrderService.update_order(db, order_id, order_update)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/cancel")
async def cancel_order(order_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Cancel order"""
    success = OrderService.cancel_order(db, order_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot cancel order")
    return {"message": "Order cancelled successfully"}

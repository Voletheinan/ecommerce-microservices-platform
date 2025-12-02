"""
Inventory routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import sys
from config.database import get_db
from config.jwt_auth import get_current_user
from models.schema import InventoryCreate, InventoryUpdate, Inventory
from services.inventory_service import InventoryService

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.post("/", response_model=Inventory)
def create_inventory(inventory: InventoryCreate, db: Session = Depends(get_db)):
    return InventoryService.create_inventory(db, inventory)

@router.get("/{product_id}", response_model=Inventory)
def get_inventory(product_id: str, db: Session = Depends(get_db)):
    inventory = InventoryService.get_inventory(db, product_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@router.put("/{product_id}", response_model=Inventory)
def update_inventory(product_id: str, update: InventoryUpdate, db: Session = Depends(get_db)):
    inventory = InventoryService.update_inventory(db, product_id, update)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@router.get("/{product_id}/check-stock")
def check_stock(product_id: str, quantity: int = Query(...), db: Session = Depends(get_db)):
    available = InventoryService.check_stock(db, product_id, quantity)
    return {"product_id": product_id, "quantity": quantity, "available": available}

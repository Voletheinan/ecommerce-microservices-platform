"""Shipping routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
from config.jwt_auth import get_current_user
from config.database import get_db
from models.schema import ShipmentCreate, Shipment
from services.shipping_service import ShippingService

router = APIRouter(prefix="/api/shipments", tags=["shipping"])

@router.post("/", response_model=Shipment)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db)):
    return ShippingService.create_shipment(db, shipment)

@router.get("/{shipment_id}", response_model=Shipment)
def get_shipment(shipment_id: int, db: Session = Depends(get_db)):
    shipment = ShippingService.get_shipment(db, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.put("/{shipment_id}/status")
def update_status(shipment_id: int, status: str, db: Session = Depends(get_db)):
    shipment = ShippingService.update_status(db, shipment_id, status)
    if not shipment:
        raise HTTPException(status_code=404)
    return shipment

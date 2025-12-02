"""Shipping service"""
from sqlalchemy.orm import Session
import uuid
from models.schema import Shipment
from models.schema import ShipmentCreate
from config.kafka import kafka_service

class ShippingService:
    @staticmethod
    def create_shipment(db: Session, shipment: ShipmentCreate):
        tracking = str(uuid.uuid4())
        db_shipment = Shipment(order_id=shipment.order_id, tracking_number=tracking, carrier=shipment.carrier, estimated_delivery=shipment.estimated_delivery)
        db.add(db_shipment)
        db.commit()
        db.refresh(db_shipment)
        kafka_service.publish_event("shipping-events", {"event": "shipment_created", "order_id": shipment.order_id})
        return db_shipment
    
    @staticmethod
    def get_shipment(db: Session, shipment_id: int):
        return db.query(Shipment).filter(Shipment.id == shipment_id).first()
    
    @staticmethod
    def update_status(db: Session, shipment_id: int, status: str):
        shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if shipment:
            shipment.status = status
            db.commit()
            db.refresh(shipment)
            kafka_service.publish_event("shipping-events", {"event": "shipment_updated", "status": status})
        return shipment

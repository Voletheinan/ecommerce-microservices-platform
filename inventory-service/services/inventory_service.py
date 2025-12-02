"""
Inventory service
"""
from sqlalchemy.orm import Session
from models.schema import Inventory
from models.schema import InventoryCreate, InventoryUpdate
from config.kafka import kafka_service

class InventoryService:
    @staticmethod
    def create_inventory(db: Session, inventory: InventoryCreate):
        db_inventory = Inventory(**inventory.dict())
        db.add(db_inventory)
        db.commit()
        db.refresh(db_inventory)
        return db_inventory
    
    @staticmethod
    def get_inventory(db: Session, product_id: str):
        return db.query(Inventory).filter(Inventory.product_id == product_id).first()
    
    @staticmethod
    def update_inventory(db: Session, product_id: str, update: InventoryUpdate):
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if inventory:
            if update.quantity is not None:
                inventory.quantity = update.quantity
            if update.reserved is not None:
                inventory.reserved = update.reserved
            db.commit()
            db.refresh(inventory)
            kafka_service.publish_event("inventory-events", {
                "event": "inventory_updated",
                "product_id": product_id
            })
        return inventory
    
    @staticmethod
    def check_stock(db: Session, product_id: str, quantity: int):
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if inventory and inventory.quantity - inventory.reserved >= quantity:
            return True
        return False

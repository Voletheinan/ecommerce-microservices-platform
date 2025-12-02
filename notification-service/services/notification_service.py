"""Notification service"""
from sqlalchemy.orm import Session
from models.schema import Notification
from models.schema import NotificationCreate
from config.kafka import kafka_service

class NotificationService:
    @staticmethod
    def create_notification(db: Session, notif: NotificationCreate):
        db_notif = Notification(**notif.dict())
        db.add(db_notif)
        db.commit()
        db.refresh(db_notif)
        kafka_service.publish_event("notification-events", {"event": "notification_created", "user_id": notif.user_id})
        return db_notif
    
    @staticmethod
    def get_user_notifications(db: Session, user_id: int, unread_only: bool = False):
        query = db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.is_read == False)
        return query.all()
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: int):
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
        return notif

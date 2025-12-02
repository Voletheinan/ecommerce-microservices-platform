"""Notification routes"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from config.jwt_auth import get_current_user
from config.database import get_db
from models.schema import NotificationCreate, Notification
from services.notification_service import NotificationService

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.post("/")
def create_notification(notif: NotificationCreate, db: Session = Depends(get_db)):
    return NotificationService.create_notification(db, notif)

@router.get("/")
def get_notifications(current_user: dict = Depends(get_current_user), unread_only: bool = Query(False), db: Session = Depends(get_db)):
    notifs = NotificationService.get_user_notifications(db, int(current_user["user_id"]), unread_only=unread_only)
    return {"notifications": notifs, "count": len(notifs)}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = NotificationService.mark_as_read(db, notification_id)
    if not notif:
        raise HTTPException(status_code=404)
    return notif

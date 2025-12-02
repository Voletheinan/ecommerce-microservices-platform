"""FastAPI Routes (Presentation/Controller Layer)"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(tags=["items"])


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

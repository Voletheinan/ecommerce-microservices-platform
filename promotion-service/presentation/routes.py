"""FastAPI Routes (Presentation/Controller Layer)"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from application.use_cases import PromotionUseCases
from application.dtos import CreatePromotionDTO, PromotionResponseDTO, PromotionListResponseDTO
from infrastructure.repositories import SQLAlchemyPromotionRepository
from config.database import get_db

router = APIRouter(prefix="/api/promotions", tags=["promotions"])


def get_use_cases(db: Session = Depends(get_db)) -> PromotionUseCases:
    """Dependency injection for use cases"""
    repository = SQLAlchemyPromotionRepository(db)
    return PromotionUseCases(repository)


@router.get("/active", response_model=PromotionListResponseDTO)
def list_active_promotions(use_cases: PromotionUseCases = Depends(get_use_cases)):
    """Get active promotions"""
    promotions = use_cases.list_active_promotions()
    return PromotionListResponseDTO(promotions=promotions, count=len(promotions))


@router.get("/", response_model=PromotionListResponseDTO)
def list_all_promotions(use_cases: PromotionUseCases = Depends(get_use_cases)):
    """Get all promotions"""
    promotions = use_cases.list_all_promotions()
    return PromotionListResponseDTO(promotions=promotions, count=len(promotions))


@router.get("/{promotion_id}", response_model=PromotionResponseDTO)
def get_promotion(promotion_id: int, use_cases: PromotionUseCases = Depends(get_use_cases)):
    """Get promotion by ID"""
    promotion = use_cases.get_promotion(promotion_id)
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return promotion


@router.post("/", response_model=PromotionResponseDTO)
def create_promotion(dto: CreatePromotionDTO, use_cases: PromotionUseCases = Depends(get_use_cases)):
    """Create new promotion"""
    try:
        return use_cases.create_promotion(dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{promotion_id}", response_model=PromotionResponseDTO)
def update_promotion(
    promotion_id: int,
    dto: CreatePromotionDTO,
    use_cases: PromotionUseCases = Depends(get_use_cases)
):
    """Update promotion"""
    try:
        promotion = use_cases.update_promotion(promotion_id, dto)
        if not promotion:
            raise HTTPException(status_code=404, detail="Promotion not found")
        return promotion
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{promotion_id}")
def delete_promotion(promotion_id: int, use_cases: PromotionUseCases = Depends(get_use_cases)):
    """Delete promotion"""
    success = use_cases.delete_promotion(promotion_id)
    if not success:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return {"message": "Promotion deleted successfully"}

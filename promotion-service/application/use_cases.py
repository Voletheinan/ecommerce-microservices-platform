"""Application Use Cases (Business Logic)"""
from typing import List, Optional
from domain.promotion import PromotionEntity
from application.dtos import CreatePromotionDTO, PromotionResponseDTO


class PromotionUseCases:
    """Use cases for promotion management"""

    def __init__(self, repository):
        """
        Args:
            repository: PromotionRepository interface
        """
        self.repository = repository

    def create_promotion(self, dto: CreatePromotionDTO) -> PromotionResponseDTO:
        """Create a new promotion"""
        # Validate domain entity
        entity = PromotionEntity(
            name=dto.name,
            description=dto.description,
            discount_percent=dto.discount_percent,
            start_date=dto.start_date,
            end_date=dto.end_date
        )
        entity.is_valid()  # Raises exception if invalid

        # Save to repository
        saved_entity = self.repository.save(entity)
        return self._entity_to_dto(saved_entity)

    def get_promotion(self, promotion_id: int) -> Optional[PromotionResponseDTO]:
        """Get promotion by ID"""
        entity = self.repository.find_by_id(promotion_id)
        return self._entity_to_dto(entity) if entity else None

    def list_all_promotions(self) -> List[PromotionResponseDTO]:
        """Get all promotions"""
        entities = self.repository.find_all()
        return [self._entity_to_dto(e) for e in entities]

    def list_active_promotions(self) -> List[PromotionResponseDTO]:
        """Get only active promotions"""
        entities = self.repository.find_active()
        return [self._entity_to_dto(e) for e in entities]

    def update_promotion(self, promotion_id: int, dto: CreatePromotionDTO) -> Optional[PromotionResponseDTO]:
        """Update a promotion"""
        entity = PromotionEntity(
            id=promotion_id,
            name=dto.name,
            description=dto.description,
            discount_percent=dto.discount_percent,
            start_date=dto.start_date,
            end_date=dto.end_date
        )
        entity.is_valid()

        updated_entity = self.repository.update(entity)
        return self._entity_to_dto(updated_entity) if updated_entity else None

    def delete_promotion(self, promotion_id: int) -> bool:
        """Delete a promotion"""
        return self.repository.delete(promotion_id)

    @staticmethod
    def _entity_to_dto(entity: PromotionEntity) -> PromotionResponseDTO:
        """Convert domain entity to response DTO"""
        return PromotionResponseDTO(
            id=entity.id,
            name=entity.name,
            description=entity.description,
            discount_percent=entity.discount_percent,
            is_active=entity.is_active,
            start_date=entity.start_date,
            end_date=entity.end_date,
            created_at=entity.created_at
        )

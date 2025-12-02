"""Application Use Cases"""
from typing import Optional


class BaseUseCases:
    """Base use cases class"""
    
    def __init__(self, repository):
        self.repository = repository

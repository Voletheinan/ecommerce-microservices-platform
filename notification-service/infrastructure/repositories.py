"""Repository Interfaces and Implementations"""
from abc import ABC, abstractmethod


class BaseRepository(ABC):
    """Abstract base repository"""
    
    @abstractmethod
    def find_all(self):
        pass

    @abstractmethod
    def find_by_id(self, item_id: int):
        pass

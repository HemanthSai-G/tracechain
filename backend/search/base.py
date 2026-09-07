from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from backend.models.schemas import SearchCandidate

class BaseSearchProvider(ABC):
    """
    Abstract Base Class for Web & Reverse Image Search Providers.
    Ensures modularity so visual search engines (SerpAPI Google Lens,
    DuckDuckGo Live Image Search, Google Vision) can be swapped seamlessly.
    """
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def search_method(self) -> str:
        pass

    @abstractmethod
    def search_web(
        self,
        query: Optional[str] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        max_results: int = 5
    ) -> List[Dict[str, Any]]:
        """Perform live visual reverse-image or image-driven web discovery search."""
        pass

    @abstractmethod
    def find_matching_content(
        self,
        query: Optional[str] = None,
        embedding: Optional[List[float]] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        max_results: int = 5
    ) -> List[SearchCandidate]:
        """Find and rank candidate web posts matching the input face/image."""
        pass

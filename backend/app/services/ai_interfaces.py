from abc import ABC, abstractmethod
from typing import List, Dict, Any

class LLMService(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str, history: List[Dict[str, str]]) -> str:
        """Query primary LLM engine with dialog context history."""
        pass

    @abstractmethod
    async def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Perform Named Entity Recognition (NER) for suspects, vehicles, and accounts."""
        pass

class RAGService(ABC):
    @abstractmethod
    async def ingest_document(self, doc_id: str, text: str, metadata: Dict[str, Any]) -> bool:
        """Chunk, embed, and commit text to ChromaDB vector collection."""
        pass

    @abstractmethod
    async def query_relevant_chunks(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Retrieve top semantic search results from ChromaDB."""
        pass

class ForecastEngine(ABC):
    @abstractmethod
    async def predict_crime_rate(self, district: str, time_window_days: int) -> Dict[str, Any]:
        """Query XGBoost forecast model for future incident probability indexes."""
        pass

    @abstractmethod
    async def get_feature_importances(self) -> List[Dict[str, float]]:
        """Explain model prediction factors."""
        pass

class OCRVoiceService(ABC):
    @abstractmethod
    async def transcribe_audio(self, audio_bytes: bytes) -> str:
        """Run whisper model speech-to-text dictation."""
        pass

    @abstractmethod
    async def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        """Run paddleOCR or Tesseract on raw scan document."""
        pass

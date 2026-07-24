import time
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

@celery_app.task(name="tasks.process_evidence_ocr")
def process_evidence_ocr(evidence_id: str, file_path: str) -> str:
    """Mock background OCR task"""
    print(f"[Worker] Initiating OCR Extraction on file: {file_path}")
    time.sleep(4) # Simulate processing
    extracted_text = (
        f"EXTRACTED SCANNED DATA FOR ID {evidence_id}:\n"
        "MULE BANK RECORD SECURED. TARGET TRANSFERS ROUTED TO SBI WALLET *9282."
    )
    print(f"[Worker] OCR Extraction completed for evidence: {evidence_id}")
    return extracted_text

@celery_app.task(name="tasks.generate_vector_embeddings")
def generate_vector_embeddings(document_id: str, text: str) -> bool:
    """Mock vector embedding task"""
    print(f"[Worker] Generating embedding vectors for document {document_id}")
    time.sleep(2)
    print(f"[Worker] Vectors committed to ChromaDB index successfully.")
    return True

@celery_app.task(name="tasks.generate_crime_forecast")
def generate_crime_forecast(district: str) -> dict:
    """Mock time-series XGBoost forecasting run"""
    print(f"[Worker] Running forecasting computations for district: {district}")
    time.sleep(5)
    return {
        "district": district,
        "predicted_spike": True,
        "confidence": 91.2,
        "mitigation_coordinates": "12.9716 N, 77.5946 E"
    }

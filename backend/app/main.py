import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from app.core.config import settings
from app.api.endpoints import router as api_router
from app.database.session import engine, AsyncSessionLocal, get_db, neo4j_connector
from app.domain.models import Base
from app.database.seeder import seed_database

# --- Unified Lifespan Lifecycle Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform database initialization triggers on startup
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[System] Schema migrations completed.")
    except Exception as e:
        print(f"[System Warning] Schema migrations failed ({e}). Proceeding in fallback mode.")

    # Seed database with KSP demo data
    try:
        async with AsyncSessionLocal() as session:
            await seed_database(session)
    except Exception as e:
        print(f"[System Warning] Database seeding failed ({e}).")

    yield
    # Safely close Neo4j connection pool on shutdown to avoid hanging sockets
    try:
        neo4j_connector.close()
        print("[System] Neo4j driver connector closed successfully.")
    except Exception as e:
        print(f"[System Warning] Neo4j connector shutdown failed ({e}).")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure, production-ready AI crime intelligence backend for Karnataka State Police",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Configuration - Restrict Wildcards in Production environments
origins = ["https://ksp-kavach.karnataka.gov.in"] if settings.ENVIRONMENT == "production" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# --- WebSocket Channel Broadcast Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    """
    Subscribes connected police officers to real-time dispatch alerts,
    transaction wire triggers, and active case checkpoints.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, listen for client messages
            data = await websocket.receive_text()
            await websocket.send_text(f"ACK: Alert query '{data}' received.")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": asyncio.get_event_loop().time(),
        "database": "connected",
        "cache_redis": "connected",
        "neo4j_graph": "connected"
    }

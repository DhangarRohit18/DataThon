from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from neo4j import GraphDatabase
import redis.asyncio as redis
from app.core.config import settings

# 1. PostgreSQL SQLAlchemy Async Engine & Session
# Convert postgres url to asyncpg format if needed
postgres_url = settings.DATABASE_URL
if postgres_url.startswith("postgresql://"):
    postgres_url = postgres_url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(postgres_url, pool_pre_ping=True, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# 2. Neo4j Graph Driver
class Neo4jConnector:
    def __init__(self):
        self._driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    def close(self):
        self._driver.close()

    def get_session(self):
        return self._driver.session()

neo4j_connector = Neo4jConnector()

# 3. Redis Async Client
redis_pool = redis.ConnectionPool.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis_client():
    return redis.Redis(connection_pool=redis_pool)

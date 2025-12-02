"""
Database connection utilities
"""
import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
import asyncio
from .settings import (
    MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB,
    MONGODB_URL, MONGODB_DB,
    REDIS_HOST, REDIS_PORT, REDIS_DB
)

# Import motor only when needed to avoid import errors for non-MongoDB services
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    HAS_MOTOR = True
except ImportError:
    HAS_MOTOR = False

# MySQL (Synchronous)
MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
engine = create_engine(MYSQL_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# MySQL (Asynchronous)
MYSQL_ASYNC_URL = f"mysql+aiomysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
async_engine = create_async_engine(MYSQL_ASYNC_URL, echo=False)
AsyncSessionLocal = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

# MongoDB
mongo_client = None
mongo_db = None

async def connect_mongodb():
    """Connect to MongoDB"""
    global mongo_client, mongo_db
    if not HAS_MOTOR:
        print("Motor not available, skipping MongoDB connection")
        return
    mongo_client = AsyncIOMotorClient(MONGODB_URL)
    mongo_db = mongo_client[MONGODB_DB]
    print("Connected to MongoDB")

async def close_mongodb():
    """Close MongoDB connection"""
    if mongo_client:
        mongo_client.close()
        print("Closed MongoDB connection")

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    """Get async database session"""
    async with AsyncSessionLocal() as session:
        yield session

# Redis
redis_client = None

def get_redis_client():
    """Get or create Redis client"""
    global redis_client
    if redis_client is None:
        redis_client = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            decode_responses=True
        )
    return redis_client

def get_mongodb():
    """Get MongoDB database"""
    return mongo_db

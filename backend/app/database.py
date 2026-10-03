from os import environ

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

DATABASE_URL = environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/medflow_dev"
)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)

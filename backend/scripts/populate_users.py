import asyncio
from app.models.user import User
from app.security import hash_password

from app.dependencies import AsyncSessionLocal
from app.models.enums import UserRole

async def create_users():
    async with AsyncSessionLocal() as session:
        session.add_all([
            User(
                username="admin", 
                hashed_password=hash_password("password"), 
                role=UserRole.CLINICAL_ADMIN
            ),
            User(
                username="technician",
                hashed_password=hash_password("password"),
                role=UserRole.FIELD_TECHNICIAN
            ),
            User(
                username="auditor",
                hashed_password=hash_password("password"),
                role=UserRole.AUDITOR
            )
        ])
        await session.commit()

if __name__ == "__main__":
    asyncio.run(create_users())

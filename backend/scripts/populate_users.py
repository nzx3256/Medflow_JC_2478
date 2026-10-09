import asyncio
from app.models.user import User
from app.security import hash_password

from app.dependencies import AsyncSessionLocal
from app.models.enums import UserRole

import os

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "myAdminPassword1234!")
TECHNICIAN_PASSWORD = os.environ.get("TECHNICIAN_PASSWORD", "techPassword1234!")

async def create_users():
    async with AsyncSessionLocal() as session:
        session.add_all([
            User(
                username="admin", 
                hashed_password=hash_password(ADMIN_PASSWORD),
                role=UserRole.CLINICAL_ADMIN
            ),
            User(
                username="technician",
                hashed_password=hash_password(TECHNICIAN_PASSWORD),
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

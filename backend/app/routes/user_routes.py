from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_role
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user_schema import UserRead

router = APIRouter(prefix="/users", tags=["users"])

@router.get(path="", response_model=list[UserRead])
async def get_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> list[User]:
    results = await db.execute(select(User))
    return list(results.scalars().all())

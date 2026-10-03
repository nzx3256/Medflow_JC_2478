from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import AsyncSessionLocal
from app.models import UserRole, User
from app.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

unauthorized = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"},
)

def copyException(ex):
    res = HTTPException(
        status_code=ex.status_code,
        detail=ex.detail,
        headers=ex.headers
    )
    return res

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = decode_access_token(token)
        if payload is None:
            print("\033[31mpayload is None\033[0m")
            raise unauthorized
        username = payload["sub"]
        if username is None:
            print("\033[31musername is None\033[0m")
            raise unauthorized
    except:
        C = copyException(unauthorized)
        C.detail = f"{C.detail}: C"
        raise C
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        D = copyException(unauthorized)
        D.detail = f"{D.detail}: D"
        raise D
    return user

def require_role(*required_roles: UserRole):
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in required_roles:
            E = copyException(unauthorized)
            E.detail = f"{E.detail}: E"
            raise E
        return current_user
    return role_checker

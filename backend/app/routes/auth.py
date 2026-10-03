from enum import verify

from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserRead, Token
from app.dependencies import get_db, require_role
from app.security import encode_access_token, decode_access_token, verifypassword, hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post(path="/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
) -> Token:
    result = await db.execute(
        select(User)
        .where(User.username == form_data.username)
    )
    user = result.scalar_one_or_none()
    if user is None or not verifypassword(plain_pw=form_data.password, hashed_pw=user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = encode_access_token({"sub":user.username, "role":user.role.value})
    return Token(access_token=token,token_type="bearer")

@router.post(path="/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate, 
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> User:
    result = await db.execute(
        select(User)
        .where(User.username == payload.username)
    )
    user = result.scalar_one_or_none()
    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"}
        )
    user = User(
        username=payload.username, 
        hashed_password=hash_password(payload.password),
        role=payload.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, UserRole, Technician
from app.dependencies import get_current_user, get_db, require_role
from app.schemas import technician_schema
from app.schemas.technician_schema import TechnicianCreate, TechnicianRead, TechnicianUpdate

router = APIRouter(prefix="/technicians", tags=["technicians"])

@router.get(path="", response_model=list[TechnicianRead])
async def get_technicians(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[Technician]:
    results = await db.execute(select(Technician))
    return list(results.scalars().all())

@router.get(path="/{technician_id}", response_model=TechnicianRead)
async def get_technician_byId(
    technician_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> Technician:
    technician = await db.get(Technician, technician_id)
    if technician is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No technician with id {technician_id}"
        )
    return technician

@router.post(path="", response_model=TechnicianRead)
async def create_technician(
    payload: TechnicianCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> Technician:
    technician = Technician(**payload.model_dump())
    db.add(technician)
    await db.commit()
    await db.refresh(technician)
    return technician

@router.patch(path="/{technician_id}", response_model=TechnicianRead)
async def update_technician(
    technician_id: int,
    payload: TechnicianUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> Technician:
    technician = await db.get(Technician, technician_id)
    if technician is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No technician with id {technician_id}"
        )
    data = payload.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in data.items():
        setattr(technician, field, value)
    await db.commit()
    await db.refresh(technician)
    return technician

@router.delete(path="/{technician_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_technician(
    technician_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> None:
    technician = await db.get(Technician, technician_id)
    if technician is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No technician with id {technician_id}"
        )
    await db.delete(technician)
    await db.commit()

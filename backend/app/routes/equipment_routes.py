from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import case, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db, require_role
from app.models.enums import UserRole, WorkOrderStatus
from app.models.orm_tables import Equipment, WorkOrder
from app.models.user import User
from app.schemas.equipment_schema import EquipmentCreate, EquipmentRead, EquipmentUpdate, ReliabilityMetricsRead

router = APIRouter(prefix="/equipment", tags=["equipment"])

@router.get(path="", response_model=list[EquipmentRead])
async def get_equipment(
    threshold: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[Equipment]:
    stmt = select(Equipment)
    if threshold is not None:
        stmt = stmt.where(Equipment.charge_level < threshold)
    results = await db.execute(stmt)
    return list(results.scalars().all())

@router.get(path="/reliability_metrics")
async def get_reliability_metrics(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[ReliabilityMetricsRead]:
    complete = (func.sum(
        case((WorkOrder.status == WorkOrderStatus.COMPLETED, 1), else_=0)
    ))
    fail = (func.sum(
        case((WorkOrder.status == WorkOrderStatus.FAILED, 1), else_=0)
    ))
    stmt = (
        select(
            Equipment.model.label("equipment_model"),
            func.concat(complete, ":", fail).label("reliability_ratio")
        )
        .join(WorkOrder, Equipment.id == WorkOrder.equipment_id)
        .group_by(Equipment.model)
    )
    results = await db.execute(stmt)
    return [ReliabilityMetricsRead.model_validate(result) for result in results]

@router.get(path="/{equipment_id}", response_model=EquipmentRead)
async def get_equipment_byId(
    equipment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> Equipment:
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No equipment with id {equipment_id}"
        )
    return equipment

@router.post(path="", response_model=EquipmentRead)
async def create_equipment(
    payload: EquipmentCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> Equipment:
    equipment = Equipment(**payload.model_dump())
    db.add(equipment)
    await db.commit()
    await db.refresh(equipment)
    return equipment

@router.patch(path="/{equipment_id}", response_model=EquipmentRead)
async def update_equipment(
    equipment_id: int,
    partial: EquipmentUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> Equipment:
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No equipment with id {equipment_id}"
        )
    data = partial.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in data.items():
        setattr(equipment, field, value)
    await db.commit()
    await db.refresh(equipment)
    return equipment

@router.delete(path="/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment(
    equipment_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> None:
    equipment = await db.get(Equipment, equipment_id)
    if equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No equipment with id {equipment_id}"
        )
    await db.delete(equipment)
    await db.commit()

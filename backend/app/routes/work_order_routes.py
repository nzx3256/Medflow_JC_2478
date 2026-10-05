from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import Float, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, require_role
from app.models import Equipment, Technician, WorkOrder, User, UserRole
from app.models.enums import EquipmentStatus, WorkOrderPriority
from app.models.orm_tables import Hospital
from app.schemas.hospital_schema import MaintenanceFlagsRead, ReportingLinesRead
from app.schemas.work_order_schema import DiscrepancyRead, WorkOrderCreate, WorkOrderRead, WorkOrderUpdate

router = APIRouter(prefix="/work_orders", tags=["work orders"])

@router.get(path="", response_model=list[WorkOrderRead])
async def get_work_orders(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[WorkOrder]:
    results = await db.execute(select(WorkOrder))
    return list(results.scalars().all())

@router.get(path="/discrepancies", response_model=list[DiscrepancyRead])
async def get_colocation_discrepancies(
    priority: WorkOrderPriority | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[DiscrepancyRead]:
    stmt = (
        select(
            WorkOrder.id.label("work_order_id"),
            WorkOrder.title.label("work_order_title"),
            WorkOrder.equipment_id,
            WorkOrder.technician_id
        )
        .join(Equipment, Equipment.id == WorkOrder.equipment_id)
        .join(Technician, Technician.id == WorkOrder.technician_id)
        .where(Equipment.hospital_id != Technician.hospital_id)
    )
    if priority is not None:
        stmt = stmt.where(WorkOrder.priority == priority)
    results = await db.execute(stmt)
    return [DiscrepancyRead.model_validate(result) for result in results]

@router.get(path="/{work_order_id}", response_model=WorkOrderRead)
async def get_work_order_byId(
    work_order_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> WorkOrder:
    work_order = await db.get(WorkOrder, work_order_id)
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No work order with id {work_order_id}"
        )
    return work_order

@router.post(path="", response_model=WorkOrderRead)
async def create_work_order(
    payload: WorkOrderCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> WorkOrder:
    work_order = WorkOrder(**payload.model_dump())
    db.add(work_order)
    await db.commit()
    await db.refresh(work_order)
    return work_order

@router.patch(path="/{work_order_id}", response_model=WorkOrderRead)
async def update_work_order(
    work_order_id: int,
    partial: WorkOrderUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> WorkOrder:
    work_order = await db.get(WorkOrder, work_order_id)
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No work order with id {work_order_id}"
        )
    data = partial.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in data.items():
        setattr(work_order, field, value)
    await db.commit()
    await db.refresh(work_order)
    return work_order

@router.delete(path="/{work_order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_order(
    work_order_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> None:
    work_order = await db.get(WorkOrder, work_order_id)
    if work_order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No work order with id {work_order_id}"
        )
    await db.delete(work_order)
    await db.commit()

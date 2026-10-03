from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy import Float, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, Hospital, UserRole
from app.models.enums import EquipmentStatus
from app.models.orm_tables import Equipment, Technician, WorkOrder
from app.schemas.hospital_schema import HospitalCreate, HospitalRead, HospitalUpdate, MaintenanceFlagsRead, ReportingLinesRead
from app.dependencies import get_current_user, get_db, require_role

router = APIRouter(prefix="/hospitals", tags=["hospitals"])

@router.get(path="", response_model=list[HospitalRead])
async def get_hospitals(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[Hospital]:
    results = await db.execute(select(Hospital))
    return list(results.scalars().all())

@router.get("/maintenance_flags", response_model=list[MaintenanceFlagsRead])
async def get_maintenance_flags(
    threshold: float,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[MaintenanceFlagsRead]:
    maintenance_count = (
        func.count(case((Equipment.status == EquipmentStatus.MAINTENANCE, 1))).cast(Float)
    )
    percentage_field = maintenance_count/func.count(Equipment.id)*100
    stmt = (
        select(
            Hospital.id.label("hospital_id"),
            Hospital.name.label("hospital_name"),
            percentage_field.label("percent_maintenance"),
        )
        .join(Equipment)
        .group_by(Hospital.name, Hospital.id)
        .having(percentage_field >= threshold)
    )
    results = await db.execute(stmt)
    return [MaintenanceFlagsRead.model_validate(result)
            for result in results.mappings().all()]

@router.get("/reporting_lines", response_model=list[ReportingLinesRead])
async def get_reporting_lines(
    supervisor_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[ReportingLinesRead]:
    stmt = (
        select(
            Technician.id.label("technician_id"),
            Technician.full_name.label("technician_name"),
            func.count(WorkOrder.id).label("active_orders"),
            Hospital.supervisor_id
        )
        .join(Hospital, Hospital.id == Technician.hospital_id)
        .join(WorkOrder, WorkOrder.technician_id == Technician.id)
        .where(
            Hospital.supervisor_id == supervisor_id,
            WorkOrder.status.in_(["Pending", "In-Progress"]),
        )
        .group_by(Technician.id, Technician.full_name, Hospital.supervisor_id)
        .order_by(Technician.id)
    )
    results = await db.execute(stmt)
    return [ReportingLinesRead.model_validate(result)
            for result in results.mappings().all()]

@router.get(path="/{hospital_id}", response_model=HospitalRead)
async def get_hospital_byId(
    hospital_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> Hospital:
    hospital = await db.get(Hospital, hospital_id)
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No hospital with id {hospital_id}"
        )
    return hospital

@router.post(path="", response_model=HospitalRead)
async def create_hospital(
    payload: HospitalCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> Hospital:
    hospital = Hospital(**payload.model_dump())
    db.add(hospital)
    await db.commit()
    await db.refresh(hospital)
    return hospital

@router.patch(path="/{hospital_id}", response_model=HospitalRead)
async def update_hospital(
    hospital_id: int,
    partial: HospitalUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> Hospital | None:
    hospital = await db.get(Hospital, hospital_id)
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No hospital with id {hospital_id}"
        )
    data = partial.model_dump(exclude_unset=True,exclude_none=True)
    for field, value in data.items():
        setattr(hospital, field, value)
    await db.commit()
    await db.refresh(hospital)
    return hospital

@router.delete(path="/{hospital_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hospital(
    hospital_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN))
) -> None:
    hospital = await db.get(Hospital, hospital_id)
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No hospital with id {hospital_id}"
        )
    await db.delete(hospital)
    await db.commit()

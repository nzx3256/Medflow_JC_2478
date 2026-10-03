from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, UserRole, ServiceReport
from app.schemas.service_report_schema import ServiceReportCreate, ServiceReportRead, ServiceReportUpdate
from app.dependencies import get_current_user, get_db, require_role

router = APIRouter(prefix="/service_reports", tags=["service report"])

@router.get(path="", response_model=list[ServiceReportRead])
async def get_service_reports(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> list[ServiceReport]:
    results = await db.execute(select(ServiceReport))
    return list(results.scalars().all())

@router.get(path="/{service_report_id}", response_model=ServiceReportRead)
async def get_service_report_byId(
    service_report_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user)
) -> ServiceReport:
    service_report = await db.get(ServiceReport, service_report_id)
    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No service report with id {service_report_id}"
        )
    return service_report

@router.post(path="", response_model=ServiceReportRead)
async def create_service_report(
    payload: ServiceReportCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> ServiceReport:
    service_report = ServiceReport(**payload.model_dump())
    db.add(service_report)
    await db.commit()
    await db.refresh(service_report)
    return service_report

@router.patch(path="/{service_report_id}", response_model=ServiceReportRead)
async def update_service_report(
    service_report_id: int,
    partial: ServiceReportUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> ServiceReport:
    service_report = await db.get(ServiceReport, service_report_id)
    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No service report with id {service_report_id}"
        )
    data = partial.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in data.items():
        setattr(service_report, field, value)
    await db.commit()
    await db.refresh(service_report)
    return service_report

@router.delete(path="/{service_report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service_report(
    service_report_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_role(UserRole.CLINICAL_ADMIN, UserRole.FIELD_TECHNICIAN))
) -> None:
    service_report = await db.get(ServiceReport, service_report_id)
    if service_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No service report with id {service_report_id}"
        )
    await db.delete(service_report)
    await db.commit()

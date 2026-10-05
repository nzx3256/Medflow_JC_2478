from datetime import datetime
from typing import List

from sqlalchemy import ForeignKey, Identity, func, \
    Integer, String, Text, Float, DateTime, Enum as sql_enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.enums import EquipmentStatus, WorkOrderPriority, WorkOrderStatus

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class Hospital(Base):
    __tablename__ = "hospitals"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    location_region: Mapped[str] = mapped_column(String(150))
    capacity: Mapped[int] = mapped_column(Integer)
    supervisor_id: Mapped[int] = mapped_column(Integer)

    equipments: Mapped[List["Equipment"]] = relationship(back_populates="hospital", cascade="save-update, merge, delete, delete-orphan")
    technicians: Mapped[List["Technician"]] = relationship(back_populates="hospital", cascade="save-update, merge, delete, delete-orphan")

class Equipment(Base):
    __tablename__ = "equipment"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(150))
    model: Mapped[str] = mapped_column(String(150))
    status: Mapped["EquipmentStatus"] = mapped_column(
        sql_enum(
            EquipmentStatus,
            values_callable=lambda enum_cls: [s.value for s in enum_cls],
            name="equipment_status"
        )
    )
    charge_level: Mapped[float] = mapped_column(Float)
    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id", ondelete="CASCADE"))

    hospital: Mapped["Hospital"] = relationship(back_populates="equipments")
    work_orders: Mapped[List["WorkOrder"]] = relationship(back_populates="equipment")

class Technician(Base):
    __tablename__ = "technicians"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200))
    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id", ondelete="CASCADE"))

    hospital: Mapped["Hospital"] = relationship(back_populates="technicians")
    work_orders: Mapped[List["WorkOrder"]] = relationship(back_populates="technician")

class WorkOrder(Base):
    __tablename__ = "work_orders"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    priority: Mapped["WorkOrderPriority"] = mapped_column(
        sql_enum(
            WorkOrderPriority,
            values_callable=lambda enum_cls: [prio.value for prio in enum_cls],
            name="work_order_priority"
        )
    )
    status: Mapped["WorkOrderStatus"] = mapped_column(
        sql_enum(
            WorkOrderStatus,
            values_callable=lambda enum_cls: [s.value for s in enum_cls],
            name="work_order_status"
        )
    )
    equipment_id: Mapped[int] = mapped_column(ForeignKey("equipment.id", ondelete="SET NULL"), nullable=True)
    technician_id: Mapped[int] = mapped_column(ForeignKey("technicians.id", ondelete="SET NULL"), nullable=True)

    equipment: Mapped["Equipment"] = relationship(back_populates="work_orders")
    technician: Mapped["Technician"] = relationship(back_populates="work_orders")
    service_reports: Mapped[List["ServiceReport"]] = relationship(back_populates="work_order", cascade="save-update, merge, delete, delete-orphan")

class ServiceReport(Base):
    __tablename__ = "service_reports"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True)
    file_url: Mapped[str] = mapped_column(Text)
    notes: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    work_order_id: Mapped[int] = mapped_column(ForeignKey("work_orders.id", ondelete="CASCADE"))

    work_order: Mapped["WorkOrder"] = relationship(back_populates="service_reports")

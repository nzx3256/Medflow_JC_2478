from pydantic import Field, ConfigDict, BaseModel

from app.models.enums import WorkOrderPriority, WorkOrderStatus

class WorkOrderBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    priority: WorkOrderPriority
    status: WorkOrderStatus
    equipment_id: int | None = Field(default=None)
    technician_id: int | None = Field(default=None)

class WorkOrderRead(WorkOrderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class WorkOrderCreate(WorkOrderBase):
    pass

class WorkOrderUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    priority: WorkOrderPriority | None = Field(default=None)
    status: WorkOrderStatus | None = Field(default=None)
    equipment_id: int | None = Field(default=None)
    technician_id: int | None = Field(default=None)

class DiscrepancyRead(BaseModel):
    work_order_id: int
    work_order_title: str
    equipment_id: int
    technician_id: int
    model_config = ConfigDict(from_attributes=True)


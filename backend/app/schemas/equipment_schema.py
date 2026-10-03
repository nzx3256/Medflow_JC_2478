from pydantic import ConfigDict, Field, BaseModel

from app.models.enums import EquipmentStatus

class EquipmentBase(BaseModel):
    serial_number: str = Field(min_length=1,max_length=150)
    model: str = Field(min_length=1, max_length=150)
    status: EquipmentStatus
    charge_level: float = Field(ge=0, le=100)
    hospital_id: int

class EquipmentRead(EquipmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    serial_number: str | None = Field(default=None, min_length=1,max_length=150)
    model: str | None = Field(default=None, min_length=1, max_length=150)
    status: EquipmentStatus | None = Field(default=None)
    charge_level: float | None = Field(default=None, ge=0, le=100)
    hospital_id: int | None = Field(default=None)

class ReliabilityMetricsRead(BaseModel):
    equipment_model: str
    reliability_ratio: str
    model_config = ConfigDict(from_attributes=True)

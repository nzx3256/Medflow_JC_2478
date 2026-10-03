from pydantic import BaseModel, ConfigDict, Field

class HospitalBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    location_region: str = Field(min_length=1, max_length=150)
    capacity: int
    supervisor_id: int

class HospitalRead(HospitalBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HospitalCreate(HospitalBase):
    pass

class HospitalUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    location_region: str | None = Field(default=None, min_length=1, max_length=150)
    capacity: int | None = None
    supervisor_id: int | None = None

class MaintenanceFlagsRead(BaseModel):
    hospital_id: int
    hospital_name: str = Field(min_length=1, max_length=100)
    percent_maintenance: float
    model_config = ConfigDict(from_attributes=True)

class ReportingLinesRead(BaseModel):
    technician_id: int
    technician_name: str
    active_orders: int
    supervisor_id: int
    model_config = ConfigDict(from_attributes=True)


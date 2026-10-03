from datetime import datetime

from pydantic import Field, ConfigDict, BaseModel

class ServiceReportBase(BaseModel):
    file_url: str = Field(min_length=1)
    notes: str = Field(min_length=1, max_length=500)
    created_at: datetime
    work_order_id: int

class ServiceReportRead(ServiceReportBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ServiceReportCreate(ServiceReportBase):
    pass

class ServiceReportUpdate(BaseModel):
    file_url: str | None = Field(default=None, min_length=1)
    notes: str | None = Field(default=None, min_length=1, max_length=500)
    created_at: datetime | None = Field(default=None)
    work_order_id: int | None = Field(default=None)

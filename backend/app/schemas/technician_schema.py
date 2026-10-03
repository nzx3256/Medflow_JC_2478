from pydantic import ConfigDict, Field, BaseModel

class TechnicianBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    hospital_id: int

class TechnicianRead(TechnicianBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TechnicianCreate(TechnicianBase):
    pass

class TechnicianUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    hospital_id: int | None = Field(default=None)

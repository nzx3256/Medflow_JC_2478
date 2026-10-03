from pydantic import BaseModel, Field, ConfigDict

from app.models.enums import UserRole

class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    role: UserRole

class UserRead(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

from sqlalchemy import Boolean, Identity, Integer, String, Text, Enum as sql_enum
from sqlalchemy.orm import Mapped, mapped_column

from app.models.enums import UserRole

from .orm_tables import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, Identity(), primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50))
    hashed_password: Mapped[str] = mapped_column(Text)
    role: Mapped["UserRole"] = mapped_column(
        sql_enum(
            UserRole, name="user_role",
            values_callable=lambda enum_cls: [role.value for role in enum_cls],
        )
    )
    #is_active: Mapped[bool] = mapped_column(Boolean, default=True)

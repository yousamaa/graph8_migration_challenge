from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.base import TimestampMixin
class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationOut(OrganizationBase, TimestampMixin):
    id: str

    class Config:
        from_attributes = True
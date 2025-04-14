from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.base import TimestampMixin

class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None

class ContactCreate(ContactBase):
    organization_id: Optional[str] = None

class ContactOut(ContactBase, TimestampMixin):
    id: str
    organization_id: Optional[str] = None

    class Config:
        from_attributes = True
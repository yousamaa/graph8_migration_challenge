from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TimestampMixin(BaseModel):
    deleted_at: Optional[datetime] = None
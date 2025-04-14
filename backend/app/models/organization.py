from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4

from app.db.session import Base
from app.models.mixins.soft_delete import SoftDeleteMixin
class Organization(Base, SoftDeleteMixin):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)

    contacts = relationship("Contact", back_populates="organization", cascade="all, delete-orphan")
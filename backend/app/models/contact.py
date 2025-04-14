from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4

from app.db.session import Base
from app.models.mixins.soft_delete import SoftDeleteMixin

class Contact(Base, SoftDeleteMixin):
    __tablename__ = "contacts"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String)

    organization = relationship("Organization", back_populates="contacts")
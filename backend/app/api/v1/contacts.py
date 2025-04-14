from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.deps import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactOut, ContactCreate

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.get("/", response_model=List[ContactOut])
def list_contacts(
    search: Optional[str] = Query(None),
    trashed: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Contact)

    if trashed == "only":
        query = query.filter(Contact.deleted_at.isnot(None))
    elif trashed == "with":
        pass  # include all
    else:
        query = query.filter(Contact.deleted_at.is_(None))

    if search:
        query = query.filter(
            (Contact.first_name.ilike(f"%{search}%")) |
            (Contact.last_name.ilike(f"%{search}%")) |
            (Contact.email.ilike(f"%{search}%"))
        )

    return query.all()


@router.post("/", response_model=ContactOut)
def create_contact(contact_in: ContactCreate, db: Session = Depends(get_db)):
    contact = Contact(**contact_in.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/{contact_id}", response_model=ContactOut)
def get_contact(contact_id: str, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/{contact_id}", response_model=ContactOut)
def update_contact(contact_id: str, contact_in: ContactCreate, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    for key, value in contact_in.dict().items():
        setattr(contact, key, value)

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}")
def soft_delete_contact(contact_id: str, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact.soft_delete()
    db.commit()
    return {"detail": "Contact deleted"}


@router.put("/{contact_id}/restore")
def restore_contact(contact_id: str, db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact.restore()
    db.commit()
    return {"detail": "Contact restored"}
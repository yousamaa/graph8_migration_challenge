from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.deps import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationOut, OrganizationCreate

router = APIRouter()
@router.get("/organizations", response_model=List[OrganizationOut])
def list_organizations(
    search: Optional[str] = Query(None),
    trashed: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Organization)

    if trashed == "only":
        query = query.filter(Organization.deleted_at.isnot(None))
    elif trashed != "with":
        query = query.filter(Organization.deleted_at.is_(None))

    if search:
        query = query.filter(Organization.name.ilike(f"%{search}%"))

    return query.order_by(Organization.name).all()


@router.post("/organizations", response_model=OrganizationOut)
def create_organization(org_in: OrganizationCreate, db: Session = Depends(get_db)):
    org = Organization(**org_in.dict())
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


@router.put("/organizations/{org_id}", response_model=OrganizationOut)
def update_organization(org_id: str, org_in: OrganizationCreate, db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    for key, value in org_in.dict().items():
        setattr(org, key, value)
    db.commit()
    db.refresh(org)
    return org


@router.delete("/organizations/{org_id}")
def delete_organization(org_id: str, db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    org.soft_delete()
    db.commit()
    return {"detail": "Organization deleted"}


@router.put("/organizations/{org_id}/restore")
def restore_organization(org_id: str, db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    org.restore()
    db.commit()
    return {"detail": "Organization restored"}

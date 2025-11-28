from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Email, ActionItem
from typing import List

router = APIRouter()

@router.get("/")
async def get_emails(db: Session = Depends(get_db)):
    return db.query(Email).all()

@router.get("/{email_id}")
async def get_email(email_id: int, db: Session = Depends(get_db)):
    return db.query(Email).filter(Email.id == email_id).first()

@router.get("/{email_id}/actions")
async def get_email_actions(email_id: int, db: Session = Depends(get_db)):
    """Get action items for a specific email"""
    actions = db.query(ActionItem).filter(ActionItem.email_id == email_id).all()
    return actions

@router.get("/actions/all")
async def get_all_actions(db: Session = Depends(get_db)):
    """Get all action items across all emails"""
    actions = db.query(ActionItem).all()
    return actions

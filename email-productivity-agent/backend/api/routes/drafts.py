from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Draft, Email
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class DraftCreate(BaseModel):
    email_id: Optional[int] = None
    subject: str
    body: str
    recipient: str
    meta_data: Optional[dict] = None

class DraftUpdate(BaseModel):
    subject: Optional[str] = None
    body: Optional[str] = None
    recipient: Optional[str] = None
    meta_data: Optional[dict] = None

@router.get("/")
async def get_drafts(db: Session = Depends(get_db)):
    """Get all drafts"""
    drafts = db.query(Draft).all()
    return drafts

@router.get("/{draft_id}")
async def get_draft(draft_id: int, db: Session = Depends(get_db)):
    """Get a specific draft"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft

@router.post("/")
async def create_draft(draft_data: DraftCreate, db: Session = Depends(get_db)):
    """Create a new draft"""
    new_draft = Draft(
        email_id=draft_data.email_id,
        subject=draft_data.subject,
        body=draft_data.body,
        recipient=draft_data.recipient,
        meta_data=draft_data.meta_data,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_draft)
    db.commit()
    db.refresh(new_draft)
    return new_draft

@router.put("/{draft_id}")
async def update_draft(draft_id: int, draft_data: DraftUpdate, db: Session = Depends(get_db)):
    """Update an existing draft"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    if draft_data.subject is not None:
        draft.subject = draft_data.subject
    if draft_data.body is not None:
        draft.body = draft_data.body
    if draft_data.recipient is not None:
        draft.recipient = draft_data.recipient
    if draft_data.meta_data is not None:
        draft.meta_data = draft_data.meta_data
    
    draft.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(draft)
    return draft

@router.delete("/{draft_id}")
async def delete_draft(draft_id: int, db: Session = Depends(get_db)):
    """Delete a draft"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    
    db.delete(draft)
    db.commit()
    return {"message": "Draft deleted successfully"}

@router.post("/generate")
async def generate_draft(
    email_id: int,
    instruction: Optional[str] = "Write a professional reply",
    db: Session = Depends(get_db)
):
    """Generate a draft reply for an email using AI"""
    from backend.services.llm_service import llm_service
    from backend.database.models import Prompt
    
    # Get the email
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Get auto-reply prompt
    auto_reply_prompt = db.query(Prompt).filter(
        Prompt.type == "auto_reply",
        Prompt.is_active == True
    ).first()
    
    # Construct the prompt
    if auto_reply_prompt:
        prompt = f"""{auto_reply_prompt.content}

Original Email:
From: {email.sender}
Subject: {email.subject}
Body: {email.body}

User Instruction: {instruction}

Generate a draft reply with Subject and Body. Format:
Subject: [your subject]
Body: [your message]"""
    else:
        prompt = f"""Write a professional reply to this email:

From: {email.sender}
Subject: {email.subject}
Body: {email.body}

User Instruction: {instruction}

Format:
Subject: [your subject]
Body: [your message]"""
    
    # Generate draft using LLM
    response = await llm_service.generate(prompt)
    
    # Parse response to extract subject and body
    lines = response.strip().split('\n')
    subject = "Re: " + email.subject
    body = response
    
    # Try to extract subject and body if formatted correctly
    if "Subject:" in response:
        parts = response.split("Body:", 1)
        if len(parts) == 2:
            subject = parts[0].replace("Subject:", "").strip()
            body = parts[1].strip()
    
    # Create draft
    draft = Draft(
        email_id=email_id,
        subject=subject,
        body=body,
        recipient=email.sender,
        meta_data={"generated": True, "instruction": instruction},
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    
    return draft

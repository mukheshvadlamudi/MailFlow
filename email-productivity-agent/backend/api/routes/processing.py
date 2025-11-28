from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Email
from backend.services.email_processor import email_processor

router = APIRouter()

@router.post("/process-all")
async def process_all_emails(db: Session = Depends(get_db)):
    """Process all unprocessed emails"""
    emails = db.query(Email).filter(Email.processed == False).all()
    
    processed_count = 0
    for email in emails:
        await email_processor.process_email(email, db)
        processed_count += 1
    
    return {
        "message": f"Processed {processed_count} emails",
        "count": processed_count
    }

@router.post("/process/{email_id}")
async def process_single_email(email_id: int, db: Session = Depends(get_db)):
    """Process a single email"""
    email = db.query(Email).filter(Email.id == email_id).first()
    
    if not email:
        return {"error": "Email not found"}
    
    await email_processor.process_email(email, db)
    
    return {
        "message": "Email processed successfully",
        "email_id": email_id,
        "category": email.category
    }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Email
from backend.services.llm_service import llm_service
from pydantic import BaseModel


router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    email_id: int = None


@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # Get all emails for context
    emails = db.query(Email).all()
    
    # Build context with email data
    email_context = "YOUR EMAILS:\n"
    for i, email in enumerate(emails, 1):
        email_context += f"\n[Email {i}]\n"
        email_context += f"From: {email.sender}\n"
        email_context += f"Subject: {email.subject}\n"
        email_context += f"Body: {email.body}\n"
        email_context += f"Priority: {email.priority}\n"
    
    # If specific email_id is provided, add more detail
    if request.email_id:
        specific_email = db.query(Email).filter(Email.id == request.email_id).first()
        if specific_email:
            email_context += f"\n[FOCUSED EMAIL]\n"
            email_context += f"From: {specific_email.sender}\n"
            email_context += f"Subject: {specific_email.subject}\n"
            email_context += f"Body: {specific_email.body}\n"
    
    # Combine with strict instructions for direct responses
    full_prompt = f"""{email_context}

USER REQUEST: {request.query}

INSTRUCTIONS: Be direct and concise. No preambles like "Here's a reply" or "I suggest" or "Here is". 
If drafting an email reply, output ONLY:
To: [email]
Subject: [subject]
Body: [message]

For summaries or questions, answer directly without introductory phrases. Start with the actual content immediately."""
    
    # Generate response
    response = await llm_service.generate(full_prompt)
    return {"response": response}

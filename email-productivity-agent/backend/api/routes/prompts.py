from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.database.models import Prompt
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PromptCreate(BaseModel):
    name: str
    type: str
    content: str
    is_active: bool = True

class PromptUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/")
async def get_prompts(db: Session = Depends(get_db)):
    prompts = db.query(Prompt).all()
    return prompts

@router.get("/{prompt_id}")
async def get_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt

@router.post("/")
async def create_prompt(prompt_data: PromptCreate, db: Session = Depends(get_db)):
    new_prompt = Prompt(
        name=prompt_data.name,
        type=prompt_data.type,
        content=prompt_data.content,
        is_active=prompt_data.is_active
    )
    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)
    return new_prompt

@router.put("/{prompt_id}")
async def update_prompt(prompt_id: int, prompt_data: PromptUpdate, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    if prompt_data.name is not None:
        prompt.name = prompt_data.name
    if prompt_data.type is not None:
        prompt.type = prompt_data.type
    if prompt_data.content is not None:
        prompt.content = prompt_data.content
    if prompt_data.is_active is not None:
        prompt.is_active = prompt_data.is_active
    
    db.commit()
    db.refresh(prompt)
    return prompt

@router.delete("/{prompt_id}")
async def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    db.delete(prompt)
    db.commit()
    return {"message": "Prompt deleted successfully"}

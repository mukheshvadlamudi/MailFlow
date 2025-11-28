from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Email(Base):
    __tablename__ = "emails"
    id = Column(Integer, primary_key=True)
    sender = Column(String(255), nullable=False)
    recipient = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    category = Column(String(100))
    priority = Column(String(50), default="medium")
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    action_items = relationship("ActionItem", back_populates="email", cascade="all, delete-orphan")
    drafts = relationship("Draft", back_populates="email", cascade="all, delete-orphan")

class Prompt(Base):
    __tablename__ = "prompts"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    type = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActionItem(Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True)
    email_id = Column(Integer, ForeignKey("emails.id"), nullable=False)
    task = Column(Text, nullable=False)
    deadline = Column(String(200))
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    email = relationship("Email", back_populates="action_items")

class Draft(Base):
    __tablename__ = "drafts"
    
    id = Column(Integer, primary_key=True)
    email_id = Column(Integer, ForeignKey("emails.id"))
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    recipient = Column(String(255), nullable=False)
    meta_data = Column(JSON)  # ← Changed from 'metadata' to 'meta_data'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    email = relationship("Email", back_populates="drafts")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

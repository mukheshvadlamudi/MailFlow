from pydantic_settings import BaseSettings
from typing import Optional
import os

# Force override any system environment variable
os.environ['LLM_PROVIDER'] = 'groq'

class Settings(BaseSettings):
    GROQ_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    LLM_PROVIDER: str = "groq"
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    
    DATABASE_URL: str = "sqlite:///./data/emails.db"
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:8080",  # Add this line!
        "http://localhost:3000",
        "http://192.168.56.1:8080",  # Add this too for network access
        "http://192.168.0.4:8080"
    ]
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()

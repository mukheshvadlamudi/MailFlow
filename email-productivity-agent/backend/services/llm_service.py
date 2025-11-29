from backend.config import settings
import traceback


class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.client = None
        print(f"LLM Provider: {self.provider}")
        print(f"Groq API Key exists: {bool(settings.GROQ_API_KEY)}")
        
        # Initialize client once during service startup
        if self.provider == "groq" and settings.GROQ_API_KEY:
            try:
                from groq import Groq
                print(f"Groq module imported successfully")
                print(f"Creating Groq client with API key: {settings.GROQ_API_KEY[:10]}...")
                
                # Try to create client with only api_key parameter
                self.client = Groq(api_key=settings.GROQ_API_KEY)
                print("Groq client initialized successfully!")
                
            except TypeError as e:
                print(f"TypeError initializing Groq client: {e}")
                print(f"Full traceback: {traceback.format_exc()}")
                
                # Try alternative: set environment variable instead
                try:
                    import os
                    os.environ['GROQ_API_KEY'] = settings.GROQ_API_KEY
                    self.client = Groq()
                    print("Groq client initialized with environment variable")
                except Exception as e2:
                    print(f"Also failed with env var: {e2}")
                    
            except Exception as e:
                print(f"Error initializing Groq client: {e}")
                print(f"Full traceback: {traceback.format_exc()}")
        
    async def generate(self, prompt: str) -> str:
        if self.provider == "groq":
            if not settings.GROQ_API_KEY:
                return "Error: GROQ_API_KEY not found in .env file"
            
            if not self.client:
                return "Error: Groq client not initialized. Check server logs for details."
            
            try:
                response = self.client.chat.completions.create(
                    model=settings.LLM_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=1000
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Error calling Groq API: {e}")
                print(f"Full traceback: {traceback.format_exc()}")
                return f"Error calling Groq API: {str(e)}"
        else:
            return "LLM provider not configured"


llm_service = LLMService()

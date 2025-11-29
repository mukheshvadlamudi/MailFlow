from backend.config import settings


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
                self.client = Groq(api_key=settings.GROQ_API_KEY)
                print("Groq client initialized successfully")
            except Exception as e:
                print(f"Error initializing Groq client: {e}")
        
    async def generate(self, prompt: str) -> str:
        if self.provider == "groq":
            if not settings.GROQ_API_KEY:
                return "Error: GROQ_API_KEY not found in .env file"
            
            if not self.client:
                return "Error: Groq client not initialized"
            
            try:
                response = self.client.chat.completions.create(
                    model=settings.LLM_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=1000
                )
                return response.choices[0].message.content
            except Exception as e:
                return f"Error calling Groq API: {str(e)}"
        else:
            return "LLM provider not configured"


llm_service = LLMService()

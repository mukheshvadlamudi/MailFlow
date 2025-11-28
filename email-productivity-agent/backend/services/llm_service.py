from backend.config import settings

class LLMService:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        print(f"LLM Provider: {self.provider}")
        print(f"Groq API Key exists: {bool(settings.GROQ_API_KEY)}")
        
    async def generate(self, prompt: str) -> str:
        if self.provider == "groq":
            if not settings.GROQ_API_KEY:
                return "Error: GROQ_API_KEY not found in .env file"
            
            try:
                from groq import Groq
                client = Groq(api_key=settings.GROQ_API_KEY)
                response = client.chat.completions.create(
                    model=settings.LLM_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=1000
                )
                return response.choices[0].message.content
            except Exception as e:
                return f"Error: {str(e)}"
        else:
            return "LLM provider not configured"

llm_service = LLMService()

from sqlalchemy.orm import Session
from backend.database.models import Email, Prompt, ActionItem
from backend.services.llm_service import llm_service
import json
import re

class EmailProcessor:
    
    async def process_email(self, email: Email, db: Session):
        """Process a single email: categorize and extract action items"""
        
        # Get active prompts
        categorization_prompt = db.query(Prompt).filter(
            Prompt.type == "categorization",
            Prompt.is_active == True
        ).first()
        
        action_prompt = db.query(Prompt).filter(
            Prompt.type == "action_extraction",
            Prompt.is_active == True
        ).first()
        
        # Categorize email
        if categorization_prompt:
            category = await self._categorize_email(email, categorization_prompt.content)
            email.category = category
        
        # Extract action items
        if action_prompt:
            action_items = await self._extract_action_items(email, action_prompt.content)
            
            # Delete existing action items for this email
            db.query(ActionItem).filter(ActionItem.email_id == email.id).delete()
            
            # Add new action items
            for item in action_items:
                action_item = ActionItem(
                    email_id=email.id,
                    task=item.get('task', ''),
                    deadline=item.get('deadline', None)
                )
                db.add(action_item)
        
        email.processed = True
        db.commit()
        return email
    
    async def _categorize_email(self, email: Email, prompt_template: str):
        """Categorize email using LLM"""
        prompt = f"""{prompt_template}

Email Details:
Subject: {email.subject}
From: {email.sender}
Body: {email.body}

Return ONLY the category name (Important, Newsletter, Spam, or To-Do)."""
        
        try:
            response = await llm_service.generate(prompt)
            # Extract category from response
            category = response.strip().split('\n')[0].strip()
            # Validate category
            valid_categories = ['Important', 'Newsletter', 'Spam', 'To-Do', 'Todo']
            for cat in valid_categories:
                if cat.lower() in category.lower():
                    return cat if cat != 'Todo' else 'To-Do'
            return 'Important'  # Default
        except Exception as e:
            print(f"Categorization error: {e}")
            return 'Uncategorized'
    
    async def _extract_action_items(self, email: Email, prompt_template: str):
        """Extract action items using LLM"""
        prompt = f"""{prompt_template}

Email Details:
Subject: {email.subject}
From: {email.sender}
Body: {email.body}

Return a JSON array of tasks: [{{"task": "...", "deadline": "..."}}]
If no tasks, return empty array: []"""
        
        try:
            response = await llm_service.generate(prompt)
            
            # Try to extract JSON from response
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if json_match:
                tasks = json.loads(json_match.group())
                return tasks if isinstance(tasks, list) else []
            
            return []
        except Exception as e:
            print(f"Action extraction error: {e}")
            return []

email_processor = EmailProcessor()

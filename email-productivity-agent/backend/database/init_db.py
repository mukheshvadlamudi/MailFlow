from backend.database.connection import engine, SessionLocal
from backend.database.models import Base, Email, Prompt
from datetime import datetime, timedelta

SAMPLE_EMAILS = [
    # Meeting Requests
    {
        "sender": "john@company.com",
        "recipient": "you@company.com",
        "subject": "Q4 Budget Meeting",
        "body": "Can we schedule a meeting next week to discuss Q4 budget? Please send me your availability.",
        "priority": "high"
    },
    {
        "sender": "sarah.johnson@techcorp.com",
        "recipient": "you@company.com",
        "subject": "Product Demo Request",
        "body": "Hi, I'd like to schedule a product demo for our team next Tuesday at 2 PM. Could you please confirm if this works for you?",
        "priority": "high"
    },
    {
        "sender": "mike.chen@startup.io",
        "recipient": "you@company.com",
        "subject": "Coffee Meeting Next Week?",
        "body": "Hey! Would love to catch up and discuss potential collaboration opportunities. Are you free for coffee next Wednesday or Thursday?",
        "priority": "medium"
    },
    
    # Task Requests
    {
        "sender": "sarah@company.com",
        "recipient": "you@company.com",
        "subject": "Action Required: Training Completion",
        "body": "Please complete the mandatory security training modules by Friday EOD. The deadline is strict due to compliance requirements.",
        "priority": "high"
    },
    {
        "sender": "hr@company.com",
        "recipient": "you@company.com",
        "subject": "Urgent: Expense Report Submission",
        "body": "Your expense report for October is pending. Please submit it by November 30th to ensure timely reimbursement.",
        "priority": "high"
    },
    {
        "sender": "david.kumar@agency.com",
        "recipient": "you@company.com",
        "subject": "Design Feedback Needed",
        "body": "Could you review the attached design mockups and provide feedback by end of week? We need your input before moving to development.",
        "priority": "medium"
    },
    
    # Project Updates
    {
        "sender": "project-manager@company.com",
        "recipient": "you@company.com",
        "subject": "Project Alpha - Status Update",
        "body": "Weekly update: Project Alpha is 75% complete. Next milestone is user testing scheduled for Dec 5. Please review the test plan in the shared folder.",
        "priority": "medium"
    },
    {
        "sender": "dev-team@company.com",
        "recipient": "you@company.com",
        "subject": "Sprint Review Summary",
        "body": "Sprint 12 completed successfully. We delivered 18 story points and fixed 12 bugs. Next sprint planning is Monday at 10 AM.",
        "priority": "low"
    },
    {
        "sender": "lisa.martinez@partner.com",
        "recipient": "you@company.com",
        "subject": "Q4 Partnership Review",
        "body": "Attached is the Q4 partnership performance report. Revenue increased by 23%. Let's discuss expansion opportunities in our next call.",
        "priority": "medium"
    },
    
    # Newsletters
    {
        "sender": "newsletter@tech.com",
        "recipient": "you@company.com",
        "subject": "Weekly Tech News Digest",
        "body": "Your weekly digest of technology news: AI breakthroughs, new programming languages, and industry trends. Click here to read more.",
        "priority": "low"
    },
    {
        "sender": "info@aiweekly.com",
        "recipient": "you@company.com",
        "subject": "AI Weekly: Latest in Machine Learning",
        "body": "This week's highlights: GPT-5 rumors, new computer vision models, and AI ethics debates. Plus upcoming ML conferences.",
        "priority": "low"
    },
    {
        "sender": "updates@github.com",
        "recipient": "you@company.com",
        "subject": "GitHub: Your Weekly Activity Summary",
        "body": "You had 15 commits this week across 3 repositories. Your most active project: email-agent. Stars received: 8.",
        "priority": "low"
    },
    
    # Spam-like
    {
        "sender": "deals@randomshop.com",
        "recipient": "you@company.com",
        "subject": "URGENT: 90% OFF Everything! Limited Time!",
        "body": "Amazing deals! Click now to save big! Don't miss out on this incredible opportunity! Act fast before it's too late!",
        "priority": "low"
    },
    {
        "sender": "noreply@promotions.net",
        "recipient": "you@company.com",
        "subject": "You've Won a Free iPhone! Claim Now!",
        "body": "Congratulations! You've been selected to receive a free iPhone 15. Click this link within 24 hours to claim your prize!",
        "priority": "low"
    },
    
    # Important Business
    {
        "sender": "ceo@company.com",
        "recipient": "you@company.com",
        "subject": "Company-Wide Town Hall - December 1st",
        "body": "Join us for our quarterly town hall next Friday at 3 PM. We'll discuss Q4 results, 2026 strategy, and team updates. Attendance is mandatory.",
        "priority": "high"
    },
    {
        "sender": "legal@company.com",
        "recipient": "you@company.com",
        "subject": "Contract Review Required",
        "body": "Please review and sign the attached vendor contract by December 3rd. Legal has approved all terms. Contact me if you have questions.",
        "priority": "high"
    },
    
    # Casual/FYI
    {
        "sender": "team@company.com",
        "recipient": "you@company.com",
        "subject": "Office Holiday Party - Dec 20th",
        "body": "Save the date! Our annual holiday party is on December 20th at 6 PM. Location: The Grand Hotel. RSVP by Dec 10th.",
        "priority": "medium"
    },
    {
        "sender": "facilities@company.com",
        "recipient": "you@company.com",
        "subject": "Building Maintenance Notice",
        "body": "FYI: Elevator maintenance scheduled for this Saturday 8 AM - 12 PM. Please use stairs if you're in the office.",
        "priority": "low"
    },
    {
        "sender": "it-support@company.com",
        "recipient": "you@company.com",
        "subject": "Password Reset Reminder",
        "body": "Your password will expire in 7 days. Please update it at your earliest convenience to avoid account lockout.",
        "priority": "medium"
    },
    {
        "sender": "recruiter@company.com",
        "recipient": "you@company.com",
        "subject": "Referral Bonus Program",
        "body": "Know someone great? Our referral program now offers $2000 bonus for successful hires. Share this with your network!",
        "priority": "low"
    }
]

DEFAULT_PROMPTS = [
    {
        "name": "Categorization",
        "type": "categorization",
        "content": "Categorize this email into: Important, Newsletter, Spam, or To-Do. Email: {subject} - {body}"
    },
    {
        "name": "Action Extraction",
        "type": "action_extraction",
        "content": "Extract action items and tasks from this email body: {body}"
    },
    {
        "name": "Auto Reply",
        "type": "auto_reply",
        "content": "Write a professional reply to: Subject: {subject}, From: {sender}, Body: {body}"
    }
]

def init_database():
    print("Creating database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Clear existing data
        if db.query(Email).count() > 0:
            print("Clearing existing emails...")
            db.query(Email).delete()
        
        # Add sample emails
        for email_data in SAMPLE_EMAILS:
            email = Email(**email_data, timestamp=datetime.utcnow())
            db.add(email)
        print(f"Added {len(SAMPLE_EMAILS)} sample emails")
        
        # Add default prompts if none exist
        if db.query(Prompt).count() == 0:
            for prompt_data in DEFAULT_PROMPTS:
                prompt = Prompt(**prompt_data)
                db.add(prompt)
            print(f"Added {len(DEFAULT_PROMPTS)} prompts")
        
        db.commit()
        print("Database initialized!")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()

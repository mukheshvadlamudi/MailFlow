\# Email Productivity Agent



An intelligent, prompt-driven Email Productivity Agent capable of processing emails and performing automated tasks such as email categorization, action-item extraction, auto-drafting replies, and chat-based inbox interaction.



\## 📋 Assignment Requirements



This project fulfills all requirements for the Email Productivity Agent assignment:

\- ✅ Email categorization using custom prompts

\- ✅ Action-item extraction with deadlines

\- ✅ Auto-drafting email replies

\- ✅ Chat-based inbox interaction with AI agent

\- ✅ Prompt-driven architecture (user can create/edit prompts)

\- ✅ Web-based UI (React + TypeScript)

\- ✅ Mock inbox with 20 sample emails

\- ✅ Draft storage (never sends automatically)



\## 🛠️ Tech Stack



\*\*Backend:\*\*

\- FastAPI (Python)

\- SQLAlchemy ORM

\- SQLite Database

\- Groq LLM API (Llama 3.3 70B)



\*\*Frontend:\*\*

\- React with TypeScript

\- Tailwind CSS

\- Vite

\- Shadcn UI Components



\## 📁 Project Structure



email-productivity-agent/

├── email-productivity-agent/ # Backend (FastAPI)

│ ├── backend/

│ │ ├── api/routes/ # API endpoints

│ │ ├── database/ # Database models \& connection

│ │ ├── services/ # LLM \& email processing services

│ │ └── config.py # Configuration management

│ ├── data/ # SQLite database storage

│ └── requirements.txt # Python dependencies

│

└── frontend/ # Frontend (React + TypeScript)

├── src/

│ ├── components/ # UI components

│ ├── lib/api.ts # API client

│ └── pages/ # Application pages

└── package.json # Node dependencies



text



\## 🚀 Setup Instructions



\### Prerequisites

\- Python 3.11 or higher

\- Node.js 18 or higher

\- Groq API Key (free at https://console.groq.com/)



\### Step 1: Backend Setup



1\. \*\*Navigate to backend directory:\*\*



cd email-productivity-agent



text



2\. \*\*Create and activate virtual environment:\*\*



\*\*Windows:\*\*



python -m venv venv

.\\venv\\Scripts\\Activate.ps1



text



\*\*Mac/Linux:\*\*



python3 -m venv venv

source venv/bin/activate



text



3\. \*\*Install dependencies:\*\*



pip install -r requirements.txt



text



4\. \*\*Create `.env` file in the backend root:\*\*



GROQ\_API\_KEY=your\_groq\_api\_key\_here

LLM\_PROVIDER=groq

LLM\_MODEL=llama-3.3-70b-versatile

DATABASE\_URL=sqlite:///./data/emails.db

CORS\_ORIGINS=\["http://localhost:5173","http://localhost:8080","http://localhost:3000"]

DEBUG=True



text



5\. \*\*Initialize database with sample emails:\*\*



python -m backend.database.init\_db



text

This loads 20 sample emails and default prompt templates.



6\. \*\*Run backend server:\*\*



uvicorn backend.main:app --reload



text

Backend API will be available at \[\*\*http://localhost:8000\*\*](http://localhost:8000)



API Documentation: \[\*\*http://localhost:8000/docs\*\*](http://localhost:8000/docs)



\### Step 2: Frontend Setup



1\. \*\*Navigate to frontend directory:\*\*



cd ../frontend



text



2\. \*\*Install dependencies:\*\*



npm install



text



3\. \*\*Run frontend development server:\*\*



npm run dev



text

Frontend will be available at \[\*\*http://localhost:8080\*\*](http://localhost:8080)



\## 📖 How to Use



\### Loading the Mock Inbox



The mock inbox is automatically loaded when you initialize the database. It contains 20 sample emails including:

\- Meeting requests

\- Product demos

\- Task assignments

\- Newsletters

\- Project updates

\- Spam messages



\### Configuring Prompts



1\. Navigate to the \*\*Prompts\*\* tab

2\. View the three default prompts:

\- \*\*Categorization Prompt\*\*: Classifies emails into Important, Newsletter, Spam, or To-Do

\- \*\*Action Extraction Prompt\*\*: Extracts tasks and deadlines from emails

\- \*\*Auto Reply Prompt\*\*: Generates professional email replies



3\. \*\*Create New Prompt:\*\*

\- Enter prompt name

\- Select type (categorization, action\_extraction, auto\_reply, custom)

\- Write prompt content

\- Click "Create Prompt"



4\. \*\*Edit Existing Prompt:\*\*

\- Click on any prompt card

\- Modify the content

\- Click "Update"



\### Processing Emails



1\. Go to \*\*Inbox\*\* tab

2\. Click \*\*"Process All Emails"\*\* button

3\. The system will:

\- Categorize each email using the categorization prompt

\- Extract action items using the action extraction prompt

\- Display results in real-time



4\. View extracted action items in the right panel



\### Using the Email Agent Chat



1\. Navigate to \*\*AI Chat\*\* tab

2\. Ask questions like:

\- "Summarize all my emails"

\- "What are my urgent tasks?"

\- "Draft a reply to the first email"

\- "Show me all meeting requests"



3\. The agent uses email content + stored prompts to answer



\### Generating Email Drafts



1\. In the \*\*Inbox\*\* tab, click \*\*"Generate Draft"\*\* on any email

2\. AI generates a professional reply using:

\- The auto-reply prompt

\- Original email context

\- Professional tone



3\. Go to \*\*Drafts\*\* tab to view generated drafts

4\. \*\*Edit\*\* drafts before sending

5\. \*\*Delete\*\* unwanted drafts



\*\*Safety\*\*: Drafts are never sent automatically - they are only saved for review.



\## 🎯 Features Demonstration



\### Phase 1: Email Ingestion \& Prompt Storage

\- ✅ Load 20 sample emails from SQLite database

\- ✅ Display sender, subject, timestamp, category tags

\- ✅ Create/edit/save custom prompts

\- ✅ Prompt-driven email categorization pipeline



\### Phase 2: Email Processing Agent

\- ✅ AI chat interface for email interaction

\- ✅ Summarize emails on demand

\- ✅ Extract action items with deadlines

\- ✅ Generate replies based on user instructions

\- ✅ Uses stored prompts + email content for LLM requests



\### Phase 3: Draft Generation Agent

\- ✅ Generate new email drafts from inbox

\- ✅ Edit drafts before sending

\- ✅ Save drafts with metadata

\- ✅ Uses auto-reply prompt + email thread context

\- ✅ Never sends emails automatically



\## 📊 Sample Data



The mock inbox includes diverse email types:



| Email Type | Count | Examples |

|------------|-------|----------|

| Meeting Requests | 3 | Q4 Budget Meeting, Product Demo, Coffee Meeting |

| Task Requests | 3 | Training Completion, Expense Report, Design Feedback |

| Project Updates | 3 | Project Alpha Status, Sprint Review, Q4 Partnership |

| Newsletters | 3 | Tech News, AI Weekly, GitHub Activity |

| Spam | 2 | Shopping Deals, Prize Claims |

| Important Business | 2 | CEO Town Hall, Contract Review |

| Casual/FYI | 4 | Holiday Party, Building Maintenance, etc. |



\## 🔐 Safety \& Robustness



\- \*\*Error Handling\*\*: All LLM calls wrapped in try-catch blocks

\- \*\*Draft Safety\*\*: Emails saved as drafts, never sent automatically

\- \*\*CORS Protection\*\*: Configured for localhost development

\- \*\*API Key Security\*\*: Environment variables for sensitive data

\- \*\*Graceful Degradation\*\*: UI shows helpful errors if backend fails



\## 🏗️ Architecture



\### Prompt-Driven Design

All LLM operations are controlled by user-defined prompts:

1\. User creates/edits prompts in the UI

2\. Prompts stored in SQLite database

3\. Agent retrieves active prompts for each operation

4\. LLM receives: email content + prompt + user instruction

5\. Output displayed in UI



\### Code Quality

\- \*\*Separation of Concerns\*\*: UI, API routes, services, database models

\- \*\*Modular Design\*\*: Each component has single responsibility

\- \*\*Type Safety\*\*: TypeScript frontend, Pydantic models in backend

\- \*\*RESTful API\*\*: Standard HTTP methods and status codes



\## 🎥 Demo Video



\[Add your demo video link here after recording]



The demo should show:

1\. Loading the inbox

2\. Creating/editing custom prompts

3\. Processing emails (categorization + action extraction)

4\. Using AI chat to summarize and reply to emails

5\. Generating and editing drafts



\## 📝 API Endpoints



\- `GET /api/emails` - Get all emails

\- `POST /api/processing/process-all` - Process and categorize all emails

\- `GET /api/prompts` - Get all prompts

\- `POST /api/prompts/` - Create new prompt

\- `PUT /api/prompts/{id}` - Update prompt

\- `DELETE /api/prompts/{id}` - Delete prompt

\- `POST /api/agent/chat` - Chat with AI agent

\- `GET /api/drafts` - Get all drafts

\- `POST /api/drafts/generate` - Generate draft for email

\- `PUT /api/drafts/{id}` - Update draft

\- `DELETE /api/drafts/{id}` - Delete draft



\## 🐛 Troubleshooting



\*\*Backend won't start:\*\*

\- Check if port 8000 is available

\- Verify `.env` file exists with valid GROQ\_API\_KEY

\- Ensure virtual environment is activated



\*\*Frontend won't start:\*\*

\- Check if port 8080/5173 is available

\- Run `npm install` again

\- Clear node\_modules and reinstall



\*\*CORS errors:\*\*

\- Ensure backend CORS\_ORIGINS includes your frontend URL

\- Restart backend server after changing config



\*\*LLM errors:\*\*

\- Verify Groq API key is valid

\- Check Groq API rate limits

\- Try a different model (llama-3.1-8b-instant for faster/cheaper)



\## 👨‍💻 Author



Mukhesh Vadlamudi



\## 📄 License



This is an academic project developed as part of an assignment.


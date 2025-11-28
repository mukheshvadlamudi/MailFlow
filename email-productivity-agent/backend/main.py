from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from backend.config import settings
from backend.database.models import Base
from backend.database.connection import engine
from backend.api.routes import emails, prompts, agent, processing
from backend.api.routes import emails, prompts, agent, processing, drafts


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Email Productivity Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(emails.router, prefix="/api/emails", tags=["Emails"])
app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])
app.include_router(agent.router, prefix="/api/agent", tags=["Agent"])
app.include_router(processing.router, prefix="/api/processing", tags=["Processing"])

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
<!DOCTYPE html>
<html>
<head>
    <title>Email Productivity Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; margin-bottom: 30px; text-align: center; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #ddd; }
        .tab { padding: 10px 20px; cursor: pointer; background: #fff; border: none; border-bottom: 3px solid transparent; }
        .tab.active { border-bottom-color: #4CAF50; font-weight: bold; }
        .tab-content { display: none; background: #fff; padding: 20px; border-radius: 5px; }
        .tab-content.active { display: block; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .email { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
        .email.high { border-left-color: #f44336; }
        .email.low { border-left-color: #999; }
        .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; margin: 5px; border-radius: 4px; }
        .btn:hover { background: #45a049; }
        .btn-delete { background: #f44336; }
        .btn-delete:hover { background: #da190b; }
        input, textarea { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
        textarea { min-height: 100px; font-family: monospace; }
        .prompt-item { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .prompt-type { display: inline-block; padding: 3px 8px; background: #4CAF50; color: white; border-radius: 3px; font-size: 12px; margin-right: 5px; }
        #response { background: #e8f5e9; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Email Productivity Agent</h1>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('inbox')">Inbox</button>
            <button class="tab" onclick="showTab('prompts')">Prompt Manager</button>
            <button class="tab" onclick="showTab('agent')">AI Agent</button>
        </div>

        <!-- INBOX TAB -->
        <div id="inbox" class="tab-content active">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Inbox</h2>
                <button class="btn" onclick="processAllEmails()">🔄 Process All Emails</button>
            </div>
            <div id="emails"></div>
            
            <div style="margin-top: 30px;">
                <h3>📋 Action Items</h3>
                <div id="actionItems"></div>
            </div>
        </div>

        <!-- PROMPTS TAB -->
        <div id="prompts" class="tab-content">
            <h2>Prompt Configuration</h2>
            <div style="margin-bottom: 30px;">
                <h3>Create New Prompt</h3>
                <input id="newPromptName" placeholder="Prompt Name (e.g., Categorization)">
                <select id="newPromptType">
                    <option value="categorization">Categorization</option>
                    <option value="action_extraction">Action Extraction</option>
                    <option value="auto_reply">Auto Reply</option>
                    <option value="custom">Custom</option>
                </select>
                <textarea id="newPromptContent" placeholder="Enter prompt content..."></textarea>
                <button class="btn" onclick="createPrompt()">Create Prompt</button>
            </div>
            
            <h3>Existing Prompts</h3>
            <div id="promptList"></div>
        </div>

        <!-- AI AGENT TAB -->
        <div id="agent" class="tab-content">
            <h2>AI Agent</h2>
            <input id="chat" placeholder="Ask me anything about your emails...">
            <button class="btn" onclick="chat()">Send</button>
            <div id="response"></div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            
            if (tabName === 'inbox') loadEmails();
            if (tabName === 'prompts') loadPrompts();
        }

        async function processAllEmails() {
            if (confirm('Process all emails for categorization and action extraction?')) {
                const btn = event.target;
                btn.textContent = '⏳ Processing...';
                btn.disabled = true;
                
                const res = await fetch('/api/processing/process-all', {method: 'POST'});
                const data = await res.json();
                
                alert(data.message);
                btn.textContent = '🔄 Process All Emails';
                btn.disabled = false;
                
                loadEmails();
                loadActionItems();
            }
        }

        async function loadActionItems() {
            const res = await fetch('/api/emails/actions/all');
            const actions = await res.json();
            
            if (actions.length === 0) {
                document.getElementById('actionItems').innerHTML = '<p style="color: #999;">No action items found.</p>';
                return;
            }
            
            document.getElementById('actionItems').innerHTML = actions.map(a => `
                <div class="email" style="border-left-color: #FF9800;">
                    <b>Task:</b> ${a.task}<br>
                    ${a.deadline ? `<b>Deadline:</b> ${a.deadline}<br>` : ''}
                    <small>Status: ${a.status}</small>
                </div>
            `).join('');
        }

        async function loadEmails() {
            const res = await fetch('/api/emails');
            const emails = await res.json();
            document.getElementById('emails').innerHTML = emails.map(e => `
                <div class="email ${e.priority}">
                    ${e.category ? `<span class="prompt-type">${e.category}</span>` : ''}
                    <b>From:</b> ${e.sender}<br>
                    <b>Subject:</b> ${e.subject}<br>
                    ${e.body}<br>
                    <small>Priority: ${e.priority} ${e.processed ? '✓ Processed' : ''}</small>
                </div>
            `).join('');
            
            loadActionItems();
        }

        async function loadPrompts() {
            const res = await fetch('/api/prompts');
            const prompts = await res.json();
            document.getElementById('promptList').innerHTML = prompts.map(p => `
                <div class="prompt-item">
                    <span class="prompt-type">${p.type}</span>
                    <h4>${p.name}</h4>
                    <textarea id="prompt-${p.id}" style="margin: 10px 0;">${p.content}</textarea>
                    <button class="btn" onclick="updatePrompt(${p.id})">Update</button>
                    <button class="btn btn-delete" onclick="deletePrompt(${p.id})">Delete</button>
                </div>
            `).join('');
        }

        async function createPrompt() {
            const name = document.getElementById('newPromptName').value;
            const type = document.getElementById('newPromptType').value;
            const content = document.getElementById('newPromptContent').value;
            
            await fetch('/api/prompts/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, type, content, is_active: true})
            });
            
            document.getElementById('newPromptName').value = '';
            document.getElementById('newPromptContent').value = '';
            loadPrompts();
            alert('Prompt created successfully!');
        }

        async function updatePrompt(id) {
            const content = document.getElementById(`prompt-${id}`).value;
            await fetch(`/api/prompts/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content})
            });
            alert('Prompt updated!');
            loadPrompts();
        }

        async function deletePrompt(id) {
            if (confirm('Delete this prompt?')) {
                await fetch(`/api/prompts/${id}`, {method: 'DELETE'});
                loadPrompts();
            }
        }

        async function chat() {
            const query = document.getElementById('chat').value;
            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query})
            });
            const data = await res.json();
            document.getElementById('response').innerHTML = data.response;
        }

        loadEmails();
    </script>
</body>
</html>
    """

@app.get("/health")
async def health():
    return {"status": "healthy"}
app.include_router(drafts.router, prefix="/api/drafts", tags=["Drafts"])

const API_BASE_URL = 'http://localhost:8000';

// Email functions
export const getEmails = async () => {
  const response = await fetch(`${API_BASE_URL}/api/emails`);
  return response.json();
};

export const getActionItems = async () => {
  const response = await fetch(`${API_BASE_URL}/api/emails/actions/all`);
  return response.json();
};

export const processAllEmails = async () => {
  const response = await fetch(`${API_BASE_URL}/api/processing/process-all`, {
    method: 'POST'
  });
  return response.json();
};

// Prompt functions
export const getPrompts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/prompts`);
  return response.json();
};

export const createPrompt = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/prompts/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updatePrompt = async (id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deletePrompt = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Chat function
export const sendChatMessage = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/api/agent/chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query})
  });
  return response.json();
};
// Draft functions
export const getDrafts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/drafts`);
  return response.json();
};

export const getDraft = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`);
  return response.json();
};

export const createDraft = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateDraft = async (id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteDraft = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const generateDraft = async (emailId: number, instruction?: string) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/generate?email_id=${emailId}&instruction=${instruction || ''}`, {
    method: 'POST'
  });
  return response.json();
};

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  deadline?: string;
  email_id?: string;
  completed?: boolean;
}

export interface Prompt {
  id: string;
  name: string;
  type: 'categorization' | 'action_extraction' | 'auto_reply' | 'custom';
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

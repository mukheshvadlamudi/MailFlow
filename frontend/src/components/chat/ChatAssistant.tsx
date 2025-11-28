import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage } from '@/lib/api';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage.content);
      // FIXED: Backend returns {response: "..."} directly, not nested in .data
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || 'No response received',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please try again.',
        variant: 'destructive',
      });
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">AI Chat Assistant</h2>
        <p className="text-muted-foreground">Chat with AI to manage your emails</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card rounded-xl shadow-card border border-border flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Start a conversation</h3>
              <p className="text-muted-foreground max-w-sm">
                Ask me anything about your emails, schedule tasks, or get help with productivity.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent text-accent-foreground'
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

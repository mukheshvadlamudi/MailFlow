import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { InboxView } from '@/components/inbox/InboxView';
import { PromptManager } from '@/components/prompts/PromptManager';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { DraftManager } from '@/components/drafts/DraftManager';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox':
        return <InboxView />;
      case 'drafts':
        return <DraftManager />;
      case 'prompts':
        return <PromptManager />;
      case 'chat':
        return <ChatAssistant />;
      default:
        return <InboxView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold">MailFlow</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sidebar-foreground"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;

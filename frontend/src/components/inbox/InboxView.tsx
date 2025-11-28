import { useState, useEffect } from 'react';
import { Search, RefreshCw, Loader2, Inbox, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmailCard } from './EmailCard';
import { ActionItems } from './ActionItems';
import { getEmails, getActionItems, processAllEmails } from '@/lib/api';
import { Email, ActionItem } from '@/types';
import { toast } from '@/hooks/use-toast';

export function InboxView() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [emailsRes, actionsRes] = await Promise.all([
        getEmails(),
        getActionItems(),
      ]);
      setEmails(emailsRes || []);
      setActionItems(actionsRes || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch emails. Please try again.',
        variant: 'destructive',
      });
      setEmails([]);
      setActionItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessAll = async () => {
    setProcessing(true);
    try {
      await processAllEmails();
      toast({
        title: 'Success',
        description: 'All emails have been processed successfully.',
      });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process emails. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || email.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Inbox</h2>
          <p className="text-muted-foreground">Manage and process your emails</p>
        </div>
        <Button
          onClick={handleProcessAll}
          disabled={processing}
          variant="gradient"
          className="shrink-0"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Process All Emails
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <Button
              key={priority}
              variant={priorityFilter === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter(priority)}
              className="capitalize"
            >
              {priority === 'all' ? 'All' : priority}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Emails Grid */}
          <div className="lg:col-span-2 space-y-4">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <EmailCard key={email.id} email={email} />
              ))
            ) : (
              <div className="bg-card rounded-xl p-12 shadow-card border border-border text-center">
                <Inbox className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No emails found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || priorityFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Your inbox is empty'}
                </p>
              </div>
            )}
          </div>

          {/* Action Items Sidebar */}
          <div className="lg:col-span-1">
            <ActionItems items={actionItems} />
          </div>
        </div>
      )}
    </div>
  );
}

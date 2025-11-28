import { Mail, Clock, FileEdit, CheckCircle } from 'lucide-react';
import { Email } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { generateDraft, getDrafts } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface EmailCardProps {
  email: Email;
}

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-border',
};

const priorityLabels = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

export function EmailCard({ email }: EmailCardProps) {
  const [generating, setGenerating] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check if draft already exists for this email
  useEffect(() => {
    const checkDraft = async () => {
      try {
        const drafts = await getDrafts();
        const exists = drafts.some((draft: any) => draft.email_id === email.id);
        setHasDraft(exists);
      } catch (error) {
        console.error('Check draft error:', error);
      }
    };
    checkDraft();
  }, [email.id]);

  const handleGenerateDraft = async () => {
    setGenerating(true);
    try {
      await generateDraft(email.id, 'Write a professional reply');
      toast({
        title: 'Success',
        description: 'Draft generated successfully! Check the Drafts section.',
      });
      setHasDraft(true); // Mark as having draft
    } catch (error) {
      console.error('Generate draft error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 border border-border animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-card-foreground">{email.sender}</p>
            <p className="text-sm text-muted-foreground">{email.timestamp || 'Just now'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            priorityStyles[email.priority]
          )}>
            {priorityLabels[email.priority]}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">{email.subject}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{email.body}</p>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
          {email.category || 'Uncategorized'}
        </span>
        <div className="flex gap-2">
          {hasDraft ? (
            <Button size="sm" variant="outline" disabled>
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Draft Created
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateDraft}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileEdit className="w-4 h-4 mr-1" />
                  Generate Draft
                </>
              )}
            </Button>
          )}
          <button className="text-sm text-primary font-medium hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

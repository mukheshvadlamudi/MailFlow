import { useState } from 'react';
import { Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Prompt } from '@/types';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => void;
}

const typeStyles: Record<string, string> = {
  categorization: 'bg-primary/10 text-primary border-primary/20',
  action_extraction: 'bg-accent/10 text-accent border-accent/20',
  auto_reply: 'bg-success/10 text-success border-success/20',
  custom: 'bg-warning/10 text-warning border-warning/20',
};

export function PromptCard({ prompt, onUpdate, onDelete }: PromptCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(prompt.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(prompt.id, content);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(prompt.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className={cn(
            "inline-block px-2.5 py-1 rounded-full text-xs font-medium border mb-2",
            typeStyles[prompt.type] || typeStyles.custom
          )}>
            {prompt.type.replace('_', ' ')}
          </span>
          <h3 className="font-semibold text-card-foreground">{prompt.name}</h3>
        </div>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-success" />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(prompt.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] resize-none"
          placeholder="Enter prompt content..."
        />
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{prompt.content}</p>
      )}
    </div>
  );
}

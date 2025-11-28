import { useState } from 'react';
import { Mail, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DraftCardProps {
  draft: any;
  onUpdate: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

export function DraftCard({ draft, onUpdate, onDelete }: DraftCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [recipient, setRecipient] = useState(draft.recipient);

  const handleSave = () => {
    onUpdate(draft.id, { subject, body, recipient });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSubject(draft.subject);
    setBody(draft.body);
    setRecipient(draft.recipient);
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Draft</CardTitle>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(draft.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground">To:</label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subject:</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Body:</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-sm font-medium text-muted-foreground">To: </span>
              <span className="text-sm">{draft.recipient}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Subject: </span>
              <span className="text-sm font-semibold">{draft.subject}</span>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-foreground whitespace-pre-wrap">{draft.body}</p>
            </div>
          </>
        )}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {draft.meta_data?.generated && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">AI Generated</span>
          )}
          <span className="ml-2">
            Updated: {new Date(draft.updated_at).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

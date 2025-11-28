import { useState, useEffect } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptCard } from './PromptCard';
import { getPrompts, createPrompt, updatePrompt, deletePrompt } from '@/lib/api';
import { Prompt } from '@/types';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const promptTypes = [
  { value: 'categorization', label: 'Categorization' },
  { value: 'action_extraction', label: 'Action Extraction' },
  { value: 'auto_reply', label: 'Auto Reply' },
  { value: 'custom', label: 'Custom' },
];

export function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    type: 'custom' as Prompt['type'],
    content: '',
  });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const response = await getPrompts();
      // FIXED: Remove .data, backend returns array directly
      setPrompts(response || []);
    } catch (error) {
      console.error('Fetch prompts error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts.',
        variant: 'destructive',
      });
      // Set empty array on error
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleCreate = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      await createPrompt(newPrompt);
      toast({
        title: 'Success',
        description: 'Prompt created successfully.',
      });
      setNewPrompt({ name: '', type: 'custom', content: '' });
      fetchPrompts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create prompt.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    try {
      await updatePrompt(Number(id), { content });
      toast({
        title: 'Success',
        description: 'Prompt updated successfully.',
      });
      fetchPrompts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update prompt.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deletePrompt(Number(deleteId));
      toast({
        title: 'Success',
        description: 'Prompt deleted successfully.',
      });
      fetchPrompts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete prompt.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Prompt Manager</h2>
        <p className="text-muted-foreground">Create and manage AI prompts for email processing</p>
      </div>

      {/* Create Form */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Create New Prompt
        </h3>
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              placeholder="Prompt name"
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
            />
            <Select
              value={newPrompt.type}
              onValueChange={(value: Prompt['type']) => setNewPrompt({ ...newPrompt, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {promptTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Enter prompt content..."
            value={newPrompt.content}
            onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
            className="min-h-[120px]"
          />
          <Button onClick={handleCreate} disabled={creating} className="w-full sm:w-auto">
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Create Prompt
          </Button>
        </div>
      </div>

      {/* Prompts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (prompts || []).length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onUpdate={handleUpdate}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl p-12 shadow-card border border-border text-center">
          <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No prompts yet</h3>
          <p className="text-muted-foreground">Create your first prompt to get started</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

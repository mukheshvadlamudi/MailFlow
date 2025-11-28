import { useState, useEffect } from 'react';
import { FileEdit, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DraftCard } from './DraftCard';
import { getDrafts, updateDraft, deleteDraft } from '@/lib/api';
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

export function DraftManager() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const response = await getDrafts();
      setDrafts(response || []);
    } catch (error) {
      console.error('Fetch drafts error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch drafts.',
        variant: 'destructive',
      });
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleUpdate = async (id: number, data: any) => {
    try {
      await updateDraft(id, data);
      toast({
        title: 'Success',
        description: 'Draft updated successfully.',
      });
      fetchDrafts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update draft.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteDraft(deleteId);
      toast({
        title: 'Success',
        description: 'Draft deleted successfully.',
      });
      fetchDrafts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete draft.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Draft Manager</h2>
          <p className="text-muted-foreground">Review and edit your email drafts</p>
        </div>
        <Button onClick={fetchDrafts} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Drafts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (drafts || []).length > 0 ? (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onUpdate={handleUpdate}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl p-12 shadow-card border border-border text-center">
          <FileEdit className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No drafts yet</h3>
          <p className="text-muted-foreground">
            Generate drafts from your emails using the AI assistant
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { CheckCircle2, Circle, Calendar, ListTodo } from 'lucide-react';
import { ActionItem } from '@/types';
import { cn } from '@/lib/utils';

interface ActionItemsProps {
  items: ActionItem[];
}

export function ActionItems({ items }: ActionItemsProps) {
  if (items.length === 0) {
    return (
      <div className="bg-card rounded-xl p-8 shadow-card border border-border text-center">
        <ListTodo className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-muted-foreground">No action items found</p>
        <p className="text-sm text-muted-foreground/70">Process emails to extract action items</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <ListTodo className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Action Items</h3>
        <span className="ml-auto bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors animate-fade-in",
              item.completed && "opacity-60"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm text-card-foreground",
                item.completed && "line-through"
              )}>
                {item.task}
              </p>
              {item.deadline && (
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.deadline}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

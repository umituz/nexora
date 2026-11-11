import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { formatRelativeDate } from "@/lib/calculations";
import { Undo2, Merge, Trash2, Heart, Disc3, Tag, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/common/EmptyState";
import { History as HistoryIcon } from "lucide-react";

const ACTION_ICONS: Record<string, React.ElementType> = {
  merge: Merge, delete: Trash2, unify: Disc3, favorite: Heart, unfavorite: Heart,
  tag: Tag, untag: Tag, import: Upload, export: Download,
};

export default function HistoryPage() {
  const { history, undoHistory } = useLibrary();
  const { toast } = useToast();

  const handleUndo = (id: string) => {
    undoHistory(id);
    toast({ title: "Action Undone", description: "The action has been reversed." });
  };

  if (history.length === 0) {
    return (
      <div>
        <PageHeader title="Action History" />
        <EmptyState icon={<HistoryIcon size={48} />} title="No History" description="Actions you take will appear here." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Action History" description="A log of all actions performed on your library" />
      <div className="glass-card divide-y divide-border">
        {history.map((item) => {
          const Icon = ACTION_ICONS[item.action] || Tag;
          return (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <Icon size={16} className="text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeDate(item.timestamp)} · {item.itemCount} items</p>
                </div>
              </div>
              {item.undoable && (
                <Button size="sm" variant="ghost" onClick={() => handleUndo(item.id)}>
                  <Undo2 size={14} className="mr-1" /> Undo
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

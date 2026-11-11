import { useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeletionQueuePage() {
  const { songs, deletionQueueIds, restoreFromQueue, emptyDeletionQueue } = useLibrary();
  const { toast } = useToast();

  const queue = useMemo(() => {
    const set = new Set(deletionQueueIds);
    return songs.filter((s) => set.has(s.id));
  }, [songs, deletionQueueIds]);

  const handleRestore = (id: string) => {
    restoreFromQueue(id);
    toast({ title: "Restored", description: "Song restored to library." });
  };

  const handleDeleteAll = () => {
    const count = queue.length;
    emptyDeletionQueue();
    toast({ title: "Library Updated", description: `${count} songs permanently removed.` });
  };

  if (queue.length === 0) {
    return (
      <div>
        <PageHeader title="Deletion Queue" description="Songs marked for removal." />
        <EmptyState
          icon={<Trash2 size={48} />}
          title="Queue is Empty"
          description="No songs are marked for deletion. Use the Least Played tool to find songs to remove."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Deletion Queue" description={`${queue.length} songs marked for removal.`}>
        <Button size="sm" variant="destructive" onClick={handleDeleteAll}>
          <Trash2 size={14} className="mr-1" /> Empty Queue ({queue.length})
        </Button>
      </PageHeader>

      <div className="glass-card">
        {queue.map((song, i) => (
          <div key={song.id} className="flex items-center">
            <SongRow song={song} index={i} className="flex-1" />
            <Button size="sm" variant="ghost" className="mr-2 shrink-0" onClick={() => handleRestore(song.id)}>
              <Undo2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

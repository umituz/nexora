import { useState, useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { sortSongs } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { TrendingDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeastPlayedPage() {
  const { songs, deletionQueueIds, toggleFavorite, queueForDeletion } = useLibrary();
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(5);

  const queueSet = useMemo(() => new Set(deletionQueueIds), [deletionQueueIds]);

  const filtered = useMemo(
    () => sortSongs(songs.filter((s) => s.playCount <= threshold && !queueSet.has(s.id)), "playCount", "asc"),
    [songs, threshold, queueSet]
  );

  const handleQueue = (id: string) => {
    queueForDeletion([id]);
    toast({ title: "Added to Deletion Queue", description: "Review it before final removal." });
  };

  const handleQueueAll = () => {
    const ids = filtered.map((s) => s.id);
    if (ids.length === 0) return;
    queueForDeletion(ids);
    toast({ title: "Added to Queue", description: `${ids.length} songs queued for deletion.` });
  };

  return (
    <div>
      <PageHeader title="Least Played" description="Songs you rarely listen to. Consider removing them.">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-muted-foreground">Max plays:</label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="text-sm bg-secondary text-foreground border border-border rounded-md px-2 py-1"
          >
            <option value={0}>0</option>
            <option value={2}>≤ 2</option>
            <option value={5}>≤ 5</option>
            <option value={10}>≤ 10</option>
          </select>
          {filtered.length > 0 && (
            <Button size="sm" variant="destructive" onClick={handleQueueAll}>
              <Trash2 size={14} className="mr-1" /> Queue All ({filtered.length})
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="glass-card p-3 mb-4 flex items-center gap-3">
        <TrendingDown size={18} className="text-feature-least-played shrink-0" />
        <p className="text-sm text-muted-foreground">{filtered.length} songs with {threshold} or fewer plays</p>
      </div>

      <div className="glass-card">
        {filtered.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={i}
            onFavoriteToggle={toggleFavorite}
            onDelete={handleQueue}
          />
        ))}
      </div>
    </div>
  );
}

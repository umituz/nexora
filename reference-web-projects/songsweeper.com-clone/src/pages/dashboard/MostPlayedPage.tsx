import { useState, useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { sortSongs } from "@/lib/calculations";
import { TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function MostPlayedPage() {
  const { songs, toggleFavorite, favoriteMany } = useLibrary();
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(50);

  const filtered = useMemo(
    () => sortSongs(songs.filter((s) => s.playCount >= threshold), "playCount", "desc"),
    [songs, threshold]
  );

  const handleFavoriteAll = () => {
    const unfavIds = filtered.filter((s) => !s.isFavorite).map((s) => s.id);
    if (unfavIds.length === 0) {
      toast({ title: "Already Favorited", description: "All matching songs are already favorites." });
      return;
    }
    favoriteMany(unfavIds);
    toast({ title: "All Favorited", description: `${unfavIds.length} songs favorited.` });
  };

  return (
    <div>
      <PageHeader title="Most Played" description="Your most-played songs. Favorite them to improve recommendations.">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-muted-foreground">Min plays:</label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="text-sm bg-secondary text-foreground border border-border rounded-md px-2 py-1"
          >
            <option value={20}>≥ 20</option>
            <option value={50}>≥ 50</option>
            <option value={100}>≥ 100</option>
          </select>
          <Button size="sm" variant="outline" onClick={handleFavoriteAll}>
            <Heart size={14} className="mr-1" /> Favorite All
          </Button>
        </div>
      </PageHeader>

      <div className="glass-card p-3 mb-4 flex items-center gap-3">
        <TrendingUp size={18} className="text-feature-most-played shrink-0" />
        <p className="text-sm text-muted-foreground">{filtered.length} songs with {threshold}+ plays</p>
      </div>

      <div className="glass-card">
        {filtered.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={toggleFavorite} />
        ))}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { sortSongs } from "@/lib/calculations";
import { Button } from "@/components/ui/button";

export default function RecentlyPlayedPage() {
  const { songs, toggleFavorite } = useLibrary();
  const [limit, setLimit] = useState(30);
  const sorted = useMemo(() => sortSongs(songs.filter((s) => s.playCount > 0), "lastPlayed", "desc").slice(0, limit), [songs, limit]);

  return (
    <div>
      <PageHeader title="Recently Played" description="Songs you've listened to recently" />
      <div className="glass-card">
        {sorted.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={toggleFavorite} />
        ))}
      </div>
      {limit < songs.length && (
        <div className="flex justify-center mt-4">
          <Button size="sm" variant="outline" onClick={() => setLimit((l) => l + 30)}>Show more</Button>
        </div>
      )}
    </div>
  );
}

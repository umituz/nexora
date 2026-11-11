import { useParams, Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDuration, formatDate } from "@/lib/calculations";
import { ListMusic, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useState, useMemo } from "react";

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlist = mockData.playlists.find((p) => p.id === id);

  const [allSongs, setAllSongs] = useState(mockData.songs);

  const songs = useMemo(() => {
    if (!playlist) return [];
    const idSet = new Set(playlist.songIds);
    return allSongs.filter((s) => idSet.has(s.id));
  }, [allSongs, playlist]);

  if (!playlist) {
    return <EmptyState icon={<ListMusic size={48} />} title="Playlist Not Found" />;
  }

  const handleFavoriteToggle = (songId: string) => {
    setAllSongs((prev) => prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)));
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.PLAYLISTS}><ArrowLeft size={14} className="mr-1" /> Back to Playlists</Link>
      </Button>

      <div className="flex items-start gap-4 mb-6">
        <img src={playlist.coverArt} alt={playlist.name} className="w-24 h-24 rounded-xl object-cover shadow-lg" />
        <div>
          <h1 className="text-2xl font-serif text-foreground">{playlist.name}</h1>
          <p className="text-sm text-muted-foreground">{playlist.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {playlist.songCount} songs · {formatDuration(playlist.totalDuration)} · Updated {formatDate(playlist.updatedAt)}
          </p>
        </div>
      </div>

      <div className="glass-card">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>
    </div>
  );
}

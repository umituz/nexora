import { useParams, Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { formatNumber } from "@/lib/calculations";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useState } from "react";

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const artist = mockData.artists.find((a) => a.id === id);
  const [songs, setSongs] = useState(() => mockData.songs.filter((s) => s.artistId === id));
  const albums = mockData.albums.filter((a) => a.artistId === id);

  if (!artist) {
    return <EmptyState icon={<Users size={48} />} title="Artist Not Found" />;
  }

  const handleFavoriteToggle = (songId: string) => {
    setSongs((prev) => prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)));
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.ARTISTS}><ArrowLeft size={14} className="mr-1" /> Back to Artists</Link>
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <img src={artist.avatar} alt={artist.name} className="w-20 h-20 rounded-full bg-muted" />
        <div>
          <h1 className="text-2xl font-serif text-foreground">{artist.name}</h1>
          <p className="text-sm text-muted-foreground">
            {artist.albumCount} albums · {artist.songCount} songs · {formatNumber(artist.totalPlays)} plays
          </p>
          <div className="flex gap-1 mt-1">
            {artist.genres.map((g) => (
              <span key={g} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {albums.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif mb-3 text-foreground">Albums</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {albums.map((a) => (
              <Link key={a.id} to={`/dashboard/albums/${a.id}`} className="shrink-0 w-32 glass-card overflow-hidden">
                <img src={a.albumArt} alt={a.title} className="w-full aspect-square object-cover" loading="lazy" />
                <p className="text-xs font-medium p-2 truncate text-foreground">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-serif mb-3 text-foreground">Songs</h2>
      <div className="glass-card">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>
    </div>
  );
}

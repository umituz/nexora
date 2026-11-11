import { useParams, Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDuration } from "@/lib/calculations";
import { Disc, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useState } from "react";

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const album = mockData.albums.find((a) => a.id === id);
  const [songs, setSongs] = useState(() =>
    mockData.songs.filter((s) => s.albumId === id).sort((a, b) => a.trackNumber - b.trackNumber)
  );

  if (!album) {
    return <EmptyState icon={<Disc size={48} />} title="Album Not Found" />;
  }

  const handleFavoriteToggle = (songId: string) => {
    setSongs((prev) => prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)));
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.ALBUMS}><ArrowLeft size={14} className="mr-1" /> Back to Albums</Link>
      </Button>

      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <img src={album.albumArt} alt={album.title} className="w-40 h-40 rounded-xl object-cover shadow-lg" />
        <div>
          <h1 className="text-2xl font-serif text-foreground">{album.title}</h1>
          <p className="text-muted-foreground">{album.artist}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {album.year} · {album.songCount} songs · {formatDuration(album.totalDuration)} · {album.genre}
          </p>
        </div>
      </div>

      <div className="glass-card">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} showAlbum={false} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>
    </div>
  );
}

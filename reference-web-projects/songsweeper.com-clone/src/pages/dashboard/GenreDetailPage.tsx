import { useParams, Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useState, useMemo } from "react";

export default function GenreDetailPage() {
  const { genre } = useParams<{ genre: string }>();
  const decodedGenre = decodeURIComponent(genre || "");
  const [songs, setSongs] = useState(mockData.songs);
  const filtered = useMemo(() => songs.filter((s) => s.genre === decodedGenre), [songs, decodedGenre]);

  if (filtered.length === 0) {
    return <EmptyState icon={<Tag size={48} />} title={`No songs in "${decodedGenre}"`} />;
  }

  const handleFavoriteToggle = (id: string) => {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)));
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.GENRES}><ArrowLeft size={14} className="mr-1" /> Back to Genres</Link>
      </Button>
      <PageHeader title={decodedGenre} description={`${filtered.length} songs`} />
      <div className="glass-card">
        {filtered.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>
    </div>
  );
}

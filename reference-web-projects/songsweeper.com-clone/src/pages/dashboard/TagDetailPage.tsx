import { useParams, Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { ArrowLeft, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useState, useMemo } from "react";

export default function TagDetailPage() {
  const { tag } = useParams<{ tag: string }>();
  const decodedTag = decodeURIComponent(tag || "");
  const [songs, setSongs] = useState(mockData.songs);
  const filtered = useMemo(() => songs.filter((s) => s.tags.includes(decodedTag)), [songs, decodedTag]);

  const handleFavoriteToggle = (id: string) => {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)));
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.TAGS}><ArrowLeft size={14} className="mr-1" /> Back to Tags</Link>
      </Button>
      <PageHeader title={`#${decodedTag}`} description={`${filtered.length} songs`} />
      {filtered.length === 0 ? (
        <EmptyState icon={<Tags size={48} />} title="No Songs" description={`No songs tagged "${decodedTag}"`} />
      ) : (
        <div className="glass-card">
          {filtered.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

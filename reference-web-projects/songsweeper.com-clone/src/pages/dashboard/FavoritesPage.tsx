import { useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { songs, toggleFavorite } = useLibrary();
  const favorites = useMemo(() => songs.filter((s) => s.isFavorite), [songs]);

  if (favorites.length === 0) {
    return (
      <div>
        <PageHeader title="Favorites" />
        <EmptyState icon={<Heart size={48} />} title="No Favorites Yet" description="Heart some songs to see them here." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Favorites" description={`${favorites.length} favorited songs`} />
      <div className="glass-card">
        {favorites.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} onFavoriteToggle={toggleFavorite} />
        ))}
      </div>
    </div>
  );
}

import { MOCK_MEDIA } from "@/data/mock-data";
import { MediaCard } from "@/components/MediaCard";

export default function FavoritesPage() {
  const favorites = MOCK_MEDIA.slice(0, 8);
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Favorites</h1>
      <p className="text-sm text-muted-foreground mt-1">{favorites.length} saved items</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favorites.map((item) => (<MediaCard key={item.id} item={item} />))}
      </div>
    </div>
  );
}

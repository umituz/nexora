import { useState, useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { EmptyState } from "@/components/common/EmptyState";
import { filterSongs } from "@/lib/calculations";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const { songs, toggleFavorite } = useLibrary();
  const [query, setQuery] = useState("");

  const results = useMemo(() => filterSongs(songs, query), [songs, query]);

  return (
    <div>
      <PageHeader title="Search" description="Find any song, artist, or album" />

      <div className="relative mb-6">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your library..."
          className="pl-11 h-12 text-base"
          autoFocus
        />
      </div>

      {query && results.length === 0 ? (
        <EmptyState icon={<SearchIcon size={48} />} title="No Results" description={`No songs matching "${query}"`} />
      ) : query ? (
        <div className="glass-card">
          {results.slice(0, 30).map((song, i) => (
            <SongRow key={song.id} song={song} index={i} onFavoriteToggle={toggleFavorite} />
          ))}
          {results.length > 30 && (
            <p className="text-center py-3 text-xs text-muted-foreground">
              Showing 30 of {results.length} results
            </p>
          )}
        </div>
      ) : (
        <EmptyState icon={<SearchIcon size={48} />} title="Start Searching" description="Type to search your library" />
      )}
    </div>
  );
}

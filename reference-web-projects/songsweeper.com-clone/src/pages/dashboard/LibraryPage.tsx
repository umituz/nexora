import { useState, useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { SongRow } from "@/components/common/SongRow";
import { filterSongs, sortSongs, paginateItems } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function LibraryPage() {
  const { songs, toggleFavorite, queueForDeletion } = useLibrary();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    const f = filterSongs(songs, query);
    return sortSongs(f, sortBy, order);
  }, [songs, query, sortBy, order]);

  const { items: paginated, totalPages } = paginateItems(filtered, page, perPage);

  return (
    <div>
      <PageHeader title="Library" description={`${songs.length} songs in your library`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search songs, artists, albums..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-secondary text-foreground border border-border rounded-md px-3 py-2"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="playCount">Play Count</option>
            <option value="dateAdded">Date Added</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
          >
            {order === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="glass-card">
        {paginated.map((song, i) => (
          <SongRow
            key={song.id}
            song={song}
            index={(page - 1) * perPage + i}
            onFavoriteToggle={toggleFavorite}
            onDelete={(id) => queueForDeletion([id])}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={14} />
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}

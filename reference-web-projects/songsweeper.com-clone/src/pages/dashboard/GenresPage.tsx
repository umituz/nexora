import { useMemo } from "react";
import { Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { formatNumber, formatDuration } from "@/lib/calculations";
import type { GenreStats } from "@/data/types";

export default function GenresPage() {
  const genres = useMemo<GenreStats[]>(() => {
    const map = new Map<string, GenreStats>();
    for (const song of mockData.songs) {
      const existing = map.get(song.genre);
      if (existing) {
        existing.songCount++;
        existing.totalPlays += song.playCount;
        existing.totalDuration += song.duration;
        existing.avgPlayCount = Math.round(existing.totalPlays / existing.songCount);
      } else {
        map.set(song.genre, {
          genre: song.genre,
          songCount: 1,
          totalPlays: song.playCount,
          avgPlayCount: song.playCount,
          totalDuration: song.duration,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.songCount - a.songCount);
  }, []);

  return (
    <div>
      <PageHeader title="Genres" description={`${genres.length} genres in your library`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {genres.map((g) => (
          <Link
            key={g.genre}
            to={`/dashboard/genres/${encodeURIComponent(g.genre)}`}
            className="glass-card p-4 hover:scale-[1.02] transition-transform"
          >
            <h3 className="font-semibold text-foreground">{g.genre}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {g.songCount} songs · {formatNumber(g.totalPlays)} plays · {formatDuration(g.totalDuration)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

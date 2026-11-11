import type { Song, DuplicateGroup, SplitAlbumGroup } from "@/data/types";

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

export function formatPlaytime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function calculateLibraryStats(songs: Song[]) {
  const totalSongs = songs.length;
  const totalAlbums = new Set(songs.map((s) => s.albumId)).size;
  const totalArtists = new Set(songs.map((s) => s.artist)).size;
  const totalPlaytime = songs.reduce((acc, s) => acc + s.duration, 0);
  const totalPlays = songs.reduce((acc, s) => acc + s.playCount, 0);
  const avgPlaysPerSong = totalSongs > 0 ? Math.round(totalPlays / totalSongs) : 0;

  return { totalSongs, totalAlbums, totalArtists, totalPlaytime, totalPlays, avgPlaysPerSong };
}

export function calculateDuplicateStats(groups: DuplicateGroup[]) {
  const totalGroups = groups.length;
  const totalDuplicates = groups.reduce((acc, g) => acc + g.songs.length - 1, 0);
  const spaceSaved = groups.reduce(
    (acc, g) => acc + g.songs.slice(1).reduce((a, s) => a + s.fileSize, 0),
    0
  );
  return { totalGroups, totalDuplicates, spaceSaved };
}

export function calculateSplitAlbumStats(groups: SplitAlbumGroup[]) {
  const totalGroups = groups.length;
  const totalFragments = groups.reduce((acc, g) => acc + g.fragments.length, 0);
  return { totalGroups, totalFragments };
}

export function getPlayCountCategory(playCount: number): string {
  if (playCount === 0) return "Never Played";
  if (playCount <= 5) return "Rarely Played";
  if (playCount <= 20) return "Occasionally Played";
  if (playCount <= 50) return "Frequently Played";
  return "Heavy Rotation";
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function sortSongs(songs: Song[], sortBy: string, order: "asc" | "desc" = "asc"): Song[] {
  const sorted = [...songs].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "album":
        return a.album.localeCompare(b.album);
      case "playCount":
        return a.playCount - b.playCount;
      case "duration":
        return a.duration - b.duration;
      case "dateAdded":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "lastPlayed":
        return new Date(a.lastPlayed).getTime() - new Date(b.lastPlayed).getTime();
      default:
        return 0;
    }
  });
  return order === "desc" ? sorted.reverse() : sorted;
}

export function filterSongs(songs: Song[], query: string): Song[] {
  if (!query.trim()) return songs;
  const q = query.toLowerCase();
  return songs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
  );
}

export function paginateItems<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}

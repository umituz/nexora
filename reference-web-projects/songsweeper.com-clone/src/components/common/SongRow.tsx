import { cn } from "@/lib/utils";
import type { Song } from "@/data/types";
import { formatDuration } from "@/lib/calculations";
import { Heart, Play, Trash2 } from "lucide-react";

interface SongRowProps {
  song: Song;
  index?: number;
  showAlbum?: boolean;
  showPlayCount?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPlay?: (id: string) => void;
  className?: string;
  compact?: boolean;
}

export function SongRow({
  song,
  index,
  showAlbum = true,
  showPlayCount = true,
  onFavoriteToggle,
  onDelete,
  onPlay,
  className,
  compact = false,
}: SongRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors",
        className
      )}
    >
      <div className="w-8 text-center shrink-0">
        <span className="text-xs text-muted-foreground group-hover:hidden">
          {index != null ? index + 1 : "—"}
        </span>
        <button
          onClick={() => onPlay?.(song.id)}
          className="hidden group-hover:block text-primary"
          aria-label="Play"
        >
          <Play size={14} fill="currentColor" />
        </button>
      </div>

      {!compact && (
        <img
          src={song.albumArt}
          alt={song.album}
          className="w-9 h-9 rounded-md object-cover shrink-0"
          loading="lazy"
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>

      {showAlbum && (
        <p className="hidden md:block text-xs text-muted-foreground w-32 truncate">{song.album}</p>
      )}

      {showPlayCount && (
        <p className="hidden sm:block text-xs text-muted-foreground w-16 text-right">{song.playCount} plays</p>
      )}

      <p className="text-xs text-muted-foreground w-12 text-right">{formatDuration(song.duration)}</p>

      {onFavoriteToggle && (
        <button
          onClick={() => onFavoriteToggle(song.id)}
          className={cn(
            "p-1 rounded transition-colors",
            song.isFavorite ? "text-accent" : "text-muted-foreground/40 hover:text-accent"
          )}
          aria-label={song.isFavorite ? "Unfavorite" : "Favorite"}
        >
          <Heart size={14} fill={song.isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(song.id)}
          className="p-1 rounded text-muted-foreground/40 hover:text-destructive transition-colors"
          aria-label="Queue for deletion"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

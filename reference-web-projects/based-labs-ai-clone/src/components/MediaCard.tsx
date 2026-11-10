import { Link } from "react-router-dom";
import { forwardRef } from "react";
import type { MediaItem } from "@/types";
import { Play } from "lucide-react";

interface MediaCardProps {
  item: MediaItem;
  className?: string;
}

export const MediaCard = forwardRef<HTMLAnchorElement, MediaCardProps>(
  function MediaCard({ item, className = "" }, ref) {
    return (
      <Link ref={ref} to={`/media/${item.id}`} className={`group block ${className}`}>
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-card">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={item.thumbnailUrl}
              alt={item.prompt}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                  <Play className="h-4 w-4 text-foreground" />
                </div>
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={item.userAvatar} alt={item.username} className="h-5 w-5 rounded-full" />
                <span className="text-xs text-muted-foreground">{item.username}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>👍{item.reactions.likes}</span>
                <span>❤️{item.reactions.hearts}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

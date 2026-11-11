import { useParams, Link } from "react-router-dom";
import { useLibrary } from "@/hooks/useLibrary";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDuration, formatDate, getPlayCountCategory } from "@/lib/calculations";
import { Music, ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { useToast } from "@/hooks/use-toast";

export default function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { songs, toggleFavorite, queueForDeletion, deletionQueueIds } = useLibrary();
  const { toast } = useToast();
  const song = songs.find((s) => s.id === id);

  if (!song) return <EmptyState icon={<Music size={48} />} title="Song Not Found" />;

  const inQueue = deletionQueueIds.includes(song.id);

  const handleQueue = () => {
    if (inQueue) return;
    queueForDeletion([song.id]);
    toast({ title: "Added to Deletion Queue" });
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={ROUTES.LIBRARY}><ArrowLeft size={14} className="mr-1" /> Back to Library</Link>
      </Button>
      <div className="max-w-2xl">
        <div className="flex items-start gap-4 mb-6 flex-wrap">
          <img src={song.albumArt} alt={song.album} className="w-32 h-32 rounded-xl object-cover shadow-lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-serif text-foreground break-words">{song.title}</h1>
            <p className="text-muted-foreground">{song.artist}</p>
            <p className="text-sm text-muted-foreground mt-1">{song.album} · Track {song.trackNumber}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => toggleFavorite(song.id)}>
                <Heart size={14} className="mr-1" fill={song.isFavorite ? "currentColor" : "none"} />
                {song.isFavorite ? "Favorited" : "Favorite"}
              </Button>
              <Button size="sm" variant="outline" disabled={inQueue} onClick={handleQueue}>
                <Trash2 size={14} className="mr-1" />
                {inQueue ? "In Deletion Queue" : "Queue for Deletion"}
              </Button>
            </div>
          </div>
        </div>
        <div className="glass-card divide-y divide-border">
          {([
            ["Duration", formatDuration(song.duration)],
            ["Play Count", `${song.playCount} (${getPlayCountCategory(song.playCount)})`],
            ["Genre", song.genre],
            ["Year", String(song.year)],
            ["Date Added", formatDate(song.dateAdded)],
            ["Last Played", formatDate(song.lastPlayed)],
            ["Tags", song.tags.length > 0 ? song.tags.join(", ") : "None"],
          ] as const).map(([label, value]) => (
            <div key={label} className="flex justify-between px-4 py-3 gap-3">
              <span className="text-sm text-muted-foreground shrink-0">{label}</span>
              <span className="text-sm font-medium text-foreground text-right break-words">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

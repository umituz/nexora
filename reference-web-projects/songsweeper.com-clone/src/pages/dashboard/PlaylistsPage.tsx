import { Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { formatDuration } from "@/lib/calculations";
import { ListMusic } from "lucide-react";

export default function PlaylistsPage() {
  return (
    <div>
      <PageHeader title="Playlists" description={`${mockData.playlists.length} playlists`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockData.playlists.map((pl) => (
          <Link
            key={pl.id}
            to={`/dashboard/playlists/${pl.id}`}
            className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4 p-4">
              <img src={pl.coverArt} alt={pl.name} className="w-16 h-16 rounded-lg object-cover shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="font-medium truncate text-foreground">{pl.name}</p>
                <p className="text-xs text-muted-foreground">{pl.songCount} songs · {formatDuration(pl.totalDuration)}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pl.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

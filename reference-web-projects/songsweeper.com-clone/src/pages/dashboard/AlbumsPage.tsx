import { Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { formatDuration } from "@/lib/calculations";

export default function AlbumsPage() {
  return (
    <div>
      <PageHeader title="Albums" description={`${mockData.albums.length} albums in your library`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockData.albums.map((album) => (
          <Link
            key={album.id}
            to={`/dashboard/albums/${album.id}`}
            className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform"
          >
            <img src={album.albumArt} alt={album.title} className="w-full aspect-square object-cover" loading="lazy" />
            <div className="p-3">
              <p className="text-sm font-medium truncate text-foreground">{album.title}</p>
              <p className="text-xs text-muted-foreground truncate">{album.artist}</p>
              <p className="text-xs text-muted-foreground mt-1">{album.songCount} songs · {formatDuration(album.totalDuration)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

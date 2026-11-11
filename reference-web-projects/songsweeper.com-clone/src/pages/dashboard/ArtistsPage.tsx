import { Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { formatNumber } from "@/lib/calculations";

export default function ArtistsPage() {
  return (
    <div>
      <PageHeader title="Artists" description={`${mockData.artists.length} artists in your library`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockData.artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/dashboard/artists/${artist.id}`}
            className="glass-card p-4 text-center group hover:scale-[1.02] transition-transform"
          >
            <img src={artist.avatar} alt={artist.name} className="w-20 h-20 rounded-full mx-auto mb-3 bg-muted" loading="lazy" />
            <p className="text-sm font-medium truncate text-foreground">{artist.name}</p>
            <p className="text-xs text-muted-foreground">{artist.albumCount} albums · {formatNumber(artist.totalPlays)} plays</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

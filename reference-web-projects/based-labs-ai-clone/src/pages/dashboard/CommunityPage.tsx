import { MOCK_LEADERBOARD, MOCK_MEDIA } from "@/data/mock-data";
import { MediaCard } from "@/components/MediaCard";
import { formatNumber } from "@/utils/formatters";

export default function CommunityPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Community</h1>
      <p className="text-sm text-muted-foreground mt-1">Explore what others are creating</p>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold mb-4">Top Creators</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_LEADERBOARD.slice(0, 6).map((entry) => (
            <div key={entry.userId} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <span className="text-lg font-bold text-muted-foreground w-6">#{entry.rank}</span>
              <img src={entry.avatar} alt={entry.username} className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{entry.username}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(entry.totalGenerations)} generations · {formatNumber(entry.totalLikes)} likes</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4">Trending Creations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {MOCK_MEDIA.slice(0, 10).map((item) => (<MediaCard key={item.id} item={item} />))}
        </div>
      </section>
    </div>
  );
}

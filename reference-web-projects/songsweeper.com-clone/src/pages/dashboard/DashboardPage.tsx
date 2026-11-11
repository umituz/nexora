import { Link } from "react-router-dom";
import { useLibrary } from "@/hooks/useLibrary";
import { calculateLibraryStats, calculateDuplicateStats, formatPlaytime, formatNumber, formatRelativeDate } from "@/lib/calculations";
import { FEATURES, ROUTES } from "@/constants/app";
import { mockData } from "@/data/mockData";
import { StatCard } from "@/components/common/StatCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Music, Disc, Users, Clock, Copy, Disc3, TrendingDown, TrendingUp, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FEATURE_ICONS: Record<string, React.ElementType> = { Copy, Disc3, TrendingDown, TrendingUp, Trash2 };
const GRADIENT_MAP: Record<string, string> = {
  duplicates: "feature-gradient-duplicates",
  "split-albums": "feature-gradient-split-albums",
  "least-played": "feature-gradient-least-played",
  "most-played": "feature-gradient-most-played",
  "deletion-queue": "feature-gradient-deletion",
};

export default function DashboardPage() {
  const { songs, duplicates, splitAlbums, deletionQueueIds, history } = useLibrary();
  const stats = calculateLibraryStats(songs);
  const dupStats = calculateDuplicateStats(duplicates.filter((d) => !d.resolved));

  const leastPlayed = songs.filter((s) => s.playCount <= 5).length;
  const mostPlayed = songs.filter((s) => s.playCount >= 50).length;

  const featureCounts: Record<string, number> = {
    duplicates: dupStats.totalDuplicates,
    "split-albums": splitAlbums.filter((s) => !s.unified).length,
    "least-played": leastPlayed,
    "most-played": mostPlayed,
    "deletion-queue": deletionQueueIds.length,
  };

  return (
    <div>
      <PageHeader title="Your Library" description={`Last scanned ${formatRelativeDate(mockData.user.lastScan)}`}>
        <Button asChild variant="outline" size="sm">
          <Link to={ROUTES.SCAN}>Run Scan</Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Songs" value={formatNumber(stats.totalSongs)} icon={<Music size={18} />} gradient="bg-primary" />
        <StatCard label="Albums" value={formatNumber(stats.totalAlbums)} icon={<Disc size={18} />} gradient="feature-gradient-split-albums" />
        <StatCard label="Artists" value={formatNumber(stats.totalArtists)} icon={<Users size={18} />} gradient="feature-gradient-least-played" />
        <StatCard label="Playtime" value={formatPlaytime(stats.totalPlaytime)} icon={<Clock size={18} />} gradient="feature-gradient-most-played" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = FEATURE_ICONS[feature.icon] || Copy;
          const count = featureCounts[feature.key] ?? 0;
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                to={feature.route}
                className={`block p-5 rounded-2xl text-primary-foreground transition-transform hover:scale-[1.02] ${GRADIENT_MAP[feature.key]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={22} />
                  <ArrowRight size={16} className="opacity-60" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm opacity-80 mt-0.5">
                  {count > 0 ? `${count} items found` : "No issues found"}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-foreground">Recent Activity</h2>
          <Link to={ROUTES.HISTORY} className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="glass-card divide-y divide-border">
          {history.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeDate(item.timestamp)}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.itemCount} items</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

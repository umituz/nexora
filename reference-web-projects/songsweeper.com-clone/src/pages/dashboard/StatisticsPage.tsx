import { useMemo } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { calculateLibraryStats, formatPlaytime, formatNumber, getPlayCountCategory } from "@/lib/calculations";
import { mockData } from "@/data/mockData";
import { Music, Disc, Users, Clock, BarChart3, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["hsl(210,80%,55%)", "hsl(152,60%,45%)", "hsl(25,90%,55%)", "hsl(45,90%,55%)", "hsl(0,72%,55%)", "hsl(280,60%,55%)"];

export default function StatisticsPage() {
  const { songs } = useLibrary();
  const stats = calculateLibraryStats(songs);

  const genreData = useMemo(() => {
    const map = new Map<string, number>();
    songs.forEach((s) => map.set(s.genre, (map.get(s.genre) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [songs]);

  const playCountDist = useMemo(() => {
    const map = new Map<string, number>();
    songs.forEach((s) => {
      const cat = getPlayCountCategory(s.playCount);
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [songs]);

  const topArtists = useMemo(() =>
    [...mockData.artists].sort((a, b) => b.totalPlays - a.totalPlays).slice(0, 10).map((a) => ({ name: a.name, plays: a.totalPlays })),
  []);

  const favCount = songs.filter((s) => s.isFavorite).length;

  return (
    <div>
      <PageHeader title="Statistics" description="Insights about your music library" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Songs" value={formatNumber(stats.totalSongs)} icon={<Music size={18} />} gradient="bg-primary" />
        <StatCard label="Albums" value={formatNumber(stats.totalAlbums)} icon={<Disc size={18} />} gradient="feature-gradient-split-albums" />
        <StatCard label="Artists" value={formatNumber(stats.totalArtists)} icon={<Users size={18} />} gradient="feature-gradient-least-played" />
        <StatCard label="Playtime" value={formatPlaytime(stats.totalPlaytime)} icon={<Clock size={18} />} gradient="feature-gradient-most-played" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Plays" value={formatNumber(stats.totalPlays)} icon={<BarChart3 size={18} />} gradient="bg-primary" />
        <StatCard label="Avg Plays/Song" value={stats.avgPlaysPerSong} />
        <StatCard label="Favorites" value={favCount} icon={<Heart size={18} />} gradient="feature-gradient-deletion" />
        <StatCard label="Genres" value={genreData.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Genre Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genreData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-4">Top Artists by Plays</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topArtists} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="plays" fill="hsl(220,40%,40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Play Count Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playCountDist}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(25,60%,48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

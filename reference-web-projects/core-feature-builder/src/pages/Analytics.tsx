import { useMemo, useState } from "react";
import { Eye, TrendingUp, Users, ThumbsUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useAppStore } from "@/store/appStore";
import { FORMAT_LABELS, PLATFORMS, type Platform } from "@/lib/data";

const formatNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

const RANGES = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
];

export default function Analytics() {
  const posts = useAppStore((s) => s.posts);
  const [timeRange, setTimeRange] = useState("30d");
  const days = RANGES.find((r) => r.id === timeRange)!.days;

  const published = posts.filter((p) => p.status === "published");

  const kpis = useMemo(() => {
    const totalViews = published.reduce((acc, p) => acc + p.views, 0);
    const totalLikes = published.reduce((acc, p) => acc + p.likes, 0);
    const engagement = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0";
    const avgViews = published.length > 0 ? Math.round(totalViews / published.length) : 0;
    return [
      { label: "Total Views", value: formatNum(totalViews), change: "+18.2%", up: true, icon: Eye },
      { label: "Engagement Rate", value: `${engagement}%`, change: "+0.5%", up: true, icon: ThumbsUp },
      { label: "Followers Gained", value: formatNum(Math.floor(totalViews * 0.02)), change: "+12%", up: true, icon: Users },
      { label: "Avg. Views/Post", value: formatNum(avgViews), change: "-3%", up: false, icon: TrendingUp },
    ];
  }, [published]);

  const viewsData = useMemo(() => {
    // Build a synthetic but consistent series based on published posts
    const total = published.reduce((a, p) => a + p.views, 0) || 10000;
    const points = days <= 7 ? 7 : days <= 30 ? 9 : 12;
    return Array.from({ length: points }, (_, i) => {
      const t = (i + 1) / points;
      const base = total * t * (0.5 + Math.sin(i) * 0.1 + i * 0.05);
      const date = new Date();
      date.setDate(date.getDate() - (days - Math.round((days * (i + 1)) / points)));
      return {
        day: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        views: Math.max(100, Math.round(base / points)),
      };
    });
  }, [published, days]);

  const platformData = useMemo(() => {
    const colors: Record<Platform, string> = {
      TikTok: "hsl(0, 0%, 15%)",
      Reels: "hsl(15, 90%, 55%)",
      Shorts: "hsl(0, 84%, 60%)",
    };
    return PLATFORMS.map((platform) => {
      const platformPosts = published.filter((p) => p.platforms.includes(platform));
      const views = platformPosts.reduce((a, p) => a + p.views, 0);
      return { platform, views: views || 1, color: colors[platform] };
    }).filter((p) => p.views > 1 || published.length === 0);
  }, [published]);

  const contentPerformance = useMemo(() => {
    const formats = Array.from(new Set(published.map((p) => p.format)));
    return formats.map((f) => {
      const ps = published.filter((p) => p.format === f);
      const views = ps.reduce((a, p) => a + p.views, 0);
      return {
        type: FORMAT_LABELS[f],
        count: ps.length,
        avgViews: ps.length > 0 ? Math.round(views / ps.length) : 0,
      };
    });
  }, [published]);

  const topContent = useMemo(
    () => [...published].sort((a, b) => b.views - a.views).slice(0, 5),
    [published]
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your content performance across platforms</p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === r.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={cn(
                  "text-xs font-medium flex items-center gap-0.5 px-2 py-0.5 rounded-full",
                  kpi.up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                )}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border">
        <CardHeader className="pb-2"><CardTitle className="text-base">Views Over Time</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(15, 90%, 55%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(15, 90%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 80%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 80%)" />
                <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 13%, 91%)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="views" stroke="hsl(15, 90%, 55%)" strokeWidth={2} fill="url(#viewsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Platform Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="views">
                    {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${formatNum(value)} views`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 flex-wrap">
              {platformData.map((p) => (
                <div key={p.platform} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-muted-foreground">{p.platform}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Content Type Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              {contentPerformance.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No published content yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contentPerformance}>
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 80%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 80%)" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(15, 90%, 55%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader className="pb-2"><CardTitle className="text-base">Top Performing Content</CardTitle></CardHeader>
        <CardContent>
          {topContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Publish content to see analytics here.</p>
          ) : (
            <div className="space-y-2">
              {topContent.map((post, i) => (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <div className="text-2xl">{post.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.platforms.join(", ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-foreground">{formatNum(post.views)}</p>
                    <p className="text-xs text-success flex items-center justify-end gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> {formatNum(post.likes)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

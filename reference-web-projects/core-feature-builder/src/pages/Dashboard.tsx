import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, TrendingUp, Video, Zap, ArrowUpRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import { FORMAT_LABELS } from "@/lib/data";

const formatNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

export default function Dashboard() {
  const posts = useAppStore((s) => s.posts);

  const stats = useMemo(() => {
    const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
    const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
    const published = posts.filter((p) => p.status === "published");
    const scheduled = posts.filter((p) => p.status === "scheduled");
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0";
    return [
      { label: "Total Views", value: formatNum(totalViews), change: "+18%", icon: Eye },
      { label: "Videos Created", value: posts.length.toString(), change: `+${posts.length}`, icon: Video },
      { label: "Engagement Rate", value: `${engagementRate}%`, change: "+0.5%", icon: TrendingUp },
      { label: "Scheduled Posts", value: scheduled.length.toString(), change: "this week", icon: Calendar },
    ];
  }, [posts]);

  const recent = posts.slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your marketing command center</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/blitz"><Zap className="w-4 h-4 mr-1" /> Blitz Mode</Link>
          </Button>
          <Button asChild>
            <Link to="/create"><Video className="w-4 h-4 mr-1" /> Create Content</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="gradient-warm border-0 col-span-1 lg:col-span-2 overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary-foreground">Ready to go viral?</h3>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Swipe through AI-generated content tailored to your brand.
              </p>
              <Button variant="secondary" className="mt-4" asChild>
                <Link to="/blitz"><Zap className="w-4 h-4 mr-1" /> Start Blitz Mode</Link>
              </Button>
            </div>
            <Zap className="w-24 h-24 text-primary-foreground/20" />
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">Trending Now</h3>
            <p className="text-sm text-muted-foreground mb-4">9 new trending videos in your niche</p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/trending">Browse Trending <ArrowUpRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Recent Content
            <Button variant="ghost" size="sm" asChild>
              <Link to="/calendar">View all</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No content yet. <Link to="/create" className="text-primary underline">Create your first video</Link>.
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((post) => (
                <Link
                  key={post.id}
                  to={`/editor?id=${post.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg shrink-0">
                      {post.thumbnail}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {FORMAT_LABELS[post.format]} · {post.platforms.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {post.views > 0 ? formatNum(post.views) : "—"}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        post.status === "published"
                          ? "text-success border-success/30 text-xs"
                          : post.status === "scheduled"
                          ? "text-warning border-warning/30 text-xs"
                          : "text-muted-foreground text-xs"
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

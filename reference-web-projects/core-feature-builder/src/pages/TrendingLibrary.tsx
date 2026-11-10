import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Play, TrendingUp, Eye, Flame, Sparkles, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TRENDING_VIDEOS, type TrendingVideo } from "@/lib/data";
import { useAppStore } from "@/store/appStore";
import { TrendingDetailDialog } from "@/components/dialogs/TrendingDetailDialog";

const categories = ["All", "SaaS", "E-commerce", "Fitness", "Finance", "Food", "Tech"];
const sortOptions = [
  { id: "trending", label: "Trending" },
  { id: "views", label: "Most Viewed" },
  { id: "growth", label: "Fastest Growing" },
];

export default function TrendingLibrary() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [selected, setSelected] = useState<TrendingVideo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const favorites = useAppStore((s) => s.favoriteTrending);
  const toggleFavorite = useAppStore((s) => s.toggleFavoriteTrending);

  const parseViews = (v: string) => {
    const n = parseFloat(v);
    return v.includes("M") ? n * 1000 : n;
  };
  const parseGrowth = (g: string) => parseFloat(g.replace(/[+%]/g, ""));

  const filtered = TRENDING_VIDEOS.filter((v) => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "views") return parseViews(b.views) - parseViews(a.views);
    if (sortBy === "growth") return parseGrowth(b.growth) - parseGrowth(a.growth);
    return Number(b.trending) - Number(a.trending);
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Trending Content</h1>
        </div>
        <p className="text-muted-foreground text-sm">Browse and remix the latest viral content for your brand</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trending videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters((s) => !s)}>
          <Filter className="w-4 h-4 mr-1" /> Sort
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 flex-wrap animate-fade-up">
          {sortOptions.map((opt) => (
            <Button
              key={opt.id}
              variant={sortBy === opt.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(opt.id)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((video) => (
          <div
            key={video.id}
            className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <button
              onClick={() => setSelected(video)}
              className="relative aspect-[9/16] max-h-[280px] w-full bg-secondary flex items-center justify-center overflow-hidden"
            >
              <span className="text-6xl">{video.thumbnail}</span>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                </div>
              </div>
              {video.trending && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" /> Trending
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(video.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background"
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    favorites.includes(video.id)
                      ? "fill-destructive text-destructive"
                      : "text-muted-foreground"
                  )}
                />
              </button>
              <div className="absolute bottom-2 right-2 bg-foreground/70 text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                {video.duration}
              </div>
            </button>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{video.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {video.views}
                </div>
                <span className="text-success font-medium">{video.growth}</span>
              </div>
              <Button size="sm" className="w-full text-xs" onClick={() => setSelected(video)}>
                <Sparkles className="w-3 h-3 mr-1" /> Remix for My Brand
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No videos match your search.</div>
      )}

      <TrendingDetailDialog video={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}

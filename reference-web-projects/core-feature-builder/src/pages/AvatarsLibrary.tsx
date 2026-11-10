import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Play, Heart, Globe, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AVATARS, type Avatar } from "@/lib/data";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";

const styles = ["All", "Professional", "Casual", "Energetic", "Friendly", "Authoritative", "Trendy"];
const ethnicities = ["All", "Caucasian", "Asian", "Black", "Hispanic", "Middle Eastern"];

export default function AvatarsLibrary() {
  const navigate = useNavigate();
  const favorites = useAppStore((s) => s.favoriteAvatars);
  const toggleFav = useAppStore((s) => s.toggleFavoriteAvatar);
  const addPost = useAppStore((s) => s.addPost);

  const [activeStyle, setActiveStyle] = useState("All");
  const [activeEthnicity, setActiveEthnicity] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Avatar | null>(null);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const filtered = AVATARS.filter((a) => {
    const s = activeStyle === "All" || a.style === activeStyle;
    const e = activeEthnicity === "All" || a.ethnicity === activeEthnicity;
    const q = a.name.toLowerCase().includes(search.toLowerCase());
    const f = !onlyFavs || favorites.includes(a.id);
    return s && e && q && f;
  });

  const useAvatar = (avatarId: number) => {
    const id = addPost({
      title: "New video",
      format: "green-screen",
      topic: "",
      script: "",
      avatarId,
      caption: "Stop scrolling. Start building.",
      captionStyleId: 1,
      musicId: 1,
      platforms: ["TikTok"],
      status: "draft",
      scheduledAt: null,
      publishedAt: null,
      thumbnail: AVATARS.find((a) => a.id === avatarId)?.emoji ?? "✨",
    });
    toast.success("Avatar selected", { description: "Opening editor..." });
    setSelected(null);
    navigate(`/editor?id=${id}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" /> 500+ AI Avatars
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Avatar Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Hyper-realistic AI creators that deliver your message in 30+ languages.
          </p>
        </div>
        <Button onClick={() => toast.success("Custom avatar request sent")}>
          <Sparkles className="w-4 h-4 mr-1" /> Create Custom Avatar
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search avatars..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant={onlyFavs ? "default" : "outline"} onClick={() => setOnlyFavs((v) => !v)}>
          <Heart className={cn("w-4 h-4 mr-1", onlyFavs && "fill-current")} /> Favorites ({favorites.length})
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Style</p>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <Button key={s} variant={activeStyle === s ? "default" : "outline"} size="sm" onClick={() => setActiveStyle(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Ethnicity</p>
          <div className="flex flex-wrap gap-2">
            {ethnicities.map((e) => (
              <Button key={e} variant={activeEthnicity === e ? "default" : "outline"} size="sm" onClick={() => setActiveEthnicity(e)}>
                {e}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filtered.map((avatar) => (
          <Card key={avatar.id} className="group overflow-hidden border hover:shadow-lg transition-all hover:-translate-y-1">
            <button onClick={() => setSelected(avatar)} className="relative w-full aspect-[3/4] bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <span className="text-7xl">{avatar.emoji}</span>
              {avatar.popular && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">Popular</Badge>
              )}
              <div
                onClick={(e) => { e.stopPropagation(); toggleFav(avatar.id); }}
                role="button"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background"
              >
                <Heart className={cn("w-4 h-4", favorites.includes(avatar.id) ? "fill-destructive text-destructive" : "text-muted-foreground")} />
              </div>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Badge variant="secondary" className="gap-1"><Play className="w-3 h-3 fill-current" /> Preview</Badge>
              </div>
            </button>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm text-foreground">{avatar.name}</p>
                <span className="text-xs text-muted-foreground">{avatar.age}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{avatar.style} · {avatar.gender}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {avatar.languages}</span>
                <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No avatars match your filters.</div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-[3/4] max-h-[280px] mx-auto bg-gradient-to-br from-accent to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-9xl">{selected.emoji}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">Style</p>
                    <p className="font-medium text-foreground">{selected.style}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{selected.age}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{selected.gender}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">Languages</p>
                    <p className="font-medium text-foreground">{selected.languages}</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => useAvatar(selected.id)}>
                  <Sparkles className="w-4 h-4 mr-1" /> Use this Avatar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Eye, TrendingUp, Sparkles, X, Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import { FORMAT_LABELS, type TrendingVideo } from "@/lib/data";
import { toast } from "sonner";

interface Props {
  video: TrendingVideo | null;
  open: boolean;
  onClose: () => void;
}

export function TrendingDetailDialog({ video, open, onClose }: Props) {
  const navigate = useNavigate();
  const addPost = useAppStore((s) => s.addPost);

  if (!video) return null;

  const handleRemix = () => {
    const id = addPost({
      title: `Remix: ${video.title}`,
      format: video.format,
      topic: video.title,
      script: video.hook,
      avatarId: 1,
      caption: video.title,
      captionStyleId: 1,
      musicId: 1,
      platforms: ["TikTok"],
      status: "draft",
      scheduledAt: null,
      publishedAt: null,
      thumbnail: video.thumbnail,
      remixOfId: video.id,
    });
    toast.success("Remix created", { description: "Opening editor..." });
    onClose();
    navigate(`/editor?id=${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Video preview mock */}
          <div className="relative aspect-[9/16] md:aspect-auto bg-foreground flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-foreground to-foreground" />
            <span className="text-9xl relative z-10">{video.thumbnail}</span>
            <button className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-background/90 flex items-center justify-center hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-foreground fill-current ml-1" />
            </button>
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary-foreground truncate">{video.creator}</p>
                <p className="text-[10px] text-primary-foreground/70">{video.duration}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <Badge className="bg-accent text-accent-foreground border-0">
                {FORMAT_LABELS[video.format]}
              </Badge>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{video.title}</h2>
            <p className="text-sm text-muted-foreground italic mb-4">"{video.hook}"</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Eye className="w-3 h-3" /> Views
                </div>
                <p className="text-lg font-bold text-foreground">{video.views}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="w-3 h-3" /> Growth
                </div>
                <p className="text-lg font-bold text-success">{video.growth}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                Category
              </p>
              <Badge variant="secondary">{video.category}</Badge>
            </div>

            <div className="mt-auto space-y-2">
              <Button className="w-full" onClick={handleRemix}>
                <Sparkles className="w-4 h-4 mr-1" /> Remix for My Brand
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We'll auto-adapt the script and visuals for your brand.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

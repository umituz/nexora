import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X, RotateCcw, Share2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { BLITZ_IDEAS, FORMAT_LABELS } from "@/lib/data";
import { toast } from "sonner";

export default function BlitzMode() {
  const navigate = useNavigate();
  const likedIdeas = useAppStore((s) => s.likedIdeas);
  const skippedIdeas = useAppStore((s) => s.skippedIdeas);
  const toggleLikedIdea = useAppStore((s) => s.toggleLikedIdea);
  const addSkippedIdea = useAppStore((s) => s.addSkippedIdea);
  const resetBlitz = useAppStore((s) => s.resetBlitz);
  const addPost = useAppStore((s) => s.addPost);

  const queue = useMemo(
    () => BLITZ_IDEAS.filter((i) => !likedIdeas.includes(i.id) && !skippedIdeas.includes(i.id)),
    [likedIdeas, skippedIdeas]
  );

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const current = queue[0];
  const isFinished = queue.length === 0;

  const handleSwipe = (dir: "left" | "right") => {
    if (!current) return;
    setSwipeDirection(dir);
    setTimeout(() => {
      if (dir === "right") {
        toggleLikedIdea(current.id);
        toast.success("Saved to your queue");
      } else {
        addSkippedIdea(current.id);
      }
      setSwipeDirection(null);
    }, 350);
  };

  const handleConvertToDraft = (ideaId: number) => {
    const idea = BLITZ_IDEAS.find((i) => i.id === ideaId);
    if (!idea) return;
    const id = addPost({
      title: idea.title,
      format: idea.format,
      topic: idea.title,
      script: idea.preview,
      avatarId: 1,
      caption: idea.title,
      captionStyleId: 1,
      musicId: 1,
      platforms: ["TikTok"],
      status: "draft",
      scheduledAt: null,
      publishedAt: null,
      thumbnail: "✨",
    });
    toast.success("Draft created");
    navigate(`/editor?id=${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 gradient-hero">
      <div className="text-center mb-6 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" /> Blitz Mode
        </div>
        <h1 className="text-3xl font-bold text-foreground">Swipe Your Content</h1>
        <p className="text-muted-foreground mt-1">
          {isFinished
            ? `Done! You saved ${likedIdeas.length} of ${BLITZ_IDEAS.length} ideas.`
            : `${BLITZ_IDEAS.length - queue.length + 1} of ${BLITZ_IDEAS.length}`}
        </p>
      </div>

      <div className="relative w-full max-w-md h-[480px] mb-8">
        {isFinished ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">All caught up!</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              You saved {likedIdeas.length} ideas. Convert any of them to a draft below.
            </p>
            <Button variant="outline" onClick={resetBlitz}>
              <RotateCcw className="w-4 h-4 mr-1" /> Start Over
            </Button>
          </div>
        ) : (
          <>
            {queue[2] && (
              <div className="absolute inset-0 top-4 scale-[0.92] opacity-40">
                <div className="w-full h-full rounded-2xl bg-card border shadow-sm" />
              </div>
            )}
            {queue[1] && (
              <div className="absolute inset-0 top-2 scale-[0.96] opacity-60">
                <div className="w-full h-full rounded-2xl bg-card border shadow-sm" />
              </div>
            )}

            <div
              className={cn(
                "absolute inset-0 rounded-2xl bg-card border shadow-lg p-6 flex flex-col cursor-grab active:cursor-grabbing transition-transform",
                swipeDirection === "right" && "animate-swipe-right",
                swipeDirection === "left" && "animate-swipe-left"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  {FORMAT_LABELS[current!.format]}
                </Badge>
                <span className="text-xs text-muted-foreground">AI Avatar: {current!.avatar}</span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-3">{current!.title}</h2>

              <div className="bg-secondary rounded-xl p-4 mb-4 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Hook</p>
                <p className="text-sm font-medium text-foreground mb-3">"{current!.hook}"</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Preview</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {current!.preview}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {current!.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {!isFinished && (
        <div className="flex items-center gap-6 animate-fade-up mb-8">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full border-2 border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-110"
            aria-label="Skip"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center text-primary-foreground shadow-glow hover:scale-110 transition-all animate-pulse-glow"
            aria-label="Save idea"
          >
            <Heart className="w-7 h-7" />
          </button>
          <button
            onClick={() => current && handleConvertToDraft(current.id)}
            className="w-14 h-14 rounded-full border-2 border-info/30 flex items-center justify-center text-info hover:bg-info hover:text-info-foreground transition-all hover:scale-110"
            aria-label="Convert to draft"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Liked queue */}
      {likedIdeas.length > 0 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Saved Ideas ({likedIdeas.length})
          </h3>
          <div className="space-y-2">
            {likedIdeas.map((id) => {
              const idea = BLITZ_IDEAS.find((i) => i.id === id);
              if (!idea) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border hover:shadow-sm transition-shadow"
                >
                  <Heart className="w-4 h-4 text-primary fill-current shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{idea.title}</p>
                    <p className="text-xs text-muted-foreground">{FORMAT_LABELS[idea.format]}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleConvertToDraft(id)}>
                    <Wand2 className="w-3 h-3 mr-1" /> Create
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

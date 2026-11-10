import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Play, Pause, Music, Type, Image as ImageIcon, Sparkles, Download,
  Share2, Wand2, Volume2, Scissors, Layers, Smile, Calendar as CalIcon,
  ArrowLeft, Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { MUSIC_TRACKS, CAPTION_STYLES, AVATARS } from "@/lib/data";
import { ScheduleDialog } from "@/components/dialogs/ScheduleDialog";
import { toast } from "sonner";

const tools = [
  { id: "captions", label: "Captions", icon: Type },
  { id: "music", label: "Music", icon: Music },
  { id: "media", label: "B-Roll", icon: ImageIcon },
  { id: "effects", label: "Effects", icon: Sparkles },
  { id: "voice", label: "Voice", icon: Volume2 },
  { id: "trim", label: "Trim", icon: Scissors },
];

export default function VideoEditor() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const postId = params.get("id");

  const posts = useAppStore((s) => s.posts);
  const updatePost = useAppStore((s) => s.updatePost);
  const publishPost = useAppStore((s) => s.publishPost);
  const addPost = useAppStore((s) => s.addPost);

  // If no id, fall back to most recent draft, or create one
  const post = useMemo(() => {
    if (postId) return posts.find((p) => p.id === postId);
    return posts.find((p) => p.status === "draft") ?? posts[0];
  }, [postId, posts]);

  useEffect(() => {
    if (!post && posts.length === 0) {
      const id = addPost({
        title: "Untitled video",
        format: "wall-of-text",
        topic: "",
        script: "",
        avatarId: 1,
        caption: "Stop scrolling. Start building.",
        captionStyleId: 1,
        musicId: 1,
        platforms: ["TikTok"],
        status: "draft",
        scheduledAt: null,
        publishedAt: null,
        thumbnail: "✨",
      });
      navigate(`/editor?id=${id}`, { replace: true });
    } else if (!postId && post) {
      navigate(`/editor?id=${post.id}`, { replace: true });
    }
  }, [post, postId, posts.length, addPost, navigate]);

  const [activeTool, setActiveTool] = useState("captions");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState([35]);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">Loading…</div>
    );
  }

  const captionStyle = CAPTION_STYLES.find((s) => s.id === post.captionStyleId) ?? CAPTION_STYLES[0];
  const music = MUSIC_TRACKS.find((m) => m.id === post.musicId) ?? MUSIC_TRACKS[0];
  const avatar = AVATARS.find((a) => a.id === post.avatarId);

  const update = (patch: Partial<typeof post>) => updatePost(post.id, patch);

  const handlePublish = () => {
    publishPost(post.id);
    toast.success("Published!", { description: `Going live on ${post.platforms.join(", ")}` });
  };

  const handleExport = () => {
    toast.success("Exporting video", { description: "Your video will download shortly..." });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background animate-fade-up">
      {/* Left toolbar */}
      <aside className="lg:w-20 flex lg:flex-col flex-row border-b lg:border-b-0 lg:border-r bg-card">
        <button
          onClick={() => navigate(-1)}
          className="hidden lg:flex h-16 items-center justify-center border-b text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-3 lg:py-4 flex-1 lg:flex-none text-xs font-medium transition-colors",
              activeTool === t.id
                ? "bg-accent text-accent-foreground border-l-2 lg:border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <t.icon className="w-5 h-5" />
            <span>{t.label}</span>
          </button>
        ))}
      </aside>

      {/* Tool panel */}
      <aside className="lg:w-80 border-b lg:border-b-0 lg:border-r bg-card overflow-y-auto">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-foreground capitalize">{activeTool}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your video</p>
        </div>

        <div className="p-5 space-y-4">
          {activeTool === "captions" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Caption text
                </label>
                <Textarea
                  value={post.caption}
                  onChange={(e) => update({ caption: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CAPTION_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => update({ captionStyleId: s.id })}
                      className={cn(
                        "p-3 rounded-lg border-2 text-left transition-all",
                        post.captionStyleId === s.id
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <p className="text-lg font-bold text-foreground">{s.preview}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  update({ caption: post.script.split("\n")[0]?.slice(0, 80) || post.title });
                  toast.success("Captions auto-generated from script");
                }}
              >
                <Sparkles className="w-4 h-4 mr-1" /> Auto-generate captions
              </Button>
            </>
          )}

          {activeTool === "music" && (
            <div className="space-y-2">
              {MUSIC_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => update({ musicId: track.id })}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 flex items-center gap-3 text-left transition-all",
                    post.musicId === track.id
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{track.name}</p>
                      {track.trending && <Badge className="text-xs h-4 px-1.5">🔥</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{track.mood} · {track.duration}</p>
                  </div>
                  <Play className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {activeTool === "voice" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Voice volume
                </label>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Music volume
                </label>
                <Slider defaultValue={[30]} max={100} step={1} />
              </div>
              {avatar && (
                <div className="p-3 rounded-lg bg-secondary flex items-center gap-3">
                  <div className="text-3xl">{avatar.emoji}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{avatar.name}</p>
                    <p className="text-xs text-muted-foreground">{avatar.style} voice</p>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full" onClick={() => toast.success("Re-generating voiceover...")}>
                <Wand2 className="w-4 h-4 mr-1" /> Re-generate voiceover
              </Button>
            </>
          )}

          {activeTool === "effects" && (
            <div className="grid grid-cols-3 gap-2">
              {["Zoom", "Shake", "Glitch", "Blur", "Flash", "Vintage"].map((fx) => (
                <button
                  key={fx}
                  onClick={() => toast.success(`${fx} effect added`)}
                  className="aspect-square rounded-lg border-2 border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Smile className="w-5 h-5" />
                  {fx}
                </button>
              ))}
            </div>
          )}

          {activeTool === "media" && (
            <>
              <Button variant="outline" className="w-full" onClick={() => toast.success("B-roll picker opened")}>
                <ImageIcon className="w-4 h-4 mr-1" /> Add B-roll clip
              </Button>
              <p className="text-xs text-muted-foreground">
                Auto-suggested clips based on your script.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="aspect-video rounded-lg bg-muted hover:bg-secondary transition-colors flex items-center justify-center"
                    onClick={() => toast.success("Clip added to timeline")}
                  >
                    <Layers className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTool === "trim" && (
            <>
              <p className="text-xs text-muted-foreground">Drag the handles on the timeline to trim.</p>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Speed
                </label>
                <Slider defaultValue={[100]} min={50} max={200} step={5} />
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Preview + timeline */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b bg-card flex items-center justify-between px-5 gap-3">
          <Input
            value={post.title}
            onChange={(e) => update({ title: e.target.value })}
            className="border-0 shadow-none px-0 text-base font-semibold focus-visible:ring-0 max-w-xs"
          />
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.status}</Badge>
            <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
              <CalIcon className="w-4 h-4 mr-1" /> Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={handlePublish} disabled={post.status === "published"}>
              <Send className="w-4 h-4 mr-1" /> Publish
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-muted/40 p-6 overflow-auto">
          <Card className="relative w-full max-w-[280px] aspect-[9/16] overflow-hidden border shadow-xl bg-foreground">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-foreground to-foreground" />
            <CardContent className="relative h-full p-0 flex flex-col justify-end">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 text-center">
                <p className={cn("text-2xl font-extrabold leading-tight", captionStyle.className)}>
                  {post.caption}
                </p>
              </div>
              <div className="p-3 flex items-center gap-2 bg-gradient-to-t from-foreground/90 to-transparent">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {avatar?.emoji ?? "F"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary-foreground">@yourbrand</p>
                  <p className="text-[10px] text-primary-foreground/70">♪ {music.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t bg-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="default"
              className="rounded-full h-10 w-10 shrink-0"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </Button>
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              0:{Math.floor((progress[0] / 100) * 32).toString().padStart(2, "0")} / 0:32
            </span>
            <div className="flex-1">
              <Slider value={progress} onValueChange={setProgress} max={100} step={1} />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-10 rounded-md gradient-warm flex items-center px-3 text-xs font-medium text-primary-foreground">
              <Type className="w-3 h-3 mr-1.5" /> Caption · "{post.caption.slice(0, 40)}..."
            </div>
            <div className="h-10 rounded-md bg-info/20 border border-info/30 flex items-center px-3 text-xs font-medium text-info">
              <Music className="w-3 h-3 mr-1.5" /> {music.name}
            </div>
            {avatar && (
              <div className="h-10 rounded-md bg-secondary border flex items-center px-3 text-xs font-medium text-muted-foreground">
                <Volume2 className="w-3 h-3 mr-1.5" /> {avatar.name} voiceover
              </div>
            )}
          </div>
        </div>
      </main>

      <ScheduleDialog
        postId={post.id}
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </div>
  );
}

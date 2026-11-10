import { useState, useEffect } from "react";
import { Calendar as CalIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import { PLATFORMS, type Platform } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  postId: string | null;
  open: boolean;
  onClose: () => void;
  defaultDate?: string; // yyyy-mm-dd
}

export function ScheduleDialog({ postId, open, onClose, defaultDate }: Props) {
  const post = useAppStore((s) => s.posts.find((p) => p.id === postId));
  const schedulePost = useAppStore((s) => s.schedulePost);

  const [date, setDate] = useState(defaultDate ?? "");
  const [time, setTime] = useState("10:00");
  const [platforms, setPlatforms] = useState<Platform[]>(["TikTok"]);

  useEffect(() => {
    if (open && post) {
      setPlatforms(post.platforms.length ? post.platforms : ["TikTok"]);
      if (post.scheduledAt) {
        const d = new Date(post.scheduledAt);
        setDate(d.toISOString().slice(0, 10));
        setTime(d.toTimeString().slice(0, 5));
      } else {
        setDate(defaultDate ?? new Date().toISOString().slice(0, 10));
        setTime("10:00");
      }
    }
  }, [open, post, defaultDate]);

  const togglePlatform = (p: Platform) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleSchedule = () => {
    if (!postId || !date || platforms.length === 0) {
      toast.error("Please pick a date and at least one platform");
      return;
    }
    const iso = new Date(`${date}T${time}:00`).toISOString();
    schedulePost(postId, iso, platforms);
    toast.success("Scheduled", { description: `${platforms.join(", ")} on ${date} at ${time}` });
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalIcon className="w-5 h-5 text-primary" /> Schedule Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-secondary flex items-center gap-3">
            <div className="text-2xl">{post.thumbnail}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground">{post.format}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Publish to</Label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSchedule}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

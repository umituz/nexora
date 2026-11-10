import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Clock, Video, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { PLATFORM_COLORS } from "@/lib/data";
import { ScheduleDialog } from "@/components/dialogs/ScheduleDialog";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ContentCalendar() {
  const navigate = useNavigate();
  const posts = useAppStore((s) => s.posts);
  const deletePost = useAppStore((s) => s.deletePost);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string | undefined>();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
  const days = Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstDayOfWeek + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const scheduledPosts = posts.filter((p) => p.scheduledAt || p.publishedAt);

  const getPostsForDay = (day: number) => {
    return scheduledPosts.filter((p) => {
      const dateStr = p.scheduledAt ?? p.publishedAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const navigateMonth = (delta: number) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const handleDayClick = (day: number) => {
    const draft = posts.find((p) => p.status === "draft");
    if (!draft) {
      toast.error("Create a draft first", {
        description: "Go to Create or Blitz Mode to make content.",
        action: { label: "Create", onClick: () => navigate("/create") },
      });
      return;
    }
    setScheduleDate(new Date(currentYear, currentMonth, day).toISOString().slice(0, 10));
    setScheduleId(draft.id);
  };

  const upcoming = scheduledPosts
    .filter((p) => p.scheduledAt && new Date(p.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
    .slice(0, 5);

  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">Schedule and manage your content pipeline</p>
        </div>
        <Button onClick={() => navigate("/create")}>
          <Plus className="w-4 h-4 mr-1" /> Create New
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="grid grid-cols-7 border-b">
          {DAYS.map((d) => (
            <div key={d} className="p-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const postsForDay = day ? getPostsForDay(day) : [];
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[110px] p-2 border-b border-r last:border-r-0 transition-colors",
                  day ? "hover:bg-secondary/50 cursor-pointer" : "bg-muted/30",
                  isToday && "bg-accent/50"
                )}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        "text-sm font-medium inline-flex w-7 h-7 items-center justify-center rounded-full",
                        isToday && "gradient-warm text-primary-foreground"
                      )}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {postsForDay.slice(0, 3).map((post) => (
                        <button
                          key={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editor?id=${post.id}`);
                          }}
                          className={cn(
                            "block w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate",
                            PLATFORM_COLORS[post.platforms[0] ?? "TikTok"]
                          )}
                          title={post.title}
                        >
                          {post.title}
                        </button>
                      ))}
                      {postsForDay.length > 3 && (
                        <p className="text-[10px] text-muted-foreground px-1">+{postsForDay.length - 3} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Upcoming ({upcoming.length})</h3>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center bg-secondary/30 rounded-lg">
                No upcoming posts.
              </p>
            )}
            {upcoming.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
                <div className="text-2xl">{post.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {post.platforms.map((p) => <span key={p}>{p}</span>)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.scheduledAt!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.scheduledAt!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate(`/editor?id=${post.id}`)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { deletePost(post.id); toast.success("Deleted"); }}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Drafts ({drafts.length})</h3>
          <div className="space-y-2">
            {drafts.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center bg-secondary/30 rounded-lg">
                No drafts. Create one to schedule.
              </p>
            )}
            {drafts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="text-2xl">{post.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                  <Badge variant="outline" className="text-xs h-4 mt-0.5">Draft</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => setScheduleId(post.id)}>
                  Schedule
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScheduleDialog
        postId={scheduleId}
        open={!!scheduleId}
        onClose={() => { setScheduleId(null); setScheduleDate(undefined); }}
        defaultDate={scheduleDate}
      />
    </div>
  );
}

import { MOCK_THREADS } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "@/utils/formatters";
import { ThumbsUp, MessageSquare, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardThreadsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Threads</h1>
        <Button className="bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> New Thread</Button>
      </div>
      <div className="mt-6 space-y-3">
        {MOCK_THREADS.map((thread) => (
          <Link key={thread.id} to={`/threads/${thread.id}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-3">
              <img src={thread.authorAvatar} alt={thread.authorName} className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{thread.authorName}</span>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(thread.createdAt)}</span>
                </div>
                <h3 className="mt-1 font-semibold text-foreground">{thread.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{thread.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{thread.replies}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{thread.views}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

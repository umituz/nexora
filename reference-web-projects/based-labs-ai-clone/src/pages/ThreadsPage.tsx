import { Link } from "react-router-dom";
import { MOCK_THREADS } from "@/data/mock-data";
import { formatRelativeTime } from "@/utils/formatters";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

export default function ThreadsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Community Threads</h1>
      <p className="mt-2 text-center text-muted-foreground">Discuss AI, share tips, and connect with other creators.</p>
      <div className="mt-10 space-y-4">
        {MOCK_THREADS.map((thread) => (
          <Link key={thread.id} to={`/threads/${thread.id}`} className="block">
            <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50">
              <div className="flex items-start gap-4">
                <img src={thread.authorAvatar} alt={thread.authorName} className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{thread.authorName}</span>
                    <span className="text-xs text-muted-foreground">· {formatRelativeTime(thread.createdAt)}</span>
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{thread.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{thread.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {thread.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {thread.replies}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {thread.views}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

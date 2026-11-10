import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Eye, Send } from "lucide-react";
import { MOCK_THREADS } from "@/data/mock-data";
import { formatRelativeTime } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const thread = MOCK_THREADS.find((t) => t.id === threadId);
  const [reply, setReply] = useState("");

  if (!thread) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Thread not found.</p></div>;
  }

  const mockReplies = [
    { id: 1, author: "ai_enthusiast", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=enthusiast`, content: "Great topic! I've been following this closely.", time: "2h ago", likes: 3 },
    { id: 2, author: "creative_dev", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=creativedev`, content: "This is really interesting. Has anyone tried combining this with image generation workflows?", time: "1h ago", likes: 5 },
    { id: 3, author: "pixel_pioneer", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=pixelpioneer`, content: "I think this will change how we approach AI-assisted creative work.", time: "45m ago", likes: 2 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/threads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Threads
      </Link>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <img src={thread.authorAvatar} alt={thread.authorName} className="h-12 w-12 rounded-full bg-muted" />
          <div>
            <span className="font-medium text-foreground">{thread.authorName}</span>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(thread.createdAt)}</p>
          </div>
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">{thread.title}</h1>
        <p className="mt-3 text-muted-foreground">{thread.content}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-primary"><ThumbsUp className="h-4 w-4" /> {thread.likes}</button>
          <button className="flex items-center gap-1 hover:text-destructive"><ThumbsDown className="h-4 w-4" /> {thread.dislikes}</button>
          <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {thread.replies}</span>
          <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {thread.views}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="font-display font-semibold">Replies ({mockReplies.length})</h3>
        {mockReplies.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <img src={r.avatar} alt={r.author} className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-xs text-muted-foreground">{r.time}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.content}</p>
            <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              <ThumbsUp className="h-3 w-3" /> {r.likes}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <Button className="bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

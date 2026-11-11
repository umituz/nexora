import { useState } from "react";
import { Link } from "react-router-dom";
import { mockConversations, type Conversation } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConversationsPage() {
  const [conversations] = useLocalStorage<Conversation[]>("dmchamp_conversations", mockConversations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = conversations.filter((c) => {
    const matchSearch = c.contactName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const statusColors: Record<string, string> = { active: "bg-success/10 text-success", closed: "bg-muted text-muted-foreground", pending: "bg-warning/10 text-warning" };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Conversations</h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-1">
          {["all", "active", "pending", "closed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize", filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground")}>{s}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((c) => (
          <Link key={c.id} to={`/dashboard/conversations/${c.id}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{c.contactName.split(" ").map((n) => n[0]).join("")}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.contactName}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", statusColors[c.status])}>{c.status}</span>
                {!c.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="truncate text-sm text-muted-foreground">{c.lastMessage}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">{c.channel}</p>
              <p className="text-xs text-muted-foreground">{c.messagesCount} msgs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

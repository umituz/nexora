import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/calculations";

export default function ConversationsPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_CONVERSATIONS.filter((c) => c.contactName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Conversations</h1><p className="text-sm text-muted-foreground">{MOCK_CONVERSATIONS.length} conversations</p></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="space-y-2">
        {filtered.map((c) => (
          <Link key={c.id} to={`/dashboard/conversations/${c.id}`}>
            <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">{c.contactName.split(" ").map(n=>n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.contactName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{c.messages[c.messages.length-1]?.body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{timeAgo(c.lastMessageAt)}</span>
                  {c.unread && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

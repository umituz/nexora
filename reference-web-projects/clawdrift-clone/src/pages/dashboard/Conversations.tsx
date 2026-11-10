import { mockConversations } from "@/lib/mock-data";
import { timeAgo } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConversationsPage() {
  return (
    <div className="space-y-3 max-w-3xl">
      {mockConversations.map((c) => (
        <Card key={c.id} className="cursor-pointer hover:bg-accent/30 transition-colors">
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{c.userName}</p>
                <Badge variant="outline" className="capitalize text-xs">{c.platform}</Badge>
                <span className="text-xs text-muted-foreground">· {c.botName}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{c.lastMessage}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className="text-xs text-muted-foreground">{timeAgo(c.lastMessageAt)}</p>
              <p className="text-xs text-muted-foreground">{c.messageCount} msgs</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

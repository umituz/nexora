import { mockNotifications } from "@/lib/mock-data";
import { timeAgo } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = { success: "default", warning: "secondary", error: "destructive", info: "outline" };

export default function NotificationsPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      {mockNotifications.map((n) => (
        <Card key={n.id} className={n.read ? "opacity-60" : ""}>
          <CardContent className="flex items-start gap-3 pt-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{n.title}</p>
                <Badge variant={typeColors[n.type] as "default" | "secondary" | "destructive" | "outline"}>{n.type}</Badge>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

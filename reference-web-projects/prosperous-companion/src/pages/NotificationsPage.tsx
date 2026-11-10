import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck } from "lucide-react";
import { timeAgo } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const typeIcons: Record<string, string> = { info: "text-info", success: "text-success", warning: "text-warning", error: "text-destructive" };

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p></div>
        <Button variant="outline" onClick={markAllNotificationsRead}><CheckCheck className="mr-2 h-4 w-4" /> Mark all read</Button>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <Card key={n.id} className={cn(!n.read && "border-primary/30 bg-primary/5")}>
            <CardContent className="p-4 flex items-start gap-3">
              <Bell className={`h-4 w-4 mt-0.5 ${typeIcons[n.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {n.actionUrl && <Link to={n.actionUrl}><Button size="sm" variant="ghost" className="text-xs h-7">View</Button></Link>}
                {!n.read && <button onClick={() => markNotificationRead(n.id)} className="rounded p-1 hover:bg-secondary"><Check className="h-3.5 w-3.5 text-muted-foreground" /></button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

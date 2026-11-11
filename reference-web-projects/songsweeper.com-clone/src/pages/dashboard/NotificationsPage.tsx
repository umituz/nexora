import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatRelativeDate } from "@/lib/calculations";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  success: "border-l-feature-split-albums",
  info: "border-l-feature-duplicates",
  warning: "border-l-feature-most-played",
  error: "border-l-destructive",
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useLibrary();
  const unread = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div>
        <PageHeader title="Notifications" />
        <EmptyState icon={<Bell size={48} />} title="No Notifications" description="You're all caught up!" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Notifications" description={unread > 0 ? `${unread} unread` : "All read"}>
        {unread > 0 && (
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            <Check size={14} className="mr-1" /> Mark All Read
          </Button>
        )}
      </PageHeader>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "glass-card p-4 border-l-4 flex items-start justify-between gap-3",
              TYPE_STYLES[n.type],
              !n.read && "bg-primary/5"
            )}
          >
            <div className="min-w-0">
              <p className={cn("text-sm font-medium text-foreground", !n.read && "font-semibold")}>{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(n.timestamp)}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)}>
                  <Check size={14} />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => deleteNotification(n.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

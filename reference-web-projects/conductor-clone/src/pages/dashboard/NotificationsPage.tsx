import { mockNotifications } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Notifications</h1><p className="mt-1 text-sm text-muted-foreground">Stay updated.</p></div>
      <div className="space-y-3">
        {mockNotifications.map((n) => (
          <div key={n.id} className={`rounded-lg border bg-card p-4 ${!n.read ? "border-primary/30" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={n.type} />
                <h3 className="text-sm font-semibold">{n.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(n.timestamp)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

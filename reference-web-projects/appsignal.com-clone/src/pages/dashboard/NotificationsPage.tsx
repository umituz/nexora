import { PageHeader } from "@/components/shared/PageHeader";
import { mockNotifications } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Bug, Gauge, Activity, AlertTriangle, Rocket, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { error: Bug, performance: Gauge, uptime: Activity, anomaly: AlertTriangle, deploy: Rocket, checkin: CheckSquare };

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="All alerts and notifications" />
      <div className="space-y-2">
        {mockNotifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <Link key={n.id} to={n.actionUrl} className={cn("flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors", !n.read && "border-primary/20 bg-primary/5")}>
              {Icon && <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.timestamp}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

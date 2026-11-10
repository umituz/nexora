import { cn } from "@/lib/utils";
import { getStatusBg } from "@/lib/calculations";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", getStatusBg(status), className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-emerald-400": ["healthy", "up", "operational", "ok", "success", "active", "resolved"].includes(status),
        "bg-yellow-400": ["warning", "degraded", "late", "identified"].includes(status),
        "bg-orange-400": ["open", "triggered", "partial_outage", "investigating", "rolling_back"].includes(status),
        "bg-red-400": ["critical", "down", "failed", "missed", "major_outage"].includes(status),
        "bg-blue-400": ["maintenance", "monitoring"].includes(status),
        "bg-muted-foreground": ["offline", "disabled", "closed", "ignored", "inactive"].includes(status),
      })} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

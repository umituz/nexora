import { cn } from "@/lib/utils";
import { getStatusBgColor } from "@/utils/calculations";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBgColor(status), className)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

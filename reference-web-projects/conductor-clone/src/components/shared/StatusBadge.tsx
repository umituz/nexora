import { cn, getStatusBgColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        getStatusBgColor(status),
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

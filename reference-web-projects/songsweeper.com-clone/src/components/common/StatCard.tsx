import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function StatCard({ label, value, icon, className, gradient }: StatCardProps) {
  return (
    <div className={cn("glass-card p-4 lg:p-5 flex items-center gap-4", className)}>
      {icon && (
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground shrink-0", gradient || "bg-primary")}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-foreground truncate">{String(value)}</p>
      </div>
    </div>
  );
}

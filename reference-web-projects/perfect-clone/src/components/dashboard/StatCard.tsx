import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, change, icon, description, className }: StatCardProps) {
  const hasChange = change !== undefined;

  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {hasChange && (
            <p className={cn("text-xs mt-1 font-medium", change >= 0 ? "text-primary" : "text-destructive")}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
              {description && <span className="text-muted-foreground ml-1">{description}</span>}
            </p>
          )}
          {!hasChange && description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

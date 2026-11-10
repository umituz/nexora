import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: { direction: "up" | "down" | "stable"; percentage: number };
  icon?: LucideIcon;
  description?: string;
  className?: string;
  positive?: "up" | "down";
}

export function StatsCard({ title, value, change, icon: Icon, description, className, positive = "up" }: StatsCardProps) {
  const isPositive = change?.direction === positive;
  const isNegative = change && change.direction !== "stable" && change.direction !== positive;

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 lg:p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-2 text-2xl lg:text-3xl font-bold">{value}</p>
      {(change || description) && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          {change && change.direction !== "stable" && (
            <>
              {change.direction === "up" ? (
                <TrendingUp className={cn("h-3.5 w-3.5", isPositive ? "text-emerald-400" : "text-red-400")} />
              ) : (
                <TrendingDown className={cn("h-3.5 w-3.5", isNegative ? "text-red-400" : "text-emerald-400")} />
              )}
              <span className={cn(isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-muted-foreground")}>
                {change.percentage.toFixed(1)}%
              </span>
            </>
          )}
          {change?.direction === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}

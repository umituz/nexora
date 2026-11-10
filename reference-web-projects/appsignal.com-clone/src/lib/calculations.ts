export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDuration(ms: number): string {
  if (ms >= 60_000) return `${(ms / 60_000).toFixed(1)}min`;
  if (ms >= 1_000) return `${(ms / 1_000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateErrorRate(errors: number, total: number): number {
  if (total === 0) return 0;
  return (errors / total) * 100;
}

export function calculateUptime(uptimePercent: number): string {
  if (uptimePercent >= 99.99) return "Excellent";
  if (uptimePercent >= 99.9) return "Good";
  if (uptimePercent >= 99) return "Fair";
  return "Poor";
}

export function calculateTrend(current: number, previous: number): { direction: "up" | "down" | "stable"; percentage: number } {
  if (previous === 0) return { direction: "stable", percentage: 0 };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) return { direction: "stable", percentage: 0 };
  return { direction: change > 0 ? "up" : "down", percentage: Math.abs(change) };
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    healthy: "text-emerald-400",
    up: "text-emerald-400",
    operational: "text-emerald-400",
    ok: "text-emerald-400",
    open: "text-orange-400",
    success: "text-emerald-400",
    active: "text-emerald-400",
    warning: "text-yellow-400",
    degraded: "text-yellow-400",
    late: "text-yellow-400",
    partial_outage: "text-orange-400",
    critical: "text-red-400",
    down: "text-red-400",
    major_outage: "text-red-400",
    failed: "text-red-400",
    missed: "text-red-400",
    offline: "text-muted-foreground",
    disabled: "text-muted-foreground",
    closed: "text-muted-foreground",
    ignored: "text-muted-foreground",
    maintenance: "text-blue-400",
    triggered: "text-orange-400",
    investigating: "text-orange-400",
    identified: "text-yellow-400",
    monitoring: "text-blue-400",
    resolved: "text-emerald-400",
    rolling_back: "text-orange-400",
    inactive: "text-muted-foreground",
  };
  return map[status] ?? "text-foreground";
}

export function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    healthy: "bg-emerald-400/10 text-emerald-400",
    up: "bg-emerald-400/10 text-emerald-400",
    operational: "bg-emerald-400/10 text-emerald-400",
    ok: "bg-emerald-400/10 text-emerald-400",
    success: "bg-emerald-400/10 text-emerald-400",
    active: "bg-emerald-400/10 text-emerald-400",
    open: "bg-orange-400/10 text-orange-400",
    warning: "bg-yellow-400/10 text-yellow-400",
    degraded: "bg-yellow-400/10 text-yellow-400",
    late: "bg-yellow-400/10 text-yellow-400",
    critical: "bg-red-400/10 text-red-400",
    down: "bg-red-400/10 text-red-400",
    failed: "bg-red-400/10 text-red-400",
    missed: "bg-red-400/10 text-red-400",
    offline: "bg-muted text-muted-foreground",
    disabled: "bg-muted text-muted-foreground",
    closed: "bg-muted text-muted-foreground",
    ignored: "bg-muted text-muted-foreground",
    triggered: "bg-orange-400/10 text-orange-400",
    partial_outage: "bg-orange-400/10 text-orange-400",
    major_outage: "bg-red-400/10 text-red-400",
    maintenance: "bg-blue-400/10 text-blue-400",
    investigating: "bg-orange-400/10 text-orange-400",
    identified: "bg-yellow-400/10 text-yellow-400",
    monitoring: "bg-blue-400/10 text-blue-400",
    resolved: "bg-emerald-400/10 text-emerald-400",
    rolling_back: "bg-orange-400/10 text-orange-400",
    inactive: "bg-muted text-muted-foreground",
  };
  return map[status] ?? "bg-muted text-foreground";
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

export function generateSparklineData(length: number, base: number, variance: number): number[] {
  return Array.from({ length }, () => Math.max(0, base + (Math.random() - 0.5) * variance * 2));
}

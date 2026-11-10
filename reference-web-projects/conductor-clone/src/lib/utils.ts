import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "Never";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    connected: "text-emerald-500", active: "text-emerald-500", completed: "text-emerald-500",
    paid: "text-emerald-500", resolved: "text-emerald-500", success: "text-emerald-500",
    error: "text-red-500", failed: "text-red-500", overdue: "text-red-500", urgent: "text-red-500",
    disconnected: "text-muted-foreground", inactive: "text-muted-foreground",
    revoked: "text-muted-foreground", closed: "text-muted-foreground",
    pending: "text-amber-500", queued: "text-amber-500", warning: "text-amber-500", medium: "text-amber-500",
    running: "text-blue-500", in_progress: "text-blue-500", open: "text-blue-500",
    high: "text-blue-500", configured: "text-blue-500",
  };
  return map[status] ?? "text-muted-foreground";
}

export function getStatusBgColor(status: string): string {
  const map: Record<string, string> = {
    connected: "bg-emerald-500/10 text-emerald-500", active: "bg-emerald-500/10 text-emerald-500",
    completed: "bg-emerald-500/10 text-emerald-500", paid: "bg-emerald-500/10 text-emerald-500",
    resolved: "bg-emerald-500/10 text-emerald-500", success: "bg-emerald-500/10 text-emerald-500",
    error: "bg-red-500/10 text-red-500", failed: "bg-red-500/10 text-red-500",
    overdue: "bg-red-500/10 text-red-500", urgent: "bg-red-500/10 text-red-500",
    disconnected: "bg-muted text-muted-foreground", inactive: "bg-muted text-muted-foreground",
    revoked: "bg-muted text-muted-foreground", closed: "bg-muted text-muted-foreground",
    pending: "bg-amber-500/10 text-amber-500", queued: "bg-amber-500/10 text-amber-500",
    warning: "bg-amber-500/10 text-amber-500", medium: "bg-amber-500/10 text-amber-500",
    running: "bg-blue-500/10 text-blue-500", in_progress: "bg-blue-500/10 text-blue-500",
    open: "bg-blue-500/10 text-blue-500", high: "bg-blue-500/10 text-blue-500",
    configured: "bg-blue-500/10 text-blue-500",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

export function calculateSuccessRate(total: number, errors: number): number {
  if (total === 0) return 100;
  return ((total - errors) / total) * 100;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function sortByDate<T>(items: T[], key: keyof T, direction: "asc" | "desc" = "desc"): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[key] as string).getTime();
    const dateB = new Date(b[key] as string).getTime();
    return direction === "desc" ? dateB - dateA : dateA - dateB;
  });
}

export function filterBySearch<T>(items: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return items;
  const lower = searchTerm.toLowerCase();
  return items.filter((item) => keys.some((key) => String(item[key]).toLowerCase().includes(lower)));
}

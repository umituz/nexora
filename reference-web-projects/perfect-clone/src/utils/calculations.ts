import type { Transaction, Trial, Customer, ChartDataPoint } from "@/types";

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

export function calculateMRR(customers: Customer[]): number {
  return customers.filter((c) => c.status === "active").reduce((sum, c) => sum + c.mrr, 0);
}

export function calculateARR(mrr: number): number {
  return mrr * 12;
}

export function calculateChurnRate(churned: number, total: number): number {
  if (total === 0) return 0;
  return (churned / total) * 100;
}

export function calculateLTV(arpu: number, churnRate: number): number {
  if (churnRate === 0) return arpu * 60;
  return arpu / (churnRate / 100);
}

export function calculateARPU(totalRevenue: number, totalCustomers: number): number {
  if (totalCustomers === 0) return 0;
  return totalRevenue / totalCustomers;
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function sumTransactions(transactions: Transaction[], status?: string): number {
  const filtered = status ? transactions.filter((t) => t.status === status) : transactions;
  return filtered.reduce((sum, t) => sum + t.amount, 0);
}

export function countByStatus<T extends { status: string }>(items: T[], status: string): number {
  return items.filter((i) => i.status === status).length;
}

export function groupByDate(data: ChartDataPoint[]): Map<string, ChartDataPoint[]> {
  const map = new Map<string, ChartDataPoint[]>();
  for (const point of data) {
    const key = point.date.slice(0, 7);
    const existing = map.get(key) ?? [];
    existing.push(point);
    map.set(key, existing);
  }
  return map;
}

export function getTrialDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getEngagementLevel(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-emerald-400",
    converted: "text-emerald-400",
    succeeded: "text-emerald-400",
    paid: "text-emerald-400",
    running: "text-emerald-400",
    trial: "text-blue-400",
    pending: "text-amber-400",
    under_review: "text-amber-400",
    draft: "text-muted-foreground",
    paused: "text-amber-400",
    expired: "text-muted-foreground",
    failed: "text-red-400",
    lost: "text-red-400",
    overdue: "text-red-400",
    churned: "text-red-400",
    cancelled: "text-muted-foreground",
    blocked: "text-red-400",
    won: "text-emerald-400",
    open: "text-blue-400",
    completed: "text-muted-foreground",
    refunded: "text-amber-400",
    disabled: "text-muted-foreground",
    invited: "text-blue-400",
    archived: "text-muted-foreground",
    inactive: "text-muted-foreground",
  };
  return colors[status] ?? "text-foreground";
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-emerald-400/10 text-emerald-400",
    converted: "bg-emerald-400/10 text-emerald-400",
    succeeded: "bg-emerald-400/10 text-emerald-400",
    paid: "bg-emerald-400/10 text-emerald-400",
    running: "bg-emerald-400/10 text-emerald-400",
    trial: "bg-blue-400/10 text-blue-400",
    pending: "bg-amber-400/10 text-amber-400",
    under_review: "bg-amber-400/10 text-amber-400",
    draft: "bg-muted text-muted-foreground",
    paused: "bg-amber-400/10 text-amber-400",
    expired: "bg-muted text-muted-foreground",
    failed: "bg-red-400/10 text-red-400",
    lost: "bg-red-400/10 text-red-400",
    overdue: "bg-red-400/10 text-red-400",
    churned: "bg-red-400/10 text-red-400",
    cancelled: "bg-muted text-muted-foreground",
    blocked: "bg-red-400/10 text-red-400",
    won: "bg-emerald-400/10 text-emerald-400",
    open: "bg-blue-400/10 text-blue-400",
    completed: "bg-muted text-muted-foreground",
    refunded: "bg-amber-400/10 text-amber-400",
    disabled: "bg-muted text-muted-foreground",
    invited: "bg-blue-400/10 text-blue-400",
    archived: "bg-muted text-muted-foreground",
    inactive: "bg-muted text-muted-foreground",
  };
  return colors[status] ?? "bg-muted text-foreground";
}

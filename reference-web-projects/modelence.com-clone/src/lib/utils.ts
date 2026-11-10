import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}...`;
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-600 bg-emerald-50", running: "text-emerald-600 bg-emerald-50",
    success: "text-emerald-600 bg-emerald-50", applied: "text-emerald-600 bg-emerald-50",
    ok: "text-emerald-600 bg-emerald-50", paid: "text-emerald-600 bg-emerald-50",
    resolved: "text-sky-600 bg-sky-50", pending: "text-amber-600 bg-amber-50",
    deploying: "text-blue-600 bg-blue-50", in_progress: "text-blue-600 bg-blue-50",
    queued: "text-gray-600 bg-gray-50", paused: "text-gray-600 bg-gray-50",
    inactive: "text-gray-600 bg-gray-50", stopped: "text-gray-600 bg-gray-50",
    muted: "text-gray-600 bg-gray-50", invited: "text-blue-600 bg-blue-50",
    suspended: "text-red-600 bg-red-50", error: "text-red-600 bg-red-50",
    failed: "text-red-600 bg-red-50", expired: "text-gray-600 bg-gray-50",
    archived: "text-gray-600 bg-gray-50", past_due: "text-red-600 bg-red-50",
  };
  return map[status] ?? "text-gray-600 bg-gray-50";
}

export function getLogLevelColor(level: string): string {
  const map: Record<string, string> = {
    info: "text-blue-600 bg-blue-50", warn: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50", debug: "text-gray-600 bg-gray-50",
  };
  return map[level] ?? "text-gray-600 bg-gray-50";
}

export function getSeverityColor(severity: string): string {
  const map: Record<string, string> = {
    critical: "text-red-600 bg-red-50", warning: "text-amber-600 bg-amber-50",
    info: "text-blue-600 bg-blue-50",
  };
  return map[severity] ?? "text-gray-600 bg-gray-50";
}

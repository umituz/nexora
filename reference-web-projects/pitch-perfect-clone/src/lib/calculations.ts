import { APP_PRICE_PER_SMS, APP_COMPETITOR_PRICE_PER_SMS } from "./constants";
import type { Campaign, Contact, AnalyticsData } from "./types";

export function calculateSavings(monthlyVolume: number): {
  ourCost: number;
  competitorCost: number;
  savings: number;
  savingsPerSms: number;
} {
  const ourCost = monthlyVolume * APP_PRICE_PER_SMS;
  const competitorCost = monthlyVolume * APP_COMPETITOR_PRICE_PER_SMS;
  return {
    ourCost,
    competitorCost,
    savings: competitorCost - ourCost,
    savingsPerSms: APP_COMPETITOR_PRICE_PER_SMS - APP_PRICE_PER_SMS,
  };
}

export function calculateDeliveryRate(campaign: Campaign): number {
  if (campaign.sentCount === 0) return 0;
  return Math.round((campaign.deliveredCount / campaign.sentCount) * 10000) / 100;
}

export function calculateReplyRate(campaign: Campaign): number {
  if (campaign.deliveredCount === 0) return 0;
  return Math.round((campaign.repliedCount / campaign.deliveredCount) * 10000) / 100;
}

export function calculateOptOutRate(campaign: Campaign): number {
  if (campaign.sentCount === 0) return 0;
  return Math.round((campaign.optOutCount / campaign.sentCount) * 10000) / 100;
}

export function aggregateAnalytics(data: AnalyticsData[]): {
  totalSent: number;
  totalDelivered: number;
  totalReplied: number;
  totalOptOuts: number;
  avgDeliveryRate: number;
  avgReplyRate: number;
} {
  const totalSent = data.reduce((s, d) => s + d.sent, 0);
  const totalDelivered = data.reduce((s, d) => s + d.delivered, 0);
  const totalReplied = data.reduce((s, d) => s + d.replied, 0);
  const totalOptOuts = data.reduce((s, d) => s + d.optOuts, 0);
  return {
    totalSent,
    totalDelivered,
    totalReplied,
    totalOptOuts,
    avgDeliveryRate: totalSent > 0 ? Math.round((totalDelivered / totalSent) * 10000) / 100 : 0,
    avgReplyRate: totalDelivered > 0 ? Math.round((totalReplied / totalDelivered) * 10000) / 100 : 0,
  };
}

export function getContactsByTag(contacts: Contact[], tag: string): Contact[] {
  return contacts.filter((c) => c.tags.includes(tag));
}

export function getActiveContacts(contacts: Contact[]): Contact[] {
  return contacts.filter((c) => c.status === "active");
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

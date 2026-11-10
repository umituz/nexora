import type { Reactions, CreditTransaction, MediaItem } from "@/types";

export function calculateTotalReactions(reactions: Reactions): number {
  return reactions.likes + reactions.hearts + reactions.laughs + reactions.sad;
}

export function calculateCreditBalance(transactions: CreditTransaction[]): number {
  return transactions.reduce((balance, tx) => {
    if (tx.type === "purchase" || tx.type === "bonus" || tx.type === "refund") {
      return balance + tx.amount;
    }
    return balance - Math.abs(tx.amount);
  }, 0);
}

export function calculateVideoCost(costPerSecond: number, durationSeconds: number): number {
  return Math.ceil(costPerSecond * durationSeconds);
}

export function calculateBonusCredits(baseCredits: number, bonusPercent: number): number {
  return Math.floor(baseCredits * (bonusPercent / 100));
}

export function calculateEngagementRate(item: MediaItem): number {
  const totalReactions = calculateTotalReactions(item.reactions);
  if (item.views === 0) return 0;
  return (totalReactions / item.views) * 100;
}

export function calculateStorageUsed(items: MediaItem[]): {
  totalMB: number;
  imageCount: number;
  videoCount: number;
} {
  const imageCount = items.filter((i) => i.type === "image").length;
  const videoCount = items.filter((i) => i.type === "video").length;
  const totalMB = imageCount * 2.5 + videoCount * 25;
  return { totalMB: Math.round(totalMB * 10) / 10, imageCount, videoCount };
}

export function calculateMonthlyCost(transactions: CreditTransaction[]): number {
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return transactions
    .filter((tx) => tx.type === "purchase" && new Date(tx.createdAt) >= monthAgo)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

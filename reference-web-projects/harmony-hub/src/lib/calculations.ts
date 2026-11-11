export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((converted / total) * 10000) / 100;
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return Math.round(((revenue - cost) / cost) * 10000) / 100;
}

export function calculateAvgResponseTime(times: number[]): number {
  if (times.length === 0) return 0;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

export function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

export function formatCurrency(amount: number, currency = "€"): string {
  return `${currency}${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}%`;
}

export function calculateCreditsUsed(messages: number, avgCreditsPerMessage = 2.5): number {
  return Math.round(messages * avgCreditsPerMessage);
}

export function calculateMonthlyCost(plan: { price: number }, extraCredits: number, costPerCredit = 0.05): number {
  return plan.price + extraCredits * costPerCredit;
}

export function calculateAgencyProfit(clientCount: number, chargePerClient: number, planCost: number): number {
  return clientCount * chargePerClient - planCost;
}

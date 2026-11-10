export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: string;
  status: "active" | "trial" | "churned" | "blocked" | "cancelled";
  trialStartDate: string;
  trialEndDate: string;
  convertedDate?: string;
  mrr: number;
  ltv: number;
  paymentMethod: string;
  lastPayment?: string;
  segment?: string;
  source: string;
  country: string;
  createdAt: string;
}

export interface Trial {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: "active" | "converted" | "expired" | "cancelled";
  smartChargeStatus: "pending" | "captured" | "released" | "failed";
  smartChargeAmount: number;
  daysRemaining: number;
  engagementScore: number;
  source: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  type: "subscription" | "smart_charge" | "refund" | "one_time";
  description: string;
  createdAt: string;
  stripeId: string;
}

export interface Chargeback {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "open" | "under_review" | "won" | "lost";
  filedDate: string;
  dueDate: string;
  transactionId: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: "draft" | "running" | "paused" | "completed";
  type: "checkout" | "pricing" | "trial_length" | "smart_charge";
  variants: ExperimentVariant[];
  startDate?: string;
  endDate?: string;
  trafficSplit: number;
  confidence: number;
  winner?: string;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  conversionRate: number;
  visitors: number;
  conversions: number;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: "live" | "test";
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  status: "active" | "invited" | "disabled";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface CheckoutPage {
  id: string;
  name: string;
  slug: string;
  status: "active" | "draft" | "archived";
  conversionRate: number;
  visitors: number;
  conversions: number;
  template: string;
  customCss?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageCount: number;
  maxUsage: number;
  expiresAt?: string;
  status: "active" | "expired" | "disabled";
  createdAt: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  criteria: SegmentCriteria[];
  createdAt: string;
}

export interface SegmentCriteria {
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "in";
  value: string | number | string[];
}

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  mrrGrowth: number;
  churnRate: number;
  ltv: number;
  arpu: number;
  netRevenue: number;
  grossRevenue: number;
}

export interface ConversionMetrics {
  totalTrials: number;
  activeTrials: number;
  convertedTrials: number;
  conversionRate: number;
  avgTrialLength: number;
  smartChargeSuccessRate: number;
  revenueFromConversions: number;
}

export interface DashboardStats {
  revenue: RevenueMetrics;
  conversion: ConversionMetrics;
  recentTransactions: Transaction[];
  recentTrials: Trial[];
  topChannels: { name: string; conversions: number; revenue: number }[];
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  conversions: number;
  trials: number;
  churn: number;
}

export interface UserPreferences {
  theme: "light" | "dark";
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
  weeklyReport: boolean;
  language: string;
}

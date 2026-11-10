import type {
  Customer, Trial, Transaction, Chargeback, Experiment,
  WebhookConfig, ApiKey, TeamMember, Notification, AuditLogEntry,
  CheckoutPage, Campaign, DiscountCode, Invoice, Segment,
  DashboardStats, ChartDataPoint,
} from "@/types";

const randomDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString();
};

export const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
  id: `cust_${i + 1}`,
  name: [
    "Alex Johnson", "Maria Garcia", "James Wilson", "Sarah Chen", "Michael Brown",
    "Emma Davis", "David Miller", "Lisa Anderson", "Robert Taylor", "Jennifer Thomas",
    "William Jackson", "Amanda White", "Christopher Harris", "Jessica Martin", "Daniel Thompson",
    "Ashley Robinson", "Matthew Clark", "Stephanie Lewis", "Andrew Walker", "Nicole Hall",
    "Joshua Allen", "Megan Young", "Kevin King", "Rachel Wright", "Brian Lopez",
    "Lauren Hill", "Justin Scott", "Samantha Green", "Ryan Adams", "Emily Baker",
    "Brandon Nelson", "Kayla Carter", "Tyler Mitchell", "Amber Perez", "Aaron Roberts",
    "Tiffany Turner", "Nathan Phillips", "Brittany Campbell", "Zachary Parker", "Danielle Evans",
    "Jeremy Edwards", "Christina Collins", "Kyle Stewart", "Monica Sanchez", "Sean Morris",
    "Courtney Rogers", "Patrick Reed", "Heather Cook", "Derek Morgan", "Vanessa Bailey",
  ][i],
  email: `user${i + 1}@example.com`,
  plan: ["Starter", "Growth", "Scale", "Enterprise"][i % 4],
  status: (["active", "trial", "churned", "active", "active", "cancelled", "active", "trial", "active", "blocked"] as const)[i % 10],
  trialStartDate: randomDate(60),
  trialEndDate: randomDate(30),
  convertedDate: i % 3 === 0 ? randomDate(20) : undefined,
  mrr: [1, 49, 199, 499][i % 4],
  ltv: [12, 588, 2388, 5988][i % 4] + Math.floor(Math.random() * 500),
  paymentMethod: i % 2 === 0 ? "Visa •••• 4242" : "Mastercard •••• 5555",
  lastPayment: randomDate(5),
  segment: ["High Value", "At Risk", "New", "Engaged", "Enterprise"][i % 5],
  source: ["Google Ads", "Organic", "Referral", "Direct", "LinkedIn"][i % 5],
  country: ["US", "UK", "DE", "CA", "AU", "FR", "JP", "BR"][i % 8],
  createdAt: randomDate(90),
}));

export const mockTrials: Trial[] = Array.from({ length: 30 }, (_, i) => ({
  id: `trial_${i + 1}`,
  customerId: `cust_${i + 1}`,
  customerName: mockCustomers[i % 50].name,
  customerEmail: mockCustomers[i % 50].email,
  plan: ["Starter", "Growth", "Scale"][i % 3],
  startDate: randomDate(20),
  endDate: randomDate(5),
  status: (["active", "converted", "expired", "active", "converted", "cancelled"] as const)[i % 6],
  smartChargeStatus: (["pending", "captured", "released", "captured"] as const)[i % 4],
  smartChargeAmount: [1, 49, 199][i % 3],
  daysRemaining: Math.max(0, 14 - (i % 15)),
  engagementScore: 30 + Math.floor(Math.random() * 70),
  source: ["Google Ads", "Organic", "Referral", "Direct", "LinkedIn"][i % 5],
}));

export const mockTransactions: Transaction[] = Array.from({ length: 80 }, (_, i) => ({
  id: `txn_${i + 1}`,
  customerId: `cust_${(i % 50) + 1}`,
  customerName: mockCustomers[i % 50].name,
  amount: [1, 49, 199, 499, 29, 99, 149, 399][i % 8],
  currency: "USD",
  status: (["succeeded", "succeeded", "succeeded", "pending", "failed", "succeeded", "refunded", "succeeded"] as const)[i % 8],
  type: (["subscription", "smart_charge", "subscription", "one_time"] as const)[i % 4],
  description: ["Monthly subscription", "Smart charge hold", "Plan upgrade", "One-time purchase"][i % 4],
  createdAt: randomDate(30),
  stripeId: `pi_${Math.random().toString(36).slice(2, 15)}`,
}));

export const mockChargebacks: Chargeback[] = Array.from({ length: 12 }, (_, i) => ({
  id: `cb_${i + 1}`,
  customerId: `cust_${(i % 50) + 1}`,
  customerName: mockCustomers[i % 50].name,
  amount: [49, 199, 99, 499][i % 4],
  reason: ["Fraudulent", "Product not received", "Duplicate", "Unrecognized"][i % 4],
  status: (["open", "under_review", "won", "lost"] as const)[i % 4],
  filedDate: randomDate(15),
  dueDate: randomDate(2),
  transactionId: `txn_${(i % 80) + 1}`,
}));

export const mockExperiments: Experiment[] = [
  {
    id: "exp_1", name: "Checkout Button Color", description: "Testing green vs blue CTA button",
    status: "running", type: "checkout", trafficSplit: 50, confidence: 87,
    startDate: randomDate(14),
    variants: [
      { id: "v1", name: "Control (Blue)", description: "Current blue button", conversionRate: 12.3, visitors: 1245, conversions: 153 },
      { id: "v2", name: "Variant (Green)", description: "Green button variant", conversionRate: 15.1, visitors: 1198, conversions: 181 },
    ],
  },
  {
    id: "exp_2", name: "Trial Length Test", description: "7-day vs 14-day vs 30-day trial",
    status: "completed", type: "trial_length", trafficSplit: 33, confidence: 95, winner: "v2",
    startDate: randomDate(45), endDate: randomDate(10),
    variants: [
      { id: "v1", name: "7-day Trial", description: "Short trial period", conversionRate: 22.5, visitors: 890, conversions: 200 },
      { id: "v2", name: "14-day Trial", description: "Standard trial", conversionRate: 31.2, visitors: 912, conversions: 284 },
      { id: "v3", name: "30-day Trial", description: "Extended trial", conversionRate: 18.9, visitors: 875, conversions: 165 },
    ],
  },
  {
    id: "exp_3", name: "Smart Charge Amount", description: "Testing different hold amounts",
    status: "running", type: "smart_charge", trafficSplit: 50, confidence: 72,
    startDate: randomDate(7),
    variants: [
      { id: "v1", name: "$1 Hold", description: "Minimal hold", conversionRate: 45.2, visitors: 634, conversions: 286 },
      { id: "v2", name: "Full Price Hold", description: "Hold full amount", conversionRate: 38.1, visitors: 621, conversions: 237 },
    ],
  },
  {
    id: "exp_4", name: "Pricing Page Layout", description: "Horizontal vs vertical pricing cards",
    status: "draft", type: "pricing", trafficSplit: 50, confidence: 0,
    variants: [
      { id: "v1", name: "Horizontal Cards", description: "Side-by-side layout", conversionRate: 0, visitors: 0, conversions: 0 },
      { id: "v2", name: "Vertical Stack", description: "Stacked layout", conversionRate: 0, visitors: 0, conversions: 0 },
    ],
  },
];

export const mockWebhooks: WebhookConfig[] = [
  { id: "wh_1", url: "https://api.example.com/webhooks/1capture", events: ["trial.started", "trial.converted", "payment.succeeded"], status: "active", secret: "whsec_abc123", createdAt: randomDate(60), lastTriggered: randomDate(1), failureCount: 0 },
  { id: "wh_2", url: "https://hooks.slack.com/services/T00/B00/xxx", events: ["chargeback.created", "payment.failed"], status: "active", secret: "whsec_def456", createdAt: randomDate(30), lastTriggered: randomDate(2), failureCount: 1 },
  { id: "wh_3", url: "https://old-api.example.com/hook", events: ["trial.expired"], status: "inactive", secret: "whsec_ghi789", createdAt: randomDate(90), failureCount: 5 },
];

export const mockApiKeys: ApiKey[] = [
  { id: "key_1", name: "Production API Key", key: "1c_live_sk_prod_xxxxxxxxxxxx", type: "live", createdAt: randomDate(60), lastUsed: randomDate(1), permissions: ["read", "write", "delete"] },
  { id: "key_2", name: "Test API Key", key: "1c_test_sk_test_xxxxxxxxxxxx", type: "test", createdAt: randomDate(30), lastUsed: randomDate(3), permissions: ["read", "write"] },
  { id: "key_3", name: "Read-only Key", key: "1c_live_sk_ro_xxxxxxxxxxxx", type: "live", createdAt: randomDate(14), lastUsed: randomDate(7), permissions: ["read"] },
];

export const mockTeam: TeamMember[] = [
  { id: "tm_1", name: "John Doe", email: "john@company.com", role: "owner", joinedAt: randomDate(365), lastActive: randomDate(0), status: "active" },
  { id: "tm_2", name: "Jane Smith", email: "jane@company.com", role: "admin", joinedAt: randomDate(200), lastActive: randomDate(0), status: "active" },
  { id: "tm_3", name: "Bob Wilson", email: "bob@company.com", role: "member", joinedAt: randomDate(90), lastActive: randomDate(2), status: "active" },
  { id: "tm_4", name: "Alice Brown", email: "alice@company.com", role: "viewer", joinedAt: randomDate(30), lastActive: randomDate(5), status: "active" },
  { id: "tm_5", name: "Charlie Davis", email: "charlie@company.com", role: "member", joinedAt: randomDate(7), lastActive: randomDate(7), status: "invited" },
];

export const mockNotifications: Notification[] = [
  { id: "n_1", title: "New trial started", message: "Alex Johnson started a Growth plan trial", type: "info", read: false, createdAt: randomDate(0), actionUrl: "/trials" },
  { id: "n_2", title: "Trial converted!", message: "Maria Garcia converted to Scale plan", type: "success", read: false, createdAt: randomDate(0), actionUrl: "/conversions" },
  { id: "n_3", title: "Chargeback filed", message: "A chargeback of $199 was filed by James Wilson", type: "warning", read: false, createdAt: randomDate(1), actionUrl: "/chargebacks" },
  { id: "n_4", title: "Payment failed", message: "Payment of $49 failed for Sarah Chen", type: "error", read: true, createdAt: randomDate(2), actionUrl: "/transactions" },
  { id: "n_5", title: "Experiment completed", message: "Trial Length Test has reached statistical significance", type: "success", read: true, createdAt: randomDate(3), actionUrl: "/experiments" },
  { id: "n_6", title: "Weekly report ready", message: "Your weekly conversion report is available", type: "info", read: true, createdAt: randomDate(7), actionUrl: "/reports" },
];

export const mockAuditLog: AuditLogEntry[] = Array.from({ length: 40 }, (_, i) => ({
  id: `audit_${i + 1}`,
  userId: `tm_${(i % 5) + 1}`,
  userName: mockTeam[i % 5].name,
  action: ["created", "updated", "deleted", "viewed", "exported"][i % 5],
  resource: ["experiment", "webhook", "api_key", "team_member", "settings", "checkout_page", "smart_charge_rule"][i % 7],
  resourceId: `res_${i + 1}`,
  details: [
    "Created new A/B experiment", "Updated webhook URL", "Regenerated API key",
    "Invited team member", "Changed notification settings", "Published checkout page",
    "Modified smart charge rules",
  ][i % 7],
  ipAddress: `192.168.${(i % 255)}.${(i * 7) % 255}`,
  createdAt: randomDate(30),
}));

export const mockCheckoutPages: CheckoutPage[] = [
  { id: "cp_1", name: "Default Checkout", slug: "default", status: "active", conversionRate: 23.4, visitors: 5420, conversions: 1268, template: "minimal", createdAt: randomDate(90), updatedAt: randomDate(5) },
  { id: "cp_2", name: "High-Convert Landing", slug: "high-convert", status: "active", conversionRate: 31.2, visitors: 3210, conversions: 1001, template: "bold", createdAt: randomDate(60), updatedAt: randomDate(2) },
  { id: "cp_3", name: "Enterprise Signup", slug: "enterprise", status: "active", conversionRate: 18.7, visitors: 1890, conversions: 353, template: "professional", createdAt: randomDate(45), updatedAt: randomDate(10) },
  { id: "cp_4", name: "Holiday Promo", slug: "holiday", status: "archived", conversionRate: 28.9, visitors: 4100, conversions: 1185, template: "festive", createdAt: randomDate(120), updatedAt: randomDate(60) },
  { id: "cp_5", name: "New Design Test", slug: "new-design", status: "draft", conversionRate: 0, visitors: 0, conversions: 0, template: "modern", createdAt: randomDate(3), updatedAt: randomDate(1) },
];

export const mockCampaigns: Campaign[] = [
  { id: "camp_1", name: "Google Ads - Brand", channel: "Google Ads", status: "active", budget: 5000, spent: 3420, conversions: 145, roi: 312, startDate: randomDate(30) },
  { id: "camp_2", name: "LinkedIn B2B", channel: "LinkedIn", status: "active", budget: 3000, spent: 1890, conversions: 67, roi: 245, startDate: randomDate(21) },
  { id: "camp_3", name: "Twitter Launch", channel: "Twitter", status: "completed", budget: 2000, spent: 2000, conversions: 89, roi: 178, startDate: randomDate(60), endDate: randomDate(30) },
  { id: "camp_4", name: "Content Marketing", channel: "Organic", status: "active", budget: 1500, spent: 750, conversions: 210, roi: 890, startDate: randomDate(90) },
  { id: "camp_5", name: "Referral Program", channel: "Referral", status: "active", budget: 1000, spent: 450, conversions: 156, roi: 1240, startDate: randomDate(45) },
  { id: "camp_6", name: "Facebook Retargeting", channel: "Facebook", status: "paused", budget: 2500, spent: 1200, conversions: 34, roi: 89, startDate: randomDate(20) },
];

export const mockDiscountCodes: DiscountCode[] = [
  { id: "dc_1", code: "WELCOME20", type: "percentage", value: 20, usageCount: 342, maxUsage: 1000, status: "active", createdAt: randomDate(60) },
  { id: "dc_2", code: "BACKUP10", type: "percentage", value: 10, usageCount: 156, maxUsage: 500, status: "active", createdAt: randomDate(30) },
  { id: "dc_3", code: "SAVE50", type: "fixed", value: 50, usageCount: 89, maxUsage: 200, status: "active", createdAt: randomDate(14), expiresAt: randomDate(-14) },
  { id: "dc_4", code: "HOLIDAY25", type: "percentage", value: 25, usageCount: 500, maxUsage: 500, status: "expired", createdAt: randomDate(120) },
];

export const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => ({
  id: `inv_${i + 1}`,
  customerId: `cust_${(i % 50) + 1}`,
  customerName: mockCustomers[i % 50].name,
  amount: [49, 199, 499, 1, 99][i % 5],
  status: (["paid", "paid", "pending", "paid", "overdue"] as const)[i % 5],
  dueDate: randomDate(i % 5 === 4 ? 10 : -5),
  paidDate: i % 5 !== 2 && i % 5 !== 4 ? randomDate(3) : undefined,
  items: [{ description: ["Growth Plan - Monthly", "Scale Plan - Monthly", "Enterprise Plan", "Starter Plan", "Growth Plan - Annual"][i % 5], quantity: 1, unitPrice: [49, 199, 499, 1, 99][i % 5], total: [49, 199, 499, 1, 99][i % 5] }],
  createdAt: randomDate(30),
}));

export const mockSegments: Segment[] = [
  { id: "seg_1", name: "High Value", description: "Customers with MRR > $100", customerCount: 18, criteria: [{ field: "mrr", operator: "greater_than", value: 100 }], createdAt: randomDate(60) },
  { id: "seg_2", name: "At Risk", description: "Low engagement customers in trial", customerCount: 7, criteria: [{ field: "engagementScore", operator: "less_than", value: 40 }, { field: "status", operator: "equals", value: "trial" }], createdAt: randomDate(30) },
  { id: "seg_3", name: "Enterprise Leads", description: "Enterprise plan customers", customerCount: 12, criteria: [{ field: "plan", operator: "equals", value: "Enterprise" }], createdAt: randomDate(45) },
  { id: "seg_4", name: "New Users", description: "Signed up in last 7 days", customerCount: 23, criteria: [{ field: "createdAt", operator: "greater_than", value: 7 }], createdAt: randomDate(14) },
  { id: "seg_5", name: "US Customers", description: "Customers from United States", customerCount: 31, criteria: [{ field: "country", operator: "equals", value: "US" }], createdAt: randomDate(90) },
];

export const mockChartData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().slice(0, 10),
    revenue: 800 + Math.floor(Math.random() * 1200) + i * 20,
    conversions: 5 + Math.floor(Math.random() * 15) + Math.floor(i / 5),
    trials: 10 + Math.floor(Math.random() * 20),
    churn: Math.floor(Math.random() * 5),
  };
});

export const mockDashboardStats: DashboardStats = {
  revenue: {
    mrr: 47200,
    arr: 566400,
    mrrGrowth: 12.5,
    churnRate: 3.2,
    ltv: 2840,
    arpu: 94.4,
    netRevenue: 44800,
    grossRevenue: 52100,
  },
  conversion: {
    totalTrials: 342,
    activeTrials: 78,
    convertedTrials: 195,
    conversionRate: 57.0,
    avgTrialLength: 11.2,
    smartChargeSuccessRate: 94.5,
    revenueFromConversions: 38400,
  },
  recentTransactions: mockTransactions.slice(0, 5),
  recentTrials: mockTrials.slice(0, 5),
  topChannels: [
    { name: "Google Ads", conversions: 145, revenue: 14200 },
    { name: "Organic", conversions: 210, revenue: 18900 },
    { name: "Referral", conversions: 156, revenue: 12400 },
    { name: "Direct", conversions: 89, revenue: 8700 },
    { name: "LinkedIn", conversions: 67, revenue: 9100 },
  ],
  chartData: mockChartData,
};

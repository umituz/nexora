export const APP_NAME = "1Capture";
export const APP_TAGLINE = "Double Your Trial-to-Paid Conversion";
export const APP_DESCRIPTION = "Everything you need to boost trial conversion rate as high as 57% using smart payment capture and AI optimization.";
export const APP_VERSION = "2.4.1";
export const APP_SUPPORT_EMAIL = "support@1capture.io";
export const APP_WEBSITE = "https://www.1capture.io";

export const STORAGE_KEYS = {
  THEME: "1capture_theme",
  SIDEBAR_STATE: "1capture_sidebar",
  USER_PREFERENCES: "1capture_prefs",
  NOTIFICATIONS_READ: "1capture_notifs_read",
  ONBOARDING_COMPLETE: "1capture_onboarding",
  SMART_CHARGE_SETTINGS: "1capture_smart_charge",
  CHECKOUT_TEMPLATES: "1capture_checkout_templates",
  WEBHOOK_CONFIGS: "1capture_webhooks",
  API_KEYS: "1capture_api_keys",
  TEAM_MEMBERS: "1capture_team",
  EXPERIMENTS: "1capture_experiments",
  CUSTOM_EVENTS: "1capture_custom_events",
  DISCOUNT_CODES: "1capture_discount_codes",
  BLOCKED_USERS: "1capture_blocked_users",
  REPORTS_CACHE: "1capture_reports",
} as const;

export const CURRENCY = "USD";
export const DATE_FORMAT = "MMM dd, yyyy";
export const DATETIME_FORMAT = "MMM dd, yyyy HH:mm";

export const PLAN_TIERS = [
  { id: "starter", name: "Starter", price: 1, trialDays: 14, features: ["Smart Charge", "Basic Analytics", "Email Support"] },
  { id: "growth", name: "Growth", price: 49, trialDays: 14, features: ["Everything in Starter", "AI Optimization", "Slack Integration", "Priority Support"] },
  { id: "scale", name: "Scale", price: 199, trialDays: 14, features: ["Everything in Growth", "Custom Events", "Dedicated CSM", "SLA"] },
  { id: "enterprise", name: "Enterprise", price: 0, trialDays: 30, features: ["Everything in Scale", "Custom Integrations", "On-premise Option", "24/7 Support"] },
] as const;

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { title: "Analytics", path: "/analytics", icon: "BarChart3" },
      { title: "Reports", path: "/reports", icon: "FileText" },
    ],
  },
  {
    label: "Conversion",
    items: [
      { title: "Trials", path: "/trials", icon: "Clock" },
      { title: "Conversions", path: "/conversions", icon: "TrendingUp" },
      { title: "Funnel", path: "/funnel", icon: "Filter" },
      { title: "Smart Charge", path: "/smart-charge", icon: "Zap" },
    ],
  },
  {
    label: "Customers",
    items: [
      { title: "All Customers", path: "/customers", icon: "Users" },
      { title: "Segments", path: "/segments", icon: "Target" },
      { title: "Blocked Users", path: "/blocked-users", icon: "ShieldBan" },
    ],
  },
  {
    label: "Payments",
    items: [
      { title: "Transactions", path: "/transactions", icon: "CreditCard" },
      { title: "Chargebacks", path: "/chargebacks", icon: "AlertTriangle" },
      { title: "Revenue", path: "/revenue", icon: "DollarSign" },
      { title: "Invoices", path: "/invoices", icon: "Receipt" },
    ],
  },
  {
    label: "Optimization",
    items: [
      { title: "AI Insights", path: "/ai-insights", icon: "Brain" },
      { title: "Experiments", path: "/experiments", icon: "FlaskConical" },
      { title: "Recommendations", path: "/recommendations", icon: "Lightbulb" },
      { title: "Checkout Pages", path: "/checkout-pages", icon: "Layout" },
    ],
  },
  {
    label: "Attribution",
    items: [
      { title: "Channels", path: "/channels", icon: "Share2" },
      { title: "Events", path: "/events", icon: "MousePointerClick" },
      { title: "Campaigns", path: "/campaigns", icon: "Megaphone" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { title: "All Integrations", path: "/integrations", icon: "Puzzle" },
      { title: "Webhooks", path: "/webhooks", icon: "Webhook" },
      { title: "API Keys", path: "/api-keys", icon: "Key" },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "General", path: "/settings", icon: "Settings" },
      { title: "Team", path: "/team", icon: "UserCog" },
      { title: "Billing", path: "/billing", icon: "Wallet" },
      { title: "Notifications", path: "/notifications-settings", icon: "Bell" },
      { title: "Audit Log", path: "/audit-log", icon: "ScrollText" },
    ],
  },
] as const;

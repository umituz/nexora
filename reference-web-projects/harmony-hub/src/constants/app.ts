export const APP_NAME = "DM Champ";
export const APP_DESCRIPTION = "AI So Good It Feels ILLEGAL";
export const APP_TAGLINE = "It just collected a $1,000 deposit on a $50,000 treatment. No human involved.";
export const APP_URL = "https://dmchamp.com";
export const APP_VERSION = "1.0.0";
export const COMPANY_NAME = "OneGlimpe B.V.";
export const COMPANY_COUNTRY = "The Netherlands";
export const COMPANY_COC = "78315654";
export const COMPANY_VAT = "NL861343529B01";

export const STATS = {
  brands: "500+",
  aiMessages: "100k+",
  aiSales: "$5M+",
} as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/dmchamp",
  youtube: "https://www.youtube.com/@dmchamp",
} as const;

export const NAV_ITEMS = [
  { label: "Features", path: "/features" },
  { label: "Alternatives", path: "/alternatives" },
  { label: "Use Cases", path: "/use-cases" },
  { label: "Pricing", path: "/pricing" },
  { label: "Affiliates", path: "/affiliates" },
  { label: "Help Guide", path: "/help" },
  { label: "Contact", path: "/contact" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "AI Agents", path: "/dashboard/agents", icon: "Bot" },
  { label: "Conversations", path: "/dashboard/conversations", icon: "MessageSquare" },
  { label: "Contacts", path: "/dashboard/contacts", icon: "Users" },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: "Megaphone" },
  { label: "Appointments", path: "/dashboard/appointments", icon: "Calendar" },
  { label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Channels", path: "/dashboard/channels", icon: "Share2" },
  { label: "Templates", path: "/dashboard/templates", icon: "FileText" },
  { label: "Tags", path: "/dashboard/tags", icon: "Tag" },
  { label: "Knowledge Base", path: "/dashboard/knowledge-base", icon: "BookOpen" },
  { label: "Automations", path: "/dashboard/automations", icon: "Workflow" },
  { label: "Lead Scoring", path: "/dashboard/lead-scoring", icon: "Target" },
  { label: "White Label", path: "/dashboard/white-label", icon: "Palette" },
  { label: "Activity Log", path: "/dashboard/activity-log", icon: "ScrollText" },
] as const;

export const SETTINGS_NAV = [
  { label: "General", path: "/dashboard/settings/general", icon: "Settings" },
  { label: "Profile", path: "/dashboard/settings/profile", icon: "User" },
  { label: "Billing", path: "/dashboard/settings/billing", icon: "CreditCard" },
  { label: "Team", path: "/dashboard/settings/team", icon: "UsersRound" },
  { label: "API & Webhooks", path: "/dashboard/settings/api", icon: "Code" },
  { label: "Notifications", path: "/dashboard/settings/notifications", icon: "Bell" },
] as const;

export const CHANNELS = [
  { id: "whatsapp", name: "WhatsApp", color: "#25D366" },
  { id: "instagram", name: "Instagram", color: "#E4405F" },
  { id: "messenger", name: "Messenger", color: "#0084FF" },
  { id: "webchat", name: "Web Chat", color: "#10B981" },
] as const;

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter Plan",
    subtitle: "For your own business",
    price: 27,
    currency: "€",
    period: "month",
    chats: "~20 chats",
    features: [
      "50 Free Credits Per Month",
      "WA and Web Chat only",
      "20k Char. Instructions Limit",
      "20 AI Responses Per Chat",
      "Incoming Campaigns",
      "Unlimited Contacts",
      "One Click Optimize Campaign",
      "Voice Note Understanding",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    subtitle: "For growing businesses",
    price: 97,
    currency: "€",
    period: "month",
    chats: "~100 chats",
    popular: true,
    features: [
      "200 Free Credits Per Month",
      "WA, Web Chat, IG, ME",
      "50k Char. Instructions Limit",
      "50 AI Responses Per Chat",
      "Outgoing Campaigns",
      "Contact Tagging",
      "Image Understanding",
      "Reply to Comments",
      "AI Appointment Booking",
      "Everything in Starter",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    subtitle: "For serious sellers",
    price: 297,
    currency: "€",
    period: "month",
    chats: "~250 chats",
    features: [
      "500 Free Credits Per Month",
      "Custom channel support",
      "100k Char. Instructions Limit",
      "Unlimited AI Responses",
      "Combined Campaigns",
      "Document Understanding",
      "Video Understanding",
      "Automatic Follow Ups",
      "Real Time Web Search",
      "Custom Functions",
      "Webhooks & API Access",
      "Advanced Mode",
      "Everything in Growth",
    ],
  },
  {
    id: "agency",
    name: "Agency Plan",
    subtitle: "For agencies reselling AI",
    price: 497,
    currency: "€",
    period: "month",
    chats: "~500 chats",
    features: [
      "1000 Free Credits Per Month",
      "50 Sub Accounts",
      "White Labeling",
      "Everything in Pro",
    ],
  },
] as const;

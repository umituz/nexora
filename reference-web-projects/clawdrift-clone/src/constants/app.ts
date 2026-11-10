export const APP_NAME = "ClawDrift";
export const APP_TAGLINE = "Deploy Your Personal AI Assistant in Under a Minute";
export const APP_DESCRIPTION =
  "Your own 24/7 AI assistant on Telegram, Discord, or WhatsApp. Pick a model, choose a channel, and deploy — no server setup, no code, no configuration.";
export const APP_VERSION = "1.0.0-beta";
export const APP_EMAIL = "support@clawdrift.com";
export const APP_DOMAIN = "clawdrift.com";

export const STORAGE_KEYS = {
  AUTH_USER: "clawdrift_user",
  BOTS: "clawdrift_bots",
  DEPLOYMENTS: "clawdrift_deployments",
  API_KEYS: "clawdrift_api_keys",
  WEBHOOKS: "clawdrift_webhooks",
  TEAM_MEMBERS: "clawdrift_team",
  NOTIFICATIONS: "clawdrift_notifications",
  CONVERSATIONS: "clawdrift_conversations",
  TEMPLATES: "clawdrift_templates",
  KNOWLEDGE_BASE: "clawdrift_kb",
  SCHEDULED_TASKS: "clawdrift_tasks",
  AUDIT_LOG: "clawdrift_audit",
  SUPPORT_TICKETS: "clawdrift_tickets",
  CHANNELS: "clawdrift_channels",
  SETTINGS: "clawdrift_settings",
  THEME: "clawdrift_theme",
  BILLING: "clawdrift_billing",
} as const;

export const AI_MODELS = [
  { id: "claude-4", name: "Claude 4 Sonnet", provider: "Anthropic", icon: "🟠" },
  { id: "claude-3.5", name: "Claude 3.5 Sonnet", provider: "Anthropic", icon: "🟠" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", icon: "🟢" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", icon: "🟢" },
  { id: "gemini-pro", name: "Gemini 2.0 Pro", provider: "Google", icon: "🔵" },
  { id: "gemini-flash", name: "Gemini 2.0 Flash", provider: "Google", icon: "🔵" },
] as const;

export const PLATFORMS = [
  { id: "telegram", name: "Telegram", color: "#0088cc" },
  { id: "discord", name: "Discord", color: "#5865F2" },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366" },
] as const;

export const PLAN_TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    messagesPerMonth: 100,
    bots: 1,
    features: ["1 Bot", "100 messages/mo", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    messagesPerMonth: 10000,
    bots: 5,
    features: ["5 Bots", "10K messages/mo", "Priority support", "Custom personas", "Analytics"],
  },
  {
    id: "team",
    name: "Team",
    price: 99,
    messagesPerMonth: 50000,
    bots: 25,
    features: ["25 Bots", "50K messages/mo", "Dedicated support", "Team collaboration", "Advanced analytics", "API access"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: -1,
    messagesPerMonth: -1,
    bots: -1,
    features: ["Unlimited Bots", "Unlimited messages", "24/7 support", "SLA", "On-premise option", "Custom integrations"],
  },
] as const;

export const NAV_ITEMS = {
  dashboard: [
    { label: "Overview", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Bots", path: "/dashboard/bots", icon: "Bot" },
    { label: "Deployments", path: "/dashboard/deployments", icon: "Rocket" },
    { label: "Channels", path: "/dashboard/channels", icon: "MessageSquare" },
    { label: "Models", path: "/dashboard/models", icon: "Brain" },
    { label: "Templates", path: "/dashboard/templates", icon: "FileText" },
    { label: "Knowledge Base", path: "/dashboard/knowledge-base", icon: "BookOpen" },
    { label: "Conversations", path: "/dashboard/conversations", icon: "MessagesSquare" },
    { label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
    { label: "Logs", path: "/dashboard/logs", icon: "ScrollText" },
    { label: "Scheduled Tasks", path: "/dashboard/scheduled-tasks", icon: "Clock" },
    { label: "Webhooks", path: "/dashboard/webhooks", icon: "Webhook" },
    { label: "API Keys", path: "/dashboard/api-keys", icon: "Key" },
    { label: "Integrations", path: "/dashboard/integrations", icon: "Plug" },
    { label: "Team", path: "/dashboard/team", icon: "Users" },
    { label: "Billing", path: "/dashboard/billing", icon: "CreditCard" },
    { label: "Usage", path: "/dashboard/usage", icon: "Activity" },
    { label: "Audit Log", path: "/dashboard/audit-log", icon: "Shield" },
    { label: "Support", path: "/dashboard/support", icon: "HelpCircle" },
    { label: "Settings", path: "/dashboard/settings", icon: "Settings" },
  ],
} as const;

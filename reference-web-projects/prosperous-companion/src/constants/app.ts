export const APP_NAME = "Prosp" as const;
export const APP_DESCRIPTION = "LinkedIn Outbound With AI Personalization" as const;
export const APP_TAGLINE = "Find and engage leads using AI for highly personalized campaigns." as const;
export const APP_VERSION = "1.0.0" as const;
export const APP_URL = "https://prosp.ai" as const;

export const NAV_ITEMS = {
  main: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Campaigns", path: "/campaigns", icon: "Megaphone" },
    { label: "Leads", path: "/leads", icon: "Users" },
    { label: "Unified Inbox", path: "/inbox", icon: "Mail" },
    { label: "AI Templates", path: "/ai-templates", icon: "Sparkles" },
    { label: "Voice Notes", path: "/voice-notes", icon: "Mic" },
  ],
  secondary: [
    { label: "LinkedIn Accounts", path: "/linkedin-accounts", icon: "Linkedin" },
    { label: "Team", path: "/team", icon: "UsersRound" },
    { label: "Proxy Management", path: "/proxies", icon: "Shield" },
    { label: "Integrations", path: "/integrations", icon: "Plug" },
    { label: "Webhooks", path: "/webhooks", icon: "Webhook" },
    { label: "API Keys", path: "/api-keys", icon: "Key" },
  ],
  management: [
    { label: "Analytics", path: "/analytics", icon: "BarChart3" },
    { label: "Blacklist", path: "/blacklist", icon: "Ban" },
    { label: "Tags", path: "/tags", icon: "Tag" },
    { label: "Export Center", path: "/exports", icon: "Download" },
    { label: "Activity Log", path: "/activity-log", icon: "ScrollText" },
    { label: "Notifications", path: "/notifications", icon: "Bell" },
  ],
  settings: [
    { label: "Settings", path: "/settings", icon: "Settings" },
    { label: "Billing", path: "/billing", icon: "CreditCard" },
    { label: "Help & Support", path: "/support", icon: "HelpCircle" },
  ],
} as const;

export const CAMPAIGN_STATUSES = ["draft", "active", "paused", "completed", "archived"] as const;
export const LEAD_STATUSES = ["new", "contacted", "replied", "interested", "not_interested", "converted"] as const;
export const MESSAGE_TYPES = ["connection_request", "message", "inmail", "email", "voice_note"] as const;
export const SEQUENCE_ACTIONS = ["send_connection", "send_message", "send_email", "send_voice_note", "view_profile", "like_post", "endorse_skill", "wait"] as const;

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

export const STORAGE_KEYS = {
  theme: "prosp-theme",
  sidebarCollapsed: "prosp-sidebar-collapsed",
  campaigns: "prosp-campaigns",
  leads: "prosp-leads",
  inboxMessages: "prosp-inbox-messages",
  aiTemplates: "prosp-ai-templates",
  voiceNotes: "prosp-voice-notes",
  linkedinAccounts: "prosp-linkedin-accounts",
  teamMembers: "prosp-team-members",
  proxies: "prosp-proxies",
  integrations: "prosp-integrations",
  webhooks: "prosp-webhooks",
  apiKeys: "prosp-api-keys",
  blacklist: "prosp-blacklist",
  tags: "prosp-tags",
  exports: "prosp-exports",
  activityLog: "prosp-activity-log",
  notifications: "prosp-notifications",
  settings: "prosp-settings",
  billing: "prosp-billing",
  sequences: "prosp-sequences",
  analytics: "prosp-analytics",
  user: "prosp-user",
} as const;

export const APP_NAME = "PitchPrfct";
export const APP_TAGLINE = "The Fastest Way to Close Deals with SMS";
export const APP_DESCRIPTION = "Launch campaigns in days, not months. Automate outreach, stay compliant, and convert more leads, all at the lowest SMS rates.";
export const APP_EMAIL = "info@pitchprfct.com";
export const APP_ADDRESS = "390 NE 191st St STE 8735, Miami, FL 33179";
export const APP_COPYRIGHT = `© ${new Date().getFullYear()} ${APP_NAME}, Inc. All rights reserved.`;
export const APP_PRICE_PER_SMS = 0.007;
export const APP_COMPETITOR_PRICE_PER_SMS = 0.03;
export const APP_MONTHLY_PRICE = 99;
export const APP_FREE_TRIAL_DAYS = 14;
export const APP_FREE_SMS_CREDITS = 1000;

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "AI Copilot", href: "/#jayni" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: "Megaphone" },
  { label: "Contacts", path: "/dashboard/contacts", icon: "Users" },
  { label: "Conversations", path: "/dashboard/conversations", icon: "MessageSquare" },
  { label: "Templates", path: "/dashboard/templates", icon: "FileText" },
  { label: "Workflows", path: "/dashboard/workflows", icon: "GitBranch" },
  { label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
  { label: "AI Copilot", path: "/dashboard/ai-copilot", icon: "Bot" },
  { label: "Credits", path: "/dashboard/credits", icon: "CreditCard" },
  { label: "Tags", path: "/dashboard/tags", icon: "Tag" },
  { label: "Opt-Outs", path: "/dashboard/opt-outs", icon: "UserX" },
  { label: "Scheduled", path: "/dashboard/scheduled", icon: "Clock" },
  { label: "Drip Campaigns", path: "/dashboard/drip-campaigns", icon: "Droplets" },
  { label: "Phone Numbers", path: "/dashboard/phone-numbers", icon: "Phone" },
  { label: "Integrations", path: "/dashboard/integrations", icon: "Puzzle" },
  { label: "Settings", path: "/dashboard/settings", icon: "Settings" },
] as const;

export const STORAGE_KEYS = {
  AUTH_USER: "pitchprfct_user",
  CONTACTS: "pitchprfct_contacts",
  CAMPAIGNS: "pitchprfct_campaigns",
  TEMPLATES: "pitchprfct_templates",
  WORKFLOWS: "pitchprfct_workflows",
  TAGS: "pitchprfct_tags",
  CONVERSATIONS: "pitchprfct_conversations",
  CREDITS: "pitchprfct_credits",
  SCHEDULED: "pitchprfct_scheduled",
  OPT_OUTS: "pitchprfct_opt_outs",
  DRIP_CAMPAIGNS: "pitchprfct_drip_campaigns",
  PHONE_NUMBERS: "pitchprfct_phone_numbers",
  SETTINGS: "pitchprfct_settings",
  THEME: "pitchprfct_theme",
} as const;

export const TAGS_OPTIONS = [
  "Interested", "Follow-Up", "Hot Lead", "New Lead",
  "Missed Appointment", "Homeowner", "No Response",
  "Closed", "Replied", "Business Owner", "18-25",
] as const;

export const CAMPAIGN_STATUSES = ["draft", "active", "paused", "completed"] as const;
export const CONTACT_STATUSES = ["active", "opted-out", "bounced"] as const;
export const CONVERSATION_STATUSES = ["open", "closed", "pending"] as const;
export const WORKFLOW_STATUSES = ["active", "inactive", "draft"] as const;

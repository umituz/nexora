export const APP_NAME = "Modelence";
export const APP_TAGLINE = "Build real apps, not prototypes";
export const APP_DESCRIPTION = "Production-ready by default with everything you need to go live";
export const APP_URL = "https://modelence.com";
export const APP_SUPPORT_EMAIL = "support@modelence.com";

export const NAV_LINKS = {
  pricing: "/pricing",
  blog: "/blog",
  docs: "/docs",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
} as const;

export const DASHBOARD_NAV = {
  overview: "/dashboard",
  projects: "/dashboard/projects",
  environments: "/dashboard/environments",
  database: "/dashboard/database",
  collections: "/dashboard/database/collections",
  indexes: "/dashboard/database/indexes",
  migrations: "/dashboard/database/migrations",
  authUsers: "/dashboard/auth/users",
  authSessions: "/dashboard/auth/sessions",
  authRoles: "/dashboard/auth/roles",
  authProviders: "/dashboard/auth/providers",
  logs: "/dashboard/monitoring/logs",
  metrics: "/dashboard/monitoring/metrics",
  traces: "/dashboard/monitoring/traces",
  alerts: "/dashboard/monitoring/alerts",
  cronJobs: "/dashboard/cron-jobs",
  appConfig: "/dashboard/config/app",
  secrets: "/dashboard/config/secrets",
  envVars: "/dashboard/config/env-vars",
  deployments: "/dashboard/deployments",
  apiKeys: "/dashboard/api-keys",
  teamMembers: "/dashboard/team/members",
  teamInvitations: "/dashboard/team/invitations",
  settingsGeneral: "/dashboard/settings/general",
  settingsBilling: "/dashboard/settings/billing",
  settingsDomains: "/dashboard/settings/domains",
  settingsNotifications: "/dashboard/settings/notifications",
  profile: "/dashboard/profile",
  activityLog: "/dashboard/activity-log",
  integrations: "/dashboard/integrations",
  storageBuckets: "/dashboard/storage/buckets",
  storageFiles: "/dashboard/storage/files",
  functions: "/dashboard/functions",
  queries: "/dashboard/queries",
} as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    description: "For development environments and prototyping",
    price: "$0",
    period: "/month",
    features: [
      "$20 in AI Builder free usage",
      "Up to 5 sandbox environments",
      "Up to 5 local environments",
      "Monitoring & observability included",
      "Basic support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pay as you go",
    description: "For production environments and persistent workloads",
    price: "$9",
    pricePrefix: "From",
    period: "/month",
    features: [
      "$20 in AI Builder free usage",
      "Additional AI Builder usage at Anthropic API rates",
      "Up to 5 cloud environments",
      "Up to 10 sandbox environments",
      "Up to 10 local environments",
      "Vertical and horizontal scaling",
      "Professional 24/7 support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For companies looking for higher limits and dedicated support",
    price: "Custom",
    period: "",
    features: [
      "Unlimited AI Builder usage",
      "Unlimited environments",
      "Multi-region deployments",
      "Dedicated infrastructure setup",
      "Dedicated support channel",
      "Custom SLAs",
      "Security & compliance reports",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
] as const;

export const CLOUD_PRICING = [
  { size: "Micro", vcpu: "0.25", memory: "0.5 GB", price: "$0.013/hour", monthly: "~$9/month" },
  { size: "Micro Plus", vcpu: "0.25", memory: "1 GB", price: "$0.02/hour", monthly: "~$14/month" },
  { size: "Small", vcpu: "0.5", memory: "1 GB", price: "$0.03/hour", monthly: "~$22/month" },
  { size: "Small Plus", vcpu: "0.5", memory: "2 GB", price: "$0.04/hour", monthly: "~$29/month" },
  { size: "Medium", vcpu: "1", memory: "2 GB", price: "$0.06/hour", monthly: "~$43/month" },
  { size: "Medium Plus", vcpu: "1", memory: "4 GB", price: "$0.07/hour", monthly: "~$50/month" },
  { size: "Large", vcpu: "2", memory: "4 GB", price: "$0.12/hour", monthly: "~$86/month" },
  { size: "Large Plus", vcpu: "2", memory: "8 GB", price: "$0.14/hour", monthly: "~$101/month" },
] as const;

export const TECH_STACK = [
  { name: "TypeScript", icon: "TS" },
  { name: "React", icon: "⚛" },
  { name: "Vite", icon: "⚡" },
  { name: "Next.js", icon: "N" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Anthropic", icon: "A" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is Modelence?",
    answer: "Modelence is a platform for building production-ready applications with built-in authentication, database, monitoring, and cloud deployment — all configured out of the box.",
  },
  {
    question: "How is Modelence different from other platforms?",
    answer: "Unlike other platforms, Modelence gives you a complete production stack from day one. Authentication, database, monitoring, and deployment are all integrated and work together seamlessly.",
  },
  {
    question: "Is Modelence open-source?",
    answer: "Modelence core framework is open-source. You can self-host or use our managed cloud service for the best experience.",
  },
  {
    question: "Does Modelence scale for production apps?",
    answer: "Yes. Modelence is built for production from the ground up. It supports horizontal and vertical scaling, and our cloud infrastructure handles traffic spikes automatically.",
  },
] as const;

export const STORAGE_KEY_PREFIX = "modelence_";

export const getStorageKey = (key: string): string => `${STORAGE_KEY_PREFIX}${key}`;

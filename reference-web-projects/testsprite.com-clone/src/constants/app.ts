export const APP_NAME = "TestSprite";
export const APP_TAGLINE = "AI Testing Agent & Automation Platform";
export const APP_DESCRIPTION =
  "10x your AI-native dev speed with our autonomous AI testing agent handling verification.";
export const APP_COPYRIGHT = `Copyright © ${new Date().getFullYear()} ${APP_NAME}`;
export const APP_VERSION = "2.0";

export const NAV_LINKS = {
  home: "/",
  pricing: "/pricing",
  docs: "/docs",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  hackathon: "/hackathon",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  changelog: "/changelog",
  terms: "/terms",
  privacy: "/privacy",
  solutions: {
    mcp: "/solutions/mcp",
    backend: "/solutions/backend",
    frontend: "/solutions/frontend",
    data: "/solutions/data",
    aiAgent: "/solutions/ai-agent",
  },
} as const;

export const DASHBOARD_LINKS = {
  overview: "/dashboard",
  projects: "/dashboard/projects",
  testRuns: "/dashboard/test-runs",
  testCases: "/dashboard/test-cases",
  testReports: "/dashboard/test-reports",
  apiTesting: "/dashboard/api-testing",
  uiTesting: "/dashboard/ui-testing",
  analytics: "/dashboard/analytics",
  cicd: "/dashboard/cicd",
  regression: "/dashboard/regression",
  scheduled: "/dashboard/scheduled",
  history: "/dashboard/history",
  environments: "/dashboard/environments",
  variables: "/dashboard/variables",
  webhooks: "/dashboard/webhooks",
  auditLog: "/dashboard/audit-log",
  coverage: "/dashboard/coverage",
  bugReports: "/dashboard/bug-reports",
  mcpConfig: "/dashboard/mcp-config",
  help: "/dashboard/help",
  settings: {
    general: "/dashboard/settings",
    profile: "/dashboard/settings/profile",
    billing: "/dashboard/settings/billing",
    team: "/dashboard/settings/team",
    integrations: "/dashboard/settings/integrations",
    notifications: "/dashboard/settings/notifications",
    apiKeys: "/dashboard/settings/api-keys",
  },
} as const;

export const SOCIAL_LINKS = {
  discord: "https://discord.com/invite/GXWFjCe4an",
  github: "https://github.com/testsprite",
  twitter: "https://twitter.com/testsprite",
  linkedin: "https://linkedin.com/company/testsprite",
} as const;

export const STATS = {
  communityMembers: "100,000+",
  developersOnboarded: "50,000+",
  accuracyBoost: "121%",
  featuresWithAgent: "42%",
  featuresWithTestSprite: "93%",
} as const;

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    period: "",
    credits: "150 credits per month",
    testLists: "1 Test List",
    schedules: "—",
    aiModel: "GPT-4.1 Mini (or similar)",
    features: [
      "Basic testing features",
      "Community support",
      "Foundational models",
    ],
    cta: "Get Started",
    highlighted: false,
    badge: "",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "1st month, then $19/mo",
    credits: "400 credits per month",
    testLists: "5 Test Lists",
    schedules: "5 Test Schedules",
    aiModel: "Claude 3.7 (or similar)",
    features: [
      "Advanced models",
      "Optimized execution",
      "Priority support",
      "Automatic frontend & backend workflows",
    ],
    cta: "Try For Free",
    highlighted: false,
    badge: "1st-Month Discount",
  },
  {
    id: "standard",
    name: "Standard",
    price: "$69",
    period: "/month",
    credits: "1600 credits per month",
    testLists: "Unlimited Test Lists",
    schedules: "Unlimited Test Schedules",
    aiModel: "Proprietary TestSprite Model",
    features: [
      "Advanced models",
      "Custom configurations",
      "Priority support",
      "Enhanced test generation",
      "Scalable solutions",
    ],
    cta: "Get Started",
    highlighted: true,
    badge: "Recommended",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    credits: "Custom plan",
    testLists: "Unlimited",
    schedules: "Unlimited",
    aiModel: "Custom AI model training",
    features: [
      "Custom AI model",
      "API access",
      "Dedicated support",
      "Custom configurations",
      "SSO & SAML",
    ],
    cta: "Contact Us",
    highlighted: false,
    badge: "",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What's AI Testing?",
    a: "AI software testing uses artificial intelligence to automate the entire QA process — generating, executing, and maintaining test cases across your application. Instead of writing manual scripts, AI testing tools learn your system, simulate real user behavior, and automatically surface bugs that traditional testing might overlook.",
  },
  {
    q: "What's the most powerful AI testing tool?",
    a: "TestSprite is designed to be the most powerful autonomous AI testing agent. It combines intelligent test generation, self-repair capabilities, and continuous verification to deliver unmatched coverage and accuracy.",
  },
  {
    q: "Who is TestSprite designed for?",
    a: "TestSprite is ideal for developers, QA engineers, DevOps teams, and engineering managers who want to accelerate their testing workflow. It's especially powerful for teams using AI coding tools who need autonomous verification.",
  },
  {
    q: "Will TestSprite integrate with existing test tools and CI/CD processes?",
    a: "Yes! TestSprite integrates seamlessly with popular CI/CD platforms like GitHub Actions, GitLab CI, Jenkins, and more. It also works alongside existing test frameworks without requiring migration.",
  },
  {
    q: "How broad are testing capabilities?",
    a: "TestSprite covers frontend UI testing, backend API testing, integration testing, regression testing, and security testing. It can generate and execute comprehensive test suites across your entire stack.",
  },
  {
    q: "What dev environments do you support?",
    a: "TestSprite supports Cursor, VS Code, Claude Code, Trae, and other popular IDEs through our MCP server integration. It works with any modern web application framework.",
  },
  {
    q: "How does TestSprite ensure data security?",
    a: "TestSprite follows industry-standard security practices including SOC 2 compliance, data encryption at rest and in transit, and isolated test environments. Your source code and test data are never shared or stored unnecessarily.",
  },
  {
    q: "How many projects can I build with TestSprite?",
    a: "Free plans support 1 project. Starter plans support up to 5 projects. Standard and Enterprise plans support unlimited projects.",
  },
] as const;

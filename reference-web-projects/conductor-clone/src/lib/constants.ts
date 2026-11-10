export const APP_NAME = "Conductor";
export const APP_TAGLINE = "The best QuickBooks Desktop/Enterprise API on the planet";
export const APP_DESCRIPTION = "Real-time, fully-typed access to every QuickBooks object via Python, Node.js/TypeScript, and REST.";
export const APP_COMPANY = "Conductor Labs Inc.";
export const APP_YEAR = 2026;
export const APP_LOCATION = "San Francisco";
export const APP_SUPPORT_EMAIL = "support@conductor.is";
export const APP_SALES_EMAIL = "sales@conductor.is";

export const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "FAQ", href: "/faq" },
  { label: "Security", href: "/security" },
  { label: "Love", href: "/love" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/company" },
  { label: "Support", href: "/support" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "QuickBooks Desktop", href: "/integrations/quickbooks-desktop" },
    { label: "QuickBooks Enterprise", href: "/integrations/quickbooks-enterprise" },
    { label: "FAQ", href: "/faq" },
    { label: "Security", href: "/security" },
    { label: "Testimonials", href: "/love" },
    { label: "Pricing", href: "/pricing" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/docs/help" },
    { label: "Status", href: "/status" },
    { label: "Quickstart", href: "/docs/quickstart" },
    { label: "Community", href: "/community" },
  ],
  company: [
    { label: "About", href: "/company" },
    { label: "Values", href: "/company/values" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Trust Center", href: "/trust" },
  ],
} as const;

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Connections", href: "/dashboard/connections", icon: "Link" },
  { label: "End Users", href: "/dashboard/end-users", icon: "Users" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: "Key" },
  { label: "Requests", href: "/dashboard/requests", icon: "Activity" },
  { label: "Logs", href: "/dashboard/logs", icon: "FileText" },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: "Webhook" },
  { label: "Auth Flows", href: "/dashboard/auth-flows", icon: "Shield" },
  { label: "Objects", href: "/dashboard/objects", icon: "Database" },
  { label: "Sync Status", href: "/dashboard/sync-status", icon: "RefreshCw" },
  { label: "Error Monitor", href: "/dashboard/errors", icon: "AlertTriangle" },
  { label: "Usage", href: "/dashboard/usage", icon: "BarChart3" },
  { label: "Billing", href: "/dashboard/billing", icon: "CreditCard" },
  { label: "Team", href: "/dashboard/team", icon: "UserPlus" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
  { label: "Integrations", href: "/dashboard/integrations", icon: "Puzzle" },
  { label: "Environments", href: "/dashboard/environments", icon: "Globe" },
  { label: "Audit Log", href: "/dashboard/audit-log", icon: "ClipboardList" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { label: "Support", href: "/dashboard/support", icon: "HelpCircle" },
] as const;

export const PRICING_PLANS = [
  {
    name: "Trial",
    price: "Free",
    period: "",
    description: "1 connection for testing and development only",
    features: [
      "Unlimited API usage for testing",
      "Self-serve connection setup",
      "Library of crafted help guides for common QBD issues",
      "24/7 customer support",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Production",
    price: "$49",
    period: "per company file / per month",
    description: "Free for unlimited testing until you ship to production",
    features: [
      "Unlimited production API usage",
      "Dedicated Slack channel with our engineering team",
      "Fully typed native real-time SDKs for Python and Node/JS/TS",
      "UI onboarding flow for your users",
      "Dashboard to manage, monitor, and debug connections",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Tailored pricing",
    period: "",
    description: "Everything in the Production plan, plus…",
    features: [
      "Volume discounts for customers with many connections",
      "Custom SLA and priority support",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
] as const;

export const TESTIMONIALS = [
  { quote: "It's been seamless.", author: "Sarah K.", role: "CTO, TechCorp" },
  { quote: "I wish I'd known about this for years.", author: "Mike R.", role: "Lead Developer, BuildCo" },
  { quote: "You've got a great product here, and I'm excited to keep building on it!", author: "James T.", role: "Engineer, DataFlow" },
  { quote: "100% a Stripe-quality dev experience.", author: "Lisa M.", role: "VP Engineering, FinStack" },
  { quote: "My jaw dropped when I saw what you have done. It looks awesome.", author: "David P.", role: "Founder, CloudRig" },
  { quote: "We LOVE the API!", author: "Team at Miter", role: "Engineering Team" },
  { quote: "Your support is extremely helpful. One of the best support services we've ever received.", author: "Chris B.", role: "CTO, SupplyChain Pro" },
  { quote: "Kudos on building a killer product!", author: "Ana S.", role: "Lead Dev, TrashLab" },
  { quote: "Fantastic piece of software! And an amazing company.", author: "Tom H.", role: "Senior Engineer, Pallet" },
  { quote: "Super fast support!", author: "Rachel W.", role: "Developer, Attain" },
  { quote: "You are something else. Really amazing work. Can't say enough.", author: "Kevin L.", role: "Founder, WizCommerce" },
  { quote: "Quite happy we found your product. Made the integration a breeze.", author: "Nate D.", role: "Tech Lead, Spotdly" },
] as const;

export const FEATURES = [
  {
    title: "Instant integration",
    description: "Get up and running in minutes with our modern SDKs and comprehensive documentation.",
  },
  {
    title: "End-to-end type safety",
    description: "Full TypeScript and Python type definitions for every object, field, and endpoint.",
  },
  {
    title: "100% API coverage",
    description: "Access every single QuickBooks Desktop endpoint and object type.",
  },
  {
    title: "Real-time bidirectional sync",
    description: "Read and write data in real-time with automatic conflict resolution.",
  },
  {
    title: "Automated error handling",
    description: "Unified error format with user-friendly messages and resolution instructions.",
  },
  {
    title: "Beautiful dashboard",
    description: "Create, manage, monitor, and debug your end-user connections from our lightning-fast dashboard.",
  },
] as const;

export const PARTNER_LOGOS = [
  "Miter", "Pallet", "WizCommerce", "TrashLab", "Attain",
  "Spotdly", "CloudRig", "SilkRoute AI", "ANCKR", "Suppliermate",
  "Krahnborn", "DEV///AO", "Mortarlink", "iTV Valuations",
] as const;

export const QB_OBJECT_TYPES = [
  "Invoice", "Customer", "Vendor", "Bill", "Payment",
  "Item", "Account", "Employee", "SalesReceipt", "CreditMemo",
  "PurchaseOrder", "Estimate", "JournalEntry", "TimeTracking",
  "Class", "Department", "PaymentMethod", "SalesTaxCode",
  "Terms", "ShipMethod",
] as const;

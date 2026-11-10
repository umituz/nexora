export const APP_NAME = "SignalTrack";
export const APP_DESCRIPTION = "Application Performance Monitoring";
export const APP_TAGLINE = "Monitor with ease. Code with confidence.";
export const APP_SUBTITLE = "Move from alert to fix, before your customers even notice. Easy to install. Straightforward to use. Powerful by design.";

export const NAV_LINKS = {
  marketing: [
    { label: "APM", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  dashboard: {
    main: [
      { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Errors", href: "/dashboard/errors", icon: "Bug" },
      { label: "Performance", href: "/dashboard/performance", icon: "Gauge" },
      { label: "Host Monitoring", href: "/dashboard/hosts", icon: "Server" },
      { label: "Anomaly Detection", href: "/dashboard/anomalies", icon: "AlertTriangle" },
      { label: "Uptime Monitoring", href: "/dashboard/uptime", icon: "Activity" },
    ],
    analytics: [
      { label: "Metric Dashboards", href: "/dashboard/metrics", icon: "BarChart3" },
      { label: "Custom Dashboard", href: "/dashboard/custom-dashboard", icon: "LayoutGrid" },
      { label: "Graphs", href: "/dashboard/graphs", icon: "LineChart" },
      { label: "Log Management", href: "/dashboard/logs", icon: "FileText" },
      { label: "Time Detective", href: "/dashboard/time-detective", icon: "Clock" },
    ],
    automation: [
      { label: "Check-ins", href: "/dashboard/check-ins", icon: "CheckSquare" },
      { label: "Workflow", href: "/dashboard/workflow", icon: "GitBranch" },
      { label: "Deploys", href: "/dashboard/deploys", icon: "Rocket" },
      { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
      { label: "Integrations", href: "/dashboard/integrations", icon: "Puzzle" },
    ],
    management: [
      { label: "Apps", href: "/dashboard/apps", icon: "Boxes" },
      { label: "Team Members", href: "/dashboard/team", icon: "Users" },
      { label: "API Keys", href: "/dashboard/api-keys", icon: "Key" },
      { label: "Billing", href: "/dashboard/billing", icon: "CreditCard" },
      { label: "Status Page", href: "/dashboard/status-page", icon: "Globe" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
    ],
  },
} as const;

export const FEATURES = [
  {
    id: "errors",
    title: "Error Tracking",
    description: "Track exceptions, get error alerts, debug and fix bugs with ease.",
    bullets: ["Detailed error reports", "Real-time error alerts", "Send to your issue tracker", "Tag errors with custom attributes", "Filter & find errors"],
    icon: "Bug",
  },
  {
    id: "performance",
    title: "Performance Monitoring",
    description: "Monitor the performance of your slowest actions down to the nanosecond.",
    bullets: ["Alerts for slow requests", "Duration breakdown", "Detailed tracing timeline", "Find and fix slow queries", "90th percentile breakdown"],
    icon: "Gauge",
  },
  {
    id: "hosts",
    title: "Host Monitoring",
    description: "Monitoring for your servers: keep an eye on CPU, Disk, Network & more.",
    bullets: ["CPU usage", "Disk I/O and usage", "Load average", "Memory & Network usage", "Kubernetes metrics"],
    icon: "Server",
  },
  {
    id: "anomalies",
    title: "Anomaly Detection",
    description: "Avoid surprises and set triggers for anomalies on any metric you'd like.",
    bullets: ["Set alerts on any metric", "Pre-configured for key alerts", "Reduce noise with smart delays", "Send via Slack, email, and more"],
    icon: "AlertTriangle",
  },
  {
    id: "uptime",
    title: "Uptime Monitoring",
    description: "Get alerted in real-time when your application is down.",
    bullets: ["Monitor uptime from around the globe", "Ping your site every 30 seconds", "Receive downtime notifications", "Free public status page"],
    icon: "Activity",
  },
  {
    id: "metrics",
    title: "Metric Dashboards",
    description: "Collect metrics from your code and chart them on interactive dashboards.",
    bullets: ["Dozens of auto-generated dashboards", "Build custom dashboards in minutes", "Export and share charts", "View in fullscreen mode"],
    icon: "BarChart3",
  },
  {
    id: "logs",
    title: "Log Management",
    description: "Collect and manage logs in an easy-to-use interface.",
    bullets: ["Centralized log management", "Simple search and filtering", "Link to error and performance issues", "Log custom attributes"],
    icon: "FileText",
  },
  {
    id: "checkins",
    title: "Check-ins",
    description: "Monitor your application's background jobs and processes.",
    bullets: ["Monitor scheduled jobs", "Track continuous processes", "Alerts for missed check-ins", "Detailed job performance insights"],
    icon: "CheckSquare",
  },
] as const;

export const LANGUAGES = [
  { name: "Ruby", frameworks: ["Ruby on Rails", "Sinatra", "Active Record", "Delayed::Job"] },
  { name: "Elixir", frameworks: ["Phoenix", "Ecto", "Oban", "Finch"] },
  { name: "Node.js", frameworks: ["Express", "NestJS", "Next.js", "Mongoose"] },
  { name: "JavaScript", frameworks: ["React", "Angular", "Vue", "Stimulus"] },
  { name: "Python", frameworks: ["Django", "FastAPI", "Flask", "Celery"] },
  { name: "Go", frameworks: ["Gin", "Echo", "Fiber", "net/http"] },
] as const;

export const TESTIMONIALS = [
  { quote: "This tool is an absolute lifesaver. Just fixed 2 errors, 2 minutes after they happened.", author: "Sarah Chen", role: "Lead Developer", company: "TechFlow" },
  { quote: "Just turned hours of debugging into minutes. Incredible product.", author: "Marcus Webb", role: "CTO", company: "DataPulse" },
  { quote: "I can notify a client about an error before they even submit a ticket.", author: "Emily Rodriguez", role: "Senior Engineer", company: "CloudNine" },
  { quote: "Very impressed with the monitoring capabilities. A must-have for any team.", author: "James Park", role: "DevOps Lead", company: "ScaleUp" },
] as const;

export const PRICING_PLANS = [
  { name: "Developer", price: 0, period: "month", features: ["1 app", "1 user", "100K requests/month", "7-day data retention", "Error tracking", "Performance monitoring"], cta: "Start free", popular: false },
  { name: "Team", price: 29, period: "month", features: ["5 apps", "10 users", "1M requests/month", "30-day data retention", "All monitoring features", "Anomaly detection", "Log management", "Slack & email alerts"], cta: "Start free trial", popular: true },
  { name: "Business", price: 99, period: "month", features: ["Unlimited apps", "Unlimited users", "10M requests/month", "90-day data retention", "Everything in Team", "Custom dashboards", "SAML SSO", "Priority support"], cta: "Start free trial", popular: false },
  { name: "Enterprise", price: -1, period: "month", features: ["Custom volume", "Unlimited users", "Unlimited data retention", "Everything in Business", "Dedicated support", "SLA guarantee", "Custom integrations", "On-premise option"], cta: "Contact sales", popular: false },
] as const;

export const STORAGE_KEYS = {
  THEME: "signaltrack-theme",
  USER: "signaltrack-user",
  NOTIFICATIONS: "signaltrack-notifications",
  SETTINGS: "signaltrack-settings",
  SIDEBAR_COLLAPSED: "signaltrack-sidebar-collapsed",
} as const;

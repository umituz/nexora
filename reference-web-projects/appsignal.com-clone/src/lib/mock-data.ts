// ============ Error Mock Data ============
export interface ErrorItem {
  id: string;
  name: string;
  message: string;
  errorType: string;
  action: string;
  count: number;
  lastSeen: string;
  firstSeen: string;
  status: "open" | "closed" | "ignored";
  severity: "critical" | "warning" | "info";
  namespace: string;
  tags: string[];
}

export const mockErrors: ErrorItem[] = [
  { id: "err-001", name: "NoMethodError", message: "undefined method 'name' for nil:NilClass", errorType: "NoMethodError", action: "UsersController#show", count: 1247, lastSeen: "2 minutes ago", firstSeen: "3 days ago", status: "open", severity: "critical", namespace: "web", tags: ["production", "api"] },
  { id: "err-002", name: "ActiveRecord::RecordNotFound", message: "Couldn't find User with 'id'=42", errorType: "RecordNotFound", action: "Api::V2::UsersController#show", count: 832, lastSeen: "5 minutes ago", firstSeen: "1 week ago", status: "open", severity: "warning", namespace: "api", tags: ["production"] },
  { id: "err-003", name: "TimeoutError", message: "Connection timed out after 30s", errorType: "TimeoutError", action: "PaymentsController#create", count: 456, lastSeen: "15 minutes ago", firstSeen: "2 days ago", status: "open", severity: "critical", namespace: "web", tags: ["production", "payments"] },
  { id: "err-004", name: "JSON::ParserError", message: "unexpected token at '{invalid}'", errorType: "ParserError", action: "WebhooksController#receive", count: 234, lastSeen: "1 hour ago", firstSeen: "5 days ago", status: "open", severity: "warning", namespace: "background", tags: ["webhooks"] },
  { id: "err-005", name: "Redis::ConnectionError", message: "Connection refused - connect(2)", errorType: "ConnectionError", action: "CacheWorker#perform", count: 189, lastSeen: "30 minutes ago", firstSeen: "1 day ago", status: "open", severity: "critical", namespace: "background", tags: ["redis", "worker"] },
  { id: "err-006", name: "ArgumentError", message: "wrong number of arguments (given 3, expected 2)", errorType: "ArgumentError", action: "ReportsController#generate", count: 98, lastSeen: "2 hours ago", firstSeen: "4 days ago", status: "ignored", severity: "info", namespace: "web", tags: ["reports"] },
  { id: "err-007", name: "Net::SMTPAuthenticationError", message: "535 Authentication failed", errorType: "SMTPError", action: "NotificationMailer#send_alert", count: 67, lastSeen: "45 minutes ago", firstSeen: "12 hours ago", status: "open", severity: "warning", namespace: "background", tags: ["email"] },
  { id: "err-008", name: "Errno::ENOSPC", message: "No space left on device", errorType: "SystemError", action: "FileUploadController#create", count: 23, lastSeen: "3 hours ago", firstSeen: "6 hours ago", status: "open", severity: "critical", namespace: "web", tags: ["storage"] },
];

// ============ Performance Mock Data ============
export interface PerformanceAction {
  id: string;
  action: string;
  method: string;
  meanDuration: number;
  p90Duration: number;
  p95Duration: number;
  throughput: number;
  errorRate: number;
  lastRequest: string;
}

export const mockPerformanceActions: PerformanceAction[] = [
  { id: "perf-001", action: "UsersController#index", method: "GET", meanDuration: 245, p90Duration: 890, p95Duration: 1200, throughput: 4521, errorRate: 0.3, lastRequest: "1 min ago" },
  { id: "perf-002", action: "Api::V2::OrdersController#create", method: "POST", meanDuration: 1850, p90Duration: 3400, p95Duration: 5200, throughput: 1234, errorRate: 1.2, lastRequest: "2 min ago" },
  { id: "perf-003", action: "DashboardController#show", method: "GET", meanDuration: 567, p90Duration: 1200, p95Duration: 1800, throughput: 8932, errorRate: 0.1, lastRequest: "30 sec ago" },
  { id: "perf-004", action: "SearchController#query", method: "GET", meanDuration: 890, p90Duration: 2100, p95Duration: 3500, throughput: 3456, errorRate: 0.5, lastRequest: "1 min ago" },
  { id: "perf-005", action: "PaymentsController#process", method: "POST", meanDuration: 2340, p90Duration: 4500, p95Duration: 6800, throughput: 789, errorRate: 2.1, lastRequest: "5 min ago" },
  { id: "perf-006", action: "ReportsController#export", method: "GET", meanDuration: 4500, p90Duration: 8900, p95Duration: 12000, throughput: 234, errorRate: 3.5, lastRequest: "10 min ago" },
  { id: "perf-007", action: "Api::V2::ProductsController#index", method: "GET", meanDuration: 123, p90Duration: 340, p95Duration: 560, throughput: 12345, errorRate: 0.05, lastRequest: "15 sec ago" },
  { id: "perf-008", action: "WebhooksController#receive", method: "POST", meanDuration: 78, p90Duration: 150, p95Duration: 230, throughput: 5678, errorRate: 0.8, lastRequest: "45 sec ago" },
];

// ============ Host Mock Data ============
export interface HostInfo {
  id: string;
  hostname: string;
  status: "healthy" | "warning" | "critical" | "offline";
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  loadAvg: [number, number, number];
  uptime: string;
  os: string;
  cores: number;
  totalMemory: number;
}

export const mockHosts: HostInfo[] = [
  { id: "host-001", hostname: "web-prod-01", status: "healthy", cpuUsage: 34, memoryUsage: 67, diskUsage: 45, networkIn: 234, networkOut: 189, loadAvg: [1.2, 1.5, 1.3], uptime: "45 days", os: "Ubuntu 22.04", cores: 8, totalMemory: 32 },
  { id: "host-002", hostname: "web-prod-02", status: "warning", cpuUsage: 78, memoryUsage: 85, diskUsage: 72, networkIn: 567, networkOut: 345, loadAvg: [3.8, 4.2, 3.9], uptime: "12 days", os: "Ubuntu 22.04", cores: 8, totalMemory: 32 },
  { id: "host-003", hostname: "api-prod-01", status: "healthy", cpuUsage: 45, memoryUsage: 56, diskUsage: 38, networkIn: 890, networkOut: 678, loadAvg: [2.1, 2.3, 2.0], uptime: "90 days", os: "Ubuntu 22.04", cores: 16, totalMemory: 64 },
  { id: "host-004", hostname: "worker-prod-01", status: "critical", cpuUsage: 95, memoryUsage: 92, diskUsage: 88, networkIn: 123, networkOut: 89, loadAvg: [7.8, 8.1, 7.5], uptime: "3 days", os: "Ubuntu 22.04", cores: 4, totalMemory: 16 },
  { id: "host-005", hostname: "db-prod-01", status: "healthy", cpuUsage: 23, memoryUsage: 78, diskUsage: 56, networkIn: 1200, networkOut: 890, loadAvg: [1.5, 1.8, 1.4], uptime: "120 days", os: "Ubuntu 22.04", cores: 32, totalMemory: 128 },
  { id: "host-006", hostname: "cache-prod-01", status: "healthy", cpuUsage: 12, memoryUsage: 45, diskUsage: 15, networkIn: 2300, networkOut: 2100, loadAvg: [0.5, 0.8, 0.6], uptime: "60 days", os: "Ubuntu 22.04", cores: 4, totalMemory: 16 },
];

// ============ Uptime Mock Data ============
export interface UptimeMonitor {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "degraded";
  uptime30d: number;
  responseTime: number;
  checkInterval: number;
  lastChecked: string;
  regions: string[];
  sslExpiry: string;
}

export const mockUptimeMonitors: UptimeMonitor[] = [
  { id: "up-001", name: "Main Website", url: "https://example.com", status: "up", uptime30d: 99.98, responseTime: 145, checkInterval: 30, lastChecked: "15 seconds ago", regions: ["US East", "EU West", "Asia Pacific"], sslExpiry: "2026-08-15" },
  { id: "up-002", name: "API v2", url: "https://api.example.com/v2/health", status: "up", uptime30d: 99.95, responseTime: 89, checkInterval: 30, lastChecked: "10 seconds ago", regions: ["US East", "US West", "EU West"], sslExpiry: "2026-08-15" },
  { id: "up-003", name: "Admin Panel", url: "https://admin.example.com", status: "degraded", uptime30d: 98.5, responseTime: 2340, checkInterval: 60, lastChecked: "45 seconds ago", regions: ["US East", "EU West"], sslExpiry: "2026-06-01" },
  { id: "up-004", name: "CDN Assets", url: "https://cdn.example.com/health", status: "up", uptime30d: 99.999, responseTime: 23, checkInterval: 30, lastChecked: "5 seconds ago", regions: ["US East", "US West", "EU West", "Asia Pacific"], sslExpiry: "2026-12-01" },
  { id: "up-005", name: "Staging Environment", url: "https://staging.example.com", status: "down", uptime30d: 95.2, responseTime: 0, checkInterval: 60, lastChecked: "30 seconds ago", regions: ["US East"], sslExpiry: "2026-03-15" },
];

// ============ Log Mock Data ============
export interface LogEntry {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warning" | "error" | "fatal";
  message: string;
  source: string;
  hostname: string;
  attributes: Record<string, string>;
}

export const mockLogs: LogEntry[] = [
  { id: "log-001", timestamp: "2026-03-08T14:32:15.123Z", level: "error", message: "Failed to connect to database: connection refused", source: "app.database", hostname: "web-prod-01", attributes: { request_id: "abc-123", user_id: "user-456" } },
  { id: "log-002", timestamp: "2026-03-08T14:32:14.890Z", level: "warning", message: "Slow query detected: SELECT * FROM users WHERE... (3.2s)", source: "app.queries", hostname: "api-prod-01", attributes: { query_time: "3200ms", table: "users" } },
  { id: "log-003", timestamp: "2026-03-08T14:32:14.567Z", level: "info", message: "Deploy completed successfully: v2.4.1", source: "app.deploy", hostname: "web-prod-01", attributes: { version: "2.4.1", deployer: "ci-bot" } },
  { id: "log-004", timestamp: "2026-03-08T14:32:13.234Z", level: "error", message: "Payment processing failed: insufficient funds", source: "app.payments", hostname: "api-prod-01", attributes: { order_id: "ord-789", amount: "$49.99" } },
  { id: "log-005", timestamp: "2026-03-08T14:32:12.901Z", level: "debug", message: "Cache miss for key: user_profile_42", source: "app.cache", hostname: "cache-prod-01", attributes: { cache_key: "user_profile_42" } },
  { id: "log-006", timestamp: "2026-03-08T14:32:12.567Z", level: "info", message: "User login successful", source: "app.auth", hostname: "web-prod-01", attributes: { user_id: "user-123", method: "oauth" } },
  { id: "log-007", timestamp: "2026-03-08T14:32:11.234Z", level: "fatal", message: "Out of memory: process killed", source: "system", hostname: "worker-prod-01", attributes: { pid: "12345", memory_mb: "15892" } },
  { id: "log-008", timestamp: "2026-03-08T14:32:10.890Z", level: "warning", message: "Rate limit approaching: 450/500 requests", source: "app.api", hostname: "api-prod-01", attributes: { client_id: "client-abc", limit: "500" } },
  { id: "log-009", timestamp: "2026-03-08T14:32:09.567Z", level: "info", message: "Background job completed: SendWeeklyReport", source: "app.jobs", hostname: "worker-prod-01", attributes: { job_id: "job-567", duration: "12.3s" } },
  { id: "log-010", timestamp: "2026-03-08T14:32:08.234Z", level: "error", message: "SSL certificate validation failed for webhook endpoint", source: "app.webhooks", hostname: "api-prod-01", attributes: { endpoint: "https://partner.example.com/webhook" } },
];

// ============ Check-in Mock Data ============
export interface CheckIn {
  id: string;
  name: string;
  schedule: string;
  lastCheckIn: string;
  nextExpected: string;
  status: "ok" | "missed" | "late";
  type: "cron" | "heartbeat";
  avgDuration: number;
}

export const mockCheckIns: CheckIn[] = [
  { id: "ci-001", name: "Daily Report Generation", schedule: "0 6 * * *", lastCheckIn: "Today at 06:00", nextExpected: "Tomorrow at 06:00", status: "ok", type: "cron", avgDuration: 45 },
  { id: "ci-002", name: "Hourly Data Sync", schedule: "0 * * * *", lastCheckIn: "14:00 today", nextExpected: "15:00 today", status: "ok", type: "cron", avgDuration: 12 },
  { id: "ci-003", name: "Payment Queue Processor", schedule: "heartbeat", lastCheckIn: "2 minutes ago", nextExpected: "Within 5 min", status: "ok", type: "heartbeat", avgDuration: 0 },
  { id: "ci-004", name: "Email Digest Sender", schedule: "0 9 * * 1", lastCheckIn: "Last Monday", nextExpected: "Next Monday at 09:00", status: "missed", type: "cron", avgDuration: 120 },
  { id: "ci-005", name: "Database Backup", schedule: "0 2 * * *", lastCheckIn: "Today at 02:00", nextExpected: "Tomorrow at 02:00", status: "ok", type: "cron", avgDuration: 300 },
  { id: "ci-006", name: "Health Check Worker", schedule: "heartbeat", lastCheckIn: "15 minutes ago", nextExpected: "Within 5 min", status: "late", type: "heartbeat", avgDuration: 0 },
];

// ============ Deploy Mock Data ============
export interface Deploy {
  id: string;
  version: string;
  deployer: string;
  timestamp: string;
  status: "success" | "failed" | "rolling_back";
  duration: number;
  changes: number;
  description: string;
  markers: { errors: number; performance: number };
}

export const mockDeploys: Deploy[] = [
  { id: "dep-001", version: "v2.4.1", deployer: "CI/CD Pipeline", timestamp: "2026-03-08T14:30:00Z", status: "success", duration: 180, changes: 12, description: "Fix payment processing timeout", markers: { errors: -5, performance: 2 } },
  { id: "dep-002", version: "v2.4.0", deployer: "sarah.chen", timestamp: "2026-03-07T16:00:00Z", status: "success", duration: 240, changes: 34, description: "New dashboard features", markers: { errors: 3, performance: -8 } },
  { id: "dep-003", version: "v2.3.9", deployer: "CI/CD Pipeline", timestamp: "2026-03-06T10:00:00Z", status: "failed", duration: 60, changes: 5, description: "Database migration update", markers: { errors: 15, performance: 0 } },
  { id: "dep-004", version: "v2.3.8", deployer: "marcus.webb", timestamp: "2026-03-05T09:00:00Z", status: "success", duration: 150, changes: 8, description: "Performance optimization for search", markers: { errors: 0, performance: -15 } },
  { id: "dep-005", version: "v2.3.7", deployer: "CI/CD Pipeline", timestamp: "2026-03-04T14:00:00Z", status: "success", duration: 200, changes: 21, description: "User authentication overhaul", markers: { errors: -2, performance: 1 } },
];

// ============ Anomaly/Alert Mock Data ============
export interface AnomalyTrigger {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  status: "active" | "triggered" | "disabled";
  lastTriggered: string | null;
  notifyChannels: string[];
  warmupDelay: number;
}

export const mockAnomalyTriggers: AnomalyTrigger[] = [
  { id: "at-001", name: "High Error Rate", metric: "error_rate", condition: "above", threshold: 5, status: "triggered", lastTriggered: "10 minutes ago", notifyChannels: ["slack", "email"], warmupDelay: 5 },
  { id: "at-002", name: "Slow Response Time", metric: "response_time_p95", condition: "above", threshold: 3000, status: "active", lastTriggered: "2 hours ago", notifyChannels: ["slack"], warmupDelay: 10 },
  { id: "at-003", name: "High CPU Usage", metric: "cpu_usage", condition: "above", threshold: 90, status: "triggered", lastTriggered: "5 minutes ago", notifyChannels: ["slack", "email", "pagerduty"], warmupDelay: 3 },
  { id: "at-004", name: "Low Disk Space", metric: "disk_usage", condition: "above", threshold: 85, status: "active", lastTriggered: "1 day ago", notifyChannels: ["email"], warmupDelay: 15 },
  { id: "at-005", name: "Memory Pressure", metric: "memory_usage", condition: "above", threshold: 90, status: "active", lastTriggered: null, notifyChannels: ["slack"], warmupDelay: 5 },
  { id: "at-006", name: "Queue Backlog", metric: "queue_size", condition: "above", threshold: 1000, status: "disabled", lastTriggered: "3 days ago", notifyChannels: ["slack"], warmupDelay: 10 },
];

// ============ Notification Mock Data ============
export interface Notification {
  id: string;
  type: "error" | "performance" | "uptime" | "anomaly" | "deploy" | "checkin";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl: string;
}

export const mockNotifications: Notification[] = [
  { id: "notif-001", type: "error", title: "New error detected", message: "NoMethodError in UsersController#show", timestamp: "2 minutes ago", read: false, actionUrl: "/dashboard/errors/err-001" },
  { id: "notif-002", type: "anomaly", title: "High CPU alert triggered", message: "worker-prod-01 CPU at 95%", timestamp: "5 minutes ago", read: false, actionUrl: "/dashboard/anomalies" },
  { id: "notif-003", type: "deploy", title: "Deploy successful", message: "v2.4.1 deployed successfully", timestamp: "30 minutes ago", read: false, actionUrl: "/dashboard/deploys" },
  { id: "notif-004", type: "uptime", title: "Site down", message: "staging.example.com is unreachable", timestamp: "1 hour ago", read: true, actionUrl: "/dashboard/uptime" },
  { id: "notif-005", type: "performance", title: "Slow endpoint detected", message: "ReportsController#export averaging 4.5s", timestamp: "2 hours ago", read: true, actionUrl: "/dashboard/performance" },
  { id: "notif-006", type: "checkin", title: "Missed check-in", message: "Email Digest Sender missed scheduled run", timestamp: "3 hours ago", read: true, actionUrl: "/dashboard/check-ins" },
];

// ============ Integration Mock Data ============
export interface Integration {
  id: string;
  name: string;
  category: "notification" | "issue_tracker" | "deployment" | "communication";
  description: string;
  connected: boolean;
  icon: string;
}

export const mockIntegrations: Integration[] = [
  { id: "int-001", name: "Slack", category: "notification", description: "Get alerts and notifications in Slack channels", connected: true, icon: "MessageSquare" },
  { id: "int-002", name: "PagerDuty", category: "notification", description: "Route alerts to on-call responders", connected: true, icon: "Phone" },
  { id: "int-003", name: "Jira", category: "issue_tracker", description: "Create issues from errors automatically", connected: true, icon: "Ticket" },
  { id: "int-004", name: "GitHub", category: "issue_tracker", description: "Link errors to GitHub issues", connected: false, icon: "Github" },
  { id: "int-005", name: "GitLab", category: "issue_tracker", description: "Create GitLab issues from errors", connected: false, icon: "GitBranch" },
  { id: "int-006", name: "Discord", category: "communication", description: "Send notifications to Discord channels", connected: false, icon: "MessageCircle" },
  { id: "int-007", name: "Microsoft Teams", category: "communication", description: "Get alerts in Teams channels", connected: true, icon: "Users" },
  { id: "int-008", name: "Heroku", category: "deployment", description: "Track Heroku deployments", connected: false, icon: "Cloud" },
  { id: "int-009", name: "Vercel", category: "deployment", description: "Monitor Vercel deployments", connected: true, icon: "Triangle" },
  { id: "int-010", name: "Linear", category: "issue_tracker", description: "Sync issues with Linear", connected: false, icon: "Zap" },
];

// ============ Team Mock Data ============
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar: string;
  lastActive: string;
  joinedAt: string;
}

export const mockTeamMembers: TeamMember[] = [
  { id: "tm-001", name: "Sarah Chen", email: "sarah@example.com", role: "owner", avatar: "SC", lastActive: "Just now", joinedAt: "2024-01-15" },
  { id: "tm-002", name: "Marcus Webb", email: "marcus@example.com", role: "admin", avatar: "MW", lastActive: "5 minutes ago", joinedAt: "2024-02-20" },
  { id: "tm-003", name: "Emily Rodriguez", email: "emily@example.com", role: "member", avatar: "ER", lastActive: "1 hour ago", joinedAt: "2024-03-10" },
  { id: "tm-004", name: "James Park", email: "james@example.com", role: "member", avatar: "JP", lastActive: "3 hours ago", joinedAt: "2024-04-05" },
  { id: "tm-005", name: "Alex Turner", email: "alex@example.com", role: "viewer", avatar: "AT", lastActive: "1 day ago", joinedAt: "2024-06-15" },
];

// ============ App/Project Mock Data ============
export interface AppProject {
  id: string;
  name: string;
  environment: "production" | "staging" | "development";
  language: string;
  framework: string;
  status: "active" | "inactive";
  errorCount24h: number;
  requestCount24h: number;
  avgResponseTime: number;
}

export const mockApps: AppProject[] = [
  { id: "app-001", name: "Main Web App", environment: "production", language: "Ruby", framework: "Rails", status: "active", errorCount24h: 47, requestCount24h: 125000, avgResponseTime: 245 },
  { id: "app-002", name: "API Service", environment: "production", language: "Node.js", framework: "Express", status: "active", errorCount24h: 12, requestCount24h: 890000, avgResponseTime: 89 },
  { id: "app-003", name: "Admin Dashboard", environment: "production", language: "JavaScript", framework: "React", status: "active", errorCount24h: 3, requestCount24h: 15000, avgResponseTime: 156 },
  { id: "app-004", name: "Background Workers", environment: "production", language: "Python", framework: "Celery", status: "active", errorCount24h: 8, requestCount24h: 45000, avgResponseTime: 1200 },
  { id: "app-005", name: "Main Web App", environment: "staging", language: "Ruby", framework: "Rails", status: "active", errorCount24h: 156, requestCount24h: 5000, avgResponseTime: 567 },
  { id: "app-006", name: "Mobile API", environment: "production", language: "Elixir", framework: "Phoenix", status: "active", errorCount24h: 2, requestCount24h: 340000, avgResponseTime: 45 },
];

// ============ API Key Mock Data ============
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: "push" | "frontend";
  createdAt: string;
  lastUsed: string;
  createdBy: string;
}

export const mockApiKeys: ApiKey[] = [
  { id: "ak-001", name: "Production Push Key", key: "sk_live_abc...xyz", type: "push", createdAt: "2024-01-15", lastUsed: "Just now", createdBy: "sarah@example.com" },
  { id: "ak-002", name: "Frontend Key", key: "pk_live_def...uvw", type: "frontend", createdAt: "2024-01-15", lastUsed: "2 minutes ago", createdBy: "sarah@example.com" },
  { id: "ak-003", name: "Staging Push Key", key: "sk_test_ghi...rst", type: "push", createdAt: "2024-02-20", lastUsed: "1 hour ago", createdBy: "marcus@example.com" },
  { id: "ak-004", name: "CI/CD Key", key: "sk_live_jkl...opq", type: "push", createdAt: "2024-03-10", lastUsed: "30 minutes ago", createdBy: "sarah@example.com" },
];

// ============ Chart/Time Series Data ============
export function generateTimeSeriesData(points: number, baseValue: number, variance: number): Array<{ time: string; value: number }> {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance * 2),
  }));
}

export function generateMultiSeriesData(points: number, series: Record<string, { base: number; variance: number }>): Array<Record<string, string | number>> {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const entry: Record<string, string | number> = {
      time: new Date(now - (points - i) * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    for (const [key, config] of Object.entries(series)) {
      entry[key] = Math.max(0, Math.round(config.base + (Math.random() - 0.5) * config.variance * 2));
    }
    return entry;
  });
}

// ============ Workflow Mock Data ============
export interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  lastTriggered: string | null;
  triggerCount: number;
}

export const mockWorkflows: WorkflowRule[] = [
  { id: "wf-001", name: "Critical Error Alert", trigger: "New error", conditions: ["Severity is critical", "Namespace is production"], actions: ["Send Slack notification", "Create Jira ticket", "Page on-call"], enabled: true, lastTriggered: "10 minutes ago", triggerCount: 45 },
  { id: "wf-002", name: "Deploy Notification", trigger: "Deploy completed", conditions: ["Environment is production"], actions: ["Send Slack notification", "Update status page"], enabled: true, lastTriggered: "30 minutes ago", triggerCount: 123 },
  { id: "wf-003", name: "Performance Degradation", trigger: "P95 response time", conditions: ["Duration > 5000ms", "Throughput > 100 rpm"], actions: ["Send email alert", "Create incident"], enabled: true, lastTriggered: "2 hours ago", triggerCount: 12 },
  { id: "wf-004", name: "Uptime Down Alert", trigger: "Uptime check failed", conditions: ["Consecutive failures > 3"], actions: ["Send PagerDuty alert", "Send Slack notification", "Update status page"], enabled: true, lastTriggered: "1 hour ago", triggerCount: 8 },
  { id: "wf-005", name: "Weekly Report", trigger: "Schedule: Monday 9:00", conditions: [], actions: ["Generate report", "Send email to team"], enabled: false, lastTriggered: "Last Monday", triggerCount: 52 },
];

// ============ Status Page Mock Data ============
export interface StatusComponent {
  id: string;
  name: string;
  status: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";
  group: string;
}

export const mockStatusComponents: StatusComponent[] = [
  { id: "sc-001", name: "Web Application", status: "operational", group: "Core Services" },
  { id: "sc-002", name: "API v2", status: "operational", group: "Core Services" },
  { id: "sc-003", name: "Admin Panel", status: "degraded", group: "Core Services" },
  { id: "sc-004", name: "Background Jobs", status: "operational", group: "Infrastructure" },
  { id: "sc-005", name: "Database", status: "operational", group: "Infrastructure" },
  { id: "sc-006", name: "Redis Cache", status: "operational", group: "Infrastructure" },
  { id: "sc-007", name: "CDN", status: "operational", group: "Infrastructure" },
  { id: "sc-008", name: "Email Service", status: "partial_outage", group: "Third Party" },
  { id: "sc-009", name: "Payment Processing", status: "operational", group: "Third Party" },
  { id: "sc-010", name: "Search Service", status: "operational", group: "Core Services" },
];

export interface StatusIncident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  impact: "none" | "minor" | "major" | "critical";
  createdAt: string;
  updatedAt: string;
  updates: Array<{ status: string; message: string; timestamp: string }>;
}

export const mockStatusIncidents: StatusIncident[] = [
  {
    id: "si-001", title: "Admin Panel Performance Degradation", status: "monitoring", impact: "minor", createdAt: "2026-03-08T12:00:00Z", updatedAt: "2026-03-08T14:00:00Z",
    updates: [
      { status: "monitoring", message: "Performance has improved. Continuing to monitor.", timestamp: "2026-03-08T14:00:00Z" },
      { status: "identified", message: "Root cause identified as database connection pool exhaustion.", timestamp: "2026-03-08T13:00:00Z" },
      { status: "investigating", message: "We are investigating reports of slow loading times on the admin panel.", timestamp: "2026-03-08T12:00:00Z" },
    ],
  },
  {
    id: "si-002", title: "Email Delivery Delays", status: "identified", impact: "minor", createdAt: "2026-03-08T10:00:00Z", updatedAt: "2026-03-08T13:30:00Z",
    updates: [
      { status: "identified", message: "Third-party email provider experiencing delays. ETA for resolution: 2 hours.", timestamp: "2026-03-08T13:30:00Z" },
      { status: "investigating", message: "Looking into reports of delayed email notifications.", timestamp: "2026-03-08T10:00:00Z" },
    ],
  },
];

// ============ Mock User ============
export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  organization: string;
}

export const mockCurrentUser: MockUser = {
  id: "user-001",
  name: "Sarah Chen",
  email: "sarah@example.com",
  avatar: "SC",
  role: "owner",
  organization: "Acme Corp",
};

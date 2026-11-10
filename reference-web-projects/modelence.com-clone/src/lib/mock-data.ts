export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
  environmentCount: number;
  region: string;
}

export interface Environment {
  id: string;
  projectId: string;
  name: string;
  type: "production" | "staging" | "sandbox" | "local";
  status: "running" | "stopped" | "deploying" | "error";
  url: string;
  createdAt: string;
  size: string;
  region: string;
}

export interface DatabaseCollection {
  id: string;
  name: string;
  documentCount: number;
  sizeBytes: number;
  indexCount: number;
  createdAt: string;
}

export interface DatabaseIndex {
  id: string;
  collectionName: string;
  name: string;
  fields: string[];
  unique: boolean;
  createdAt: string;
}

export interface Migration {
  id: string;
  name: string;
  status: "applied" | "pending" | "failed";
  appliedAt: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "suspended" | "pending";
  lastLogin: string;
  createdAt: string;
  provider: string;
}

export interface Session {
  id: string;
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export interface AuthProvider {
  id: string;
  name: string;
  type: "email" | "google" | "github" | "apple";
  enabled: boolean;
  userCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  service: string;
  environment: string;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  change: number;
  data: { time: string; value: number }[];
}

export interface Trace {
  id: string;
  name: string;
  duration: number;
  status: "ok" | "error";
  timestamp: string;
  spans: number;
  service: string;
}

export interface Alert {
  id: string;
  name: string;
  condition: string;
  status: "active" | "resolved" | "muted";
  severity: "critical" | "warning" | "info";
  lastTriggered: string | null;
  createdAt: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  handler: string;
  status: "active" | "paused" | "error";
  lastRun: string | null;
  nextRun: string;
  createdAt: string;
}

export interface AppConfig {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  environment: string;
  updatedAt: string;
}

export interface Secret {
  id: string;
  key: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  environment: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  projectName: string;
  environment: string;
  status: "success" | "failed" | "in_progress" | "queued";
  version: string;
  commitMessage: string;
  deployedBy: string;
  duration: number;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  permissions: string[];
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "invited";
  joinedAt: string;
  avatarUrl: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: "admin" | "member" | "viewer";
  invitedBy: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  resource: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  icon: string;
  configuredAt: string | null;
}

export interface StorageBucket {
  id: string;
  name: string;
  fileCount: number;
  sizeBytes: number;
  isPublic: boolean;
  createdAt: string;
}

export interface StorageFile {
  id: string;
  bucketId: string;
  name: string;
  path: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  url: string;
}

export interface EdgeFunction {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  invocations: number;
  avgDuration: number;
  status: "active" | "inactive";
  lastInvoked: string | null;
  createdAt: string;
}

export interface Query {
  id: string;
  name: string;
  type: "query" | "mutation";
  collection: string;
  executionCount: number;
  avgDuration: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  coverImage: string;
}

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  timezone: string;
  notifications: boolean;
  twoFactor: boolean;
  createdAt: string;
}

export interface BillingInfo {
  plan: string;
  status: "active" | "past_due" | "canceled";
  currentPeriodEnd: string;
  usage: { category: string; used: number; limit: number; unit: string }[];
  invoices: { id: string; date: string; amount: number; status: "paid" | "pending" | "failed" }[];
}

export interface Domain {
  id: string;
  domain: string;
  status: "active" | "pending" | "error";
  ssl: boolean;
  createdAt: string;
  environment: string;
}

export interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  email: boolean;
  inApp: boolean;
  slack: boolean;
}

// ---- MOCK DATA GENERATORS ----

const now = new Date();
const ago = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();
const future = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

export const mockProjects: Project[] = [
  { id: "p1", name: "E-Commerce Platform", slug: "ecommerce", description: "Main e-commerce application", status: "active", createdAt: ago(90), updatedAt: ago(1), environmentCount: 3, region: "us-east-1" },
  { id: "p2", name: "Blog Engine", slug: "blog-engine", description: "Content management system", status: "active", createdAt: ago(60), updatedAt: ago(2), environmentCount: 2, region: "eu-west-1" },
  { id: "p3", name: "Analytics Dashboard", slug: "analytics", description: "Real-time analytics service", status: "active", createdAt: ago(30), updatedAt: ago(0), environmentCount: 2, region: "us-west-2" },
  { id: "p4", name: "Legacy API", slug: "legacy-api", description: "Deprecated API service", status: "archived", createdAt: ago(180), updatedAt: ago(45), environmentCount: 1, region: "us-east-1" },
];

export const mockEnvironments: Environment[] = [
  { id: "e1", projectId: "p1", name: "Production", type: "production", status: "running", url: "https://ecommerce.example.com", createdAt: ago(90), size: "Medium", region: "us-east-1" },
  { id: "e2", projectId: "p1", name: "Staging", type: "staging", status: "running", url: "https://staging.ecommerce.example.com", createdAt: ago(85), size: "Small", region: "us-east-1" },
  { id: "e3", projectId: "p1", name: "Dev Sandbox", type: "sandbox", status: "stopped", url: "https://dev.ecommerce.example.com", createdAt: ago(30), size: "Micro", region: "us-east-1" },
  { id: "e4", projectId: "p2", name: "Production", type: "production", status: "running", url: "https://blog.example.com", createdAt: ago(60), size: "Small", region: "eu-west-1" },
  { id: "e5", projectId: "p2", name: "Staging", type: "staging", status: "deploying", url: "https://staging.blog.example.com", createdAt: ago(55), size: "Micro", region: "eu-west-1" },
  { id: "e6", projectId: "p3", name: "Production", type: "production", status: "running", url: "https://analytics.example.com", createdAt: ago(30), size: "Large", region: "us-west-2" },
  { id: "e7", projectId: "p3", name: "Staging", type: "staging", status: "running", url: "https://staging.analytics.example.com", createdAt: ago(28), size: "Small", region: "us-west-2" },
];

export const mockCollections: DatabaseCollection[] = [
  { id: "c1", name: "users", documentCount: 15420, sizeBytes: 52428800, indexCount: 4, createdAt: ago(90) },
  { id: "c2", name: "orders", documentCount: 89300, sizeBytes: 209715200, indexCount: 6, createdAt: ago(88) },
  { id: "c3", name: "products", documentCount: 3200, sizeBytes: 15728640, indexCount: 3, createdAt: ago(87) },
  { id: "c4", name: "sessions", documentCount: 45000, sizeBytes: 31457280, indexCount: 2, createdAt: ago(85) },
  { id: "c5", name: "analytics_events", documentCount: 1250000, sizeBytes: 1073741824, indexCount: 5, createdAt: ago(60) },
  { id: "c6", name: "notifications", documentCount: 28000, sizeBytes: 10485760, indexCount: 2, createdAt: ago(45) },
];

export const mockIndexes: DatabaseIndex[] = [
  { id: "i1", collectionName: "users", name: "email_unique", fields: ["email"], unique: true, createdAt: ago(90) },
  { id: "i2", collectionName: "users", name: "created_at_idx", fields: ["createdAt"], unique: false, createdAt: ago(90) },
  { id: "i3", collectionName: "orders", name: "user_id_idx", fields: ["userId"], unique: false, createdAt: ago(88) },
  { id: "i4", collectionName: "orders", name: "status_created", fields: ["status", "createdAt"], unique: false, createdAt: ago(88) },
  { id: "i5", collectionName: "products", name: "slug_unique", fields: ["slug"], unique: true, createdAt: ago(87) },
  { id: "i6", collectionName: "analytics_events", name: "timestamp_idx", fields: ["timestamp"], unique: false, createdAt: ago(60) },
];

export const mockMigrations: Migration[] = [
  { id: "m1", name: "001_create_users", status: "applied", appliedAt: ago(90), createdAt: ago(91) },
  { id: "m2", name: "002_create_orders", status: "applied", appliedAt: ago(88), createdAt: ago(89) },
  { id: "m3", name: "003_add_user_roles", status: "applied", appliedAt: ago(60), createdAt: ago(61) },
  { id: "m4", name: "004_create_analytics", status: "applied", appliedAt: ago(30), createdAt: ago(31) },
  { id: "m5", name: "005_add_notifications", status: "pending", appliedAt: null, createdAt: ago(1) },
];

export const mockAuthUsers: AuthUser[] = [
  { id: "u1", email: "admin@example.com", name: "Admin User", role: "admin", status: "active", lastLogin: ago(0), createdAt: ago(90), provider: "email" },
  { id: "u2", email: "john@example.com", name: "John Smith", role: "member", status: "active", lastLogin: ago(1), createdAt: ago(60), provider: "google" },
  { id: "u3", email: "jane@example.com", name: "Jane Doe", role: "member", status: "active", lastLogin: ago(3), createdAt: ago(45), provider: "github" },
  { id: "u4", email: "bob@example.com", name: "Bob Wilson", role: "viewer", status: "suspended", lastLogin: ago(30), createdAt: ago(30), provider: "email" },
  { id: "u5", email: "alice@example.com", name: "Alice Brown", role: "member", status: "active", lastLogin: ago(0), createdAt: ago(20), provider: "email" },
  { id: "u6", email: "charlie@example.com", name: "Charlie Davis", role: "admin", status: "active", lastLogin: ago(2), createdAt: ago(15), provider: "google" },
  { id: "u7", email: "diana@example.com", name: "Diana Evans", role: "member", status: "pending", lastLogin: ago(10), createdAt: ago(5), provider: "email" },
];

export const mockSessions: Session[] = [
  { id: "s1", userId: "u1", userEmail: "admin@example.com", ipAddress: "192.168.1.1", userAgent: "Chrome/120", createdAt: ago(0), expiresAt: future(7), active: true },
  { id: "s2", userId: "u2", userEmail: "john@example.com", ipAddress: "10.0.0.15", userAgent: "Firefox/121", createdAt: ago(1), expiresAt: future(6), active: true },
  { id: "s3", userId: "u3", userEmail: "jane@example.com", ipAddress: "172.16.0.5", userAgent: "Safari/17", createdAt: ago(3), expiresAt: future(4), active: false },
  { id: "s4", userId: "u5", userEmail: "alice@example.com", ipAddress: "192.168.2.10", userAgent: "Chrome/120", createdAt: ago(0), expiresAt: future(7), active: true },
];

export const mockRoles: Role[] = [
  { id: "r1", name: "admin", description: "Full access to all resources", permissions: ["read", "write", "delete", "manage_users", "manage_billing", "manage_settings"], userCount: 2, createdAt: ago(90) },
  { id: "r2", name: "member", description: "Standard access to project resources", permissions: ["read", "write"], userCount: 3, createdAt: ago(90) },
  { id: "r3", name: "viewer", description: "Read-only access to resources", permissions: ["read"], userCount: 1, createdAt: ago(90) },
  { id: "r4", name: "deployer", description: "Can deploy and manage environments", permissions: ["read", "deploy", "manage_environments"], userCount: 0, createdAt: ago(30) },
];

export const mockProviders: AuthProvider[] = [
  { id: "ap1", name: "Email & Password", type: "email", enabled: true, userCount: 4 },
  { id: "ap2", name: "Google", type: "google", enabled: true, userCount: 2 },
  { id: "ap3", name: "GitHub", type: "github", enabled: true, userCount: 1 },
  { id: "ap4", name: "Apple", type: "apple", enabled: false, userCount: 0 },
];

export const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, i) => ({
  id: `l${i + 1}`,
  timestamp: new Date(now.getTime() - i * 300000).toISOString(),
  level: (["info", "info", "warn", "error", "debug", "info", "info", "info", "warn", "info"] as const)[i % 10],
  message: [
    "Request processed successfully",
    "User authentication completed",
    "High memory usage detected",
    "Database connection timeout",
    "Cache invalidation triggered",
    "New deployment started",
    "Health check passed",
    "API rate limit approaching",
    "Slow query detected (>500ms)",
    "Background job completed",
  ][i % 10],
  service: ["api", "auth", "worker", "scheduler", "gateway"][i % 5],
  environment: ["production", "staging"][i % 2],
}));

export const mockMetrics: Metric[] = [
  { name: "Response Time", value: 23, unit: "ms", change: -12, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 20 + Math.random() * 15 })) },
  { name: "Requests/min", value: 1420, unit: "req/min", change: 8, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 1200 + Math.random() * 500 })) },
  { name: "Error Rate", value: 0.3, unit: "%", change: -5, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0.1 + Math.random() * 0.5 })) },
  { name: "CPU Usage", value: 42, unit: "%", change: 3, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 30 + Math.random() * 30 })) },
  { name: "Memory Usage", value: 68, unit: "%", change: 2, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 60 + Math.random() * 20 })) },
  { name: "Active Users", value: 234, unit: "users", change: 15, data: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 150 + Math.random() * 150 })) },
];

export const mockTraces: Trace[] = [
  { id: "t1", name: "GET /api/products", duration: 45, status: "ok", timestamp: ago(0), spans: 5, service: "api" },
  { id: "t2", name: "POST /api/orders", duration: 120, status: "ok", timestamp: ago(0), spans: 8, service: "api" },
  { id: "t3", name: "GET /api/users/:id", duration: 22, status: "ok", timestamp: ago(0), spans: 3, service: "auth" },
  { id: "t4", name: "POST /api/auth/login", duration: 350, status: "error", timestamp: ago(0), spans: 6, service: "auth" },
  { id: "t5", name: "PUT /api/products/:id", duration: 88, status: "ok", timestamp: ago(0), spans: 4, service: "api" },
  { id: "t6", name: "DELETE /api/sessions/:id", duration: 15, status: "ok", timestamp: ago(0), spans: 2, service: "auth" },
];

export const mockAlerts: Alert[] = [
  { id: "a1", name: "High Error Rate", condition: "error_rate > 5%", status: "active", severity: "critical", lastTriggered: ago(0), createdAt: ago(60) },
  { id: "a2", name: "High Response Time", condition: "avg_response_time > 500ms", status: "resolved", severity: "warning", lastTriggered: ago(5), createdAt: ago(45) },
  { id: "a3", name: "Memory Usage Alert", condition: "memory_usage > 85%", status: "muted", severity: "warning", lastTriggered: ago(2), createdAt: ago(30) },
  { id: "a4", name: "Database Connection Pool", condition: "connection_pool_usage > 90%", status: "active", severity: "critical", lastTriggered: ago(1), createdAt: ago(20) },
  { id: "a5", name: "Disk Space Low", condition: "disk_usage > 80%", status: "resolved", severity: "info", lastTriggered: ago(10), createdAt: ago(15) },
];

export const mockCronJobs: CronJob[] = [
  { id: "cj1", name: "Daily Report", schedule: "0 0 * * *", handler: "reports/daily", status: "active", lastRun: ago(0), nextRun: future(1), createdAt: ago(60) },
  { id: "cj2", name: "Cleanup Sessions", schedule: "0 */6 * * *", handler: "auth/cleanupSessions", status: "active", lastRun: ago(0), nextRun: future(0.25), createdAt: ago(45) },
  { id: "cj3", name: "Sync Analytics", schedule: "*/15 * * * *", handler: "analytics/sync", status: "active", lastRun: ago(0), nextRun: future(0.01), createdAt: ago(30) },
  { id: "cj4", name: "Backup Database", schedule: "0 2 * * *", handler: "db/backup", status: "active", lastRun: ago(1), nextRun: future(0.5), createdAt: ago(90) },
  { id: "cj5", name: "Send Digest Email", schedule: "0 8 * * 1", handler: "email/weeklyDigest", status: "paused", lastRun: ago(7), nextRun: future(3), createdAt: ago(20) },
];

export const mockAppConfigs: AppConfig[] = [
  { id: "ac1", key: "app.name", value: "E-Commerce Platform", type: "string", environment: "all", updatedAt: ago(30) },
  { id: "ac2", key: "app.maxUploadSize", value: "10485760", type: "number", environment: "all", updatedAt: ago(15) },
  { id: "ac3", key: "app.maintenanceMode", value: "false", type: "boolean", environment: "production", updatedAt: ago(5) },
  { id: "ac4", key: "app.featureFlags", value: '{"newCheckout": true, "darkMode": false}', type: "json", environment: "staging", updatedAt: ago(1) },
  { id: "ac5", key: "app.rateLimit", value: "100", type: "number", environment: "production", updatedAt: ago(10) },
];

export const mockSecrets: Secret[] = [
  { id: "sec1", key: "DATABASE_URL", environment: "production", createdAt: ago(90), updatedAt: ago(10) },
  { id: "sec2", key: "JWT_SECRET", environment: "all", createdAt: ago(90), updatedAt: ago(45) },
  { id: "sec3", key: "STRIPE_SECRET_KEY", environment: "production", createdAt: ago(60), updatedAt: ago(30) },
  { id: "sec4", key: "SENDGRID_API_KEY", environment: "all", createdAt: ago(45), updatedAt: ago(20) },
  { id: "sec5", key: "AWS_ACCESS_KEY_ID", environment: "production", createdAt: ago(30), updatedAt: ago(15) },
  { id: "sec6", key: "REDIS_URL", environment: "all", createdAt: ago(20), updatedAt: ago(5) },
];

export const mockEnvVars: EnvVar[] = [
  { id: "ev1", key: "NODE_ENV", value: "production", environment: "production", updatedAt: ago(90) },
  { id: "ev2", key: "PORT", value: "3000", environment: "all", updatedAt: ago(90) },
  { id: "ev3", key: "LOG_LEVEL", value: "info", environment: "production", updatedAt: ago(30) },
  { id: "ev4", key: "LOG_LEVEL", value: "debug", environment: "staging", updatedAt: ago(30) },
  { id: "ev5", key: "CORS_ORIGIN", value: "https://ecommerce.example.com", environment: "production", updatedAt: ago(15) },
  { id: "ev6", key: "CACHE_TTL", value: "3600", environment: "all", updatedAt: ago(10) },
];

export const mockDeployments: Deployment[] = [
  { id: "d1", projectName: "E-Commerce Platform", environment: "production", status: "success", version: "v1.4.2", commitMessage: "Fix checkout flow validation", deployedBy: "admin@example.com", duration: 145, createdAt: ago(0) },
  { id: "d2", projectName: "E-Commerce Platform", environment: "staging", status: "success", version: "v1.4.3-rc1", commitMessage: "Add new payment provider", deployedBy: "john@example.com", duration: 132, createdAt: ago(0) },
  { id: "d3", projectName: "Blog Engine", environment: "production", status: "success", version: "v2.1.0", commitMessage: "Launch new editor", deployedBy: "jane@example.com", duration: 98, createdAt: ago(1) },
  { id: "d4", projectName: "Analytics Dashboard", environment: "production", status: "failed", version: "v0.8.5", commitMessage: "Update chart library", deployedBy: "admin@example.com", duration: 45, createdAt: ago(2) },
  { id: "d5", projectName: "E-Commerce Platform", environment: "production", status: "success", version: "v1.4.1", commitMessage: "Performance optimizations", deployedBy: "alice@example.com", duration: 160, createdAt: ago(3) },
  { id: "d6", projectName: "Blog Engine", environment: "staging", status: "in_progress", version: "v2.1.1-rc1", commitMessage: "Add SEO improvements", deployedBy: "john@example.com", duration: 0, createdAt: ago(0) },
];

export const mockApiKeys: ApiKey[] = [
  { id: "ak1", name: "Production API Key", prefix: "mk_prod_", permissions: ["read", "write"], lastUsed: ago(0), createdAt: ago(60), expiresAt: future(305) },
  { id: "ak2", name: "Staging API Key", prefix: "mk_stg_", permissions: ["read", "write"], lastUsed: ago(1), createdAt: ago(45), expiresAt: future(320) },
  { id: "ak3", name: "Read-only Key", prefix: "mk_ro_", permissions: ["read"], lastUsed: ago(5), createdAt: ago(30), expiresAt: null },
  { id: "ak4", name: "CI/CD Pipeline", prefix: "mk_ci_", permissions: ["read", "write", "deploy"], lastUsed: ago(0), createdAt: ago(20), expiresAt: future(345) },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "tm1", name: "Admin User", email: "admin@example.com", role: "owner", status: "active", joinedAt: ago(90), avatarUrl: "" },
  { id: "tm2", name: "John Smith", email: "john@example.com", role: "admin", status: "active", joinedAt: ago(60), avatarUrl: "" },
  { id: "tm3", name: "Jane Doe", email: "jane@example.com", role: "member", status: "active", joinedAt: ago(45), avatarUrl: "" },
  { id: "tm4", name: "Alice Brown", email: "alice@example.com", role: "member", status: "active", joinedAt: ago(20), avatarUrl: "" },
  { id: "tm5", name: "Bob Wilson", email: "bob@example.com", role: "viewer", status: "invited", joinedAt: ago(5), avatarUrl: "" },
];

export const mockInvitations: Invitation[] = [
  { id: "inv1", email: "newdev@example.com", role: "member", invitedBy: "admin@example.com", status: "pending", createdAt: ago(2), expiresAt: future(5) },
  { id: "inv2", email: "contractor@example.com", role: "viewer", invitedBy: "admin@example.com", status: "pending", createdAt: ago(1), expiresAt: future(6) },
  { id: "inv3", email: "old@example.com", role: "member", invitedBy: "john@example.com", status: "expired", createdAt: ago(30), expiresAt: ago(23) },
];

export const mockActivityLog: ActivityEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `act${i + 1}`,
  action: ["created", "updated", "deleted", "deployed", "configured", "invited"][i % 6],
  resource: ["project", "environment", "collection", "user", "deployment", "config"][i % 6],
  user: ["admin@example.com", "john@example.com", "jane@example.com"][i % 3],
  timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
  details: [
    "Created new project 'E-Commerce Platform'",
    "Updated environment variables for staging",
    "Removed deprecated collection 'temp_data'",
    "Deployed v1.4.2 to production",
    "Updated app configuration 'featureFlags'",
    "Invited newdev@example.com as member",
  ][i % 6],
}));

export const mockIntegrations: Integration[] = [
  { id: "int1", name: "Slack", description: "Send notifications to Slack channels", category: "Communication", enabled: true, icon: "💬", configuredAt: ago(30) },
  { id: "int2", name: "GitHub", description: "Connect repositories for CI/CD", category: "Development", enabled: true, icon: "🐙", configuredAt: ago(60) },
  { id: "int3", name: "Stripe", description: "Payment processing integration", category: "Payments", enabled: true, icon: "💳", configuredAt: ago(45) },
  { id: "int4", name: "SendGrid", description: "Transactional email service", category: "Communication", enabled: false, icon: "📧", configuredAt: null },
  { id: "int5", name: "Datadog", description: "External monitoring and APM", category: "Monitoring", enabled: false, icon: "📊", configuredAt: null },
  { id: "int6", name: "AWS S3", description: "Object storage for file uploads", category: "Storage", enabled: true, icon: "☁️", configuredAt: ago(20) },
  { id: "int7", name: "Redis", description: "In-memory caching layer", category: "Database", enabled: true, icon: "🔴", configuredAt: ago(15) },
  { id: "int8", name: "PagerDuty", description: "Incident management and alerting", category: "Monitoring", enabled: false, icon: "🚨", configuredAt: null },
];

export const mockStorageBuckets: StorageBucket[] = [
  { id: "sb1", name: "uploads", fileCount: 1250, sizeBytes: 524288000, isPublic: false, createdAt: ago(60) },
  { id: "sb2", name: "public-assets", fileCount: 340, sizeBytes: 104857600, isPublic: true, createdAt: ago(55) },
  { id: "sb3", name: "backups", fileCount: 90, sizeBytes: 2147483648, isPublic: false, createdAt: ago(45) },
  { id: "sb4", name: "thumbnails", fileCount: 3200, sizeBytes: 52428800, isPublic: true, createdAt: ago(30) },
];

export const mockStorageFiles: StorageFile[] = [
  { id: "sf1", bucketId: "sb1", name: "profile-photo.jpg", path: "/users/u1/profile-photo.jpg", sizeBytes: 245760, mimeType: "image/jpeg", uploadedAt: ago(5), url: "#" },
  { id: "sf2", bucketId: "sb1", name: "document.pdf", path: "/users/u2/document.pdf", sizeBytes: 1048576, mimeType: "application/pdf", uploadedAt: ago(3), url: "#" },
  { id: "sf3", bucketId: "sb2", name: "logo.svg", path: "/brand/logo.svg", sizeBytes: 8192, mimeType: "image/svg+xml", uploadedAt: ago(30), url: "#" },
  { id: "sf4", bucketId: "sb2", name: "hero-banner.png", path: "/images/hero-banner.png", sizeBytes: 2097152, mimeType: "image/png", uploadedAt: ago(15), url: "#" },
  { id: "sf5", bucketId: "sb3", name: "db-backup-2024-01.gz", path: "/backups/db-backup-2024-01.gz", sizeBytes: 536870912, mimeType: "application/gzip", uploadedAt: ago(30), url: "#" },
  { id: "sf6", bucketId: "sb4", name: "thumb-001.webp", path: "/products/thumb-001.webp", sizeBytes: 15360, mimeType: "image/webp", uploadedAt: ago(2), url: "#" },
];

export const mockFunctions: EdgeFunction[] = [
  { id: "fn1", name: "processPayment", endpoint: "/api/payments/process", method: "POST", invocations: 15420, avgDuration: 230, status: "active", lastInvoked: ago(0), createdAt: ago(60) },
  { id: "fn2", name: "sendEmail", endpoint: "/api/email/send", method: "POST", invocations: 8900, avgDuration: 180, status: "active", lastInvoked: ago(0), createdAt: ago(45) },
  { id: "fn3", name: "generateReport", endpoint: "/api/reports/generate", method: "POST", invocations: 340, avgDuration: 2500, status: "active", lastInvoked: ago(1), createdAt: ago(30) },
  { id: "fn4", name: "resizeImage", endpoint: "/api/images/resize", method: "POST", invocations: 22000, avgDuration: 450, status: "active", lastInvoked: ago(0), createdAt: ago(20) },
  { id: "fn5", name: "validateWebhook", endpoint: "/api/webhooks/validate", method: "POST", invocations: 5600, avgDuration: 15, status: "active", lastInvoked: ago(0), createdAt: ago(15) },
  { id: "fn6", name: "legacyHandler", endpoint: "/api/v1/legacy", method: "GET", invocations: 120, avgDuration: 90, status: "inactive", lastInvoked: ago(30), createdAt: ago(90) },
];

export const mockQueries: Query[] = [
  { id: "q1", name: "getUser", type: "query", collection: "users", executionCount: 45000, avgDuration: 12, createdAt: ago(90) },
  { id: "q2", name: "listOrders", type: "query", collection: "orders", executionCount: 32000, avgDuration: 35, createdAt: ago(88) },
  { id: "q3", name: "createOrder", type: "mutation", collection: "orders", executionCount: 8900, avgDuration: 45, createdAt: ago(85) },
  { id: "q4", name: "updateProduct", type: "mutation", collection: "products", executionCount: 1200, avgDuration: 28, createdAt: ago(80) },
  { id: "q5", name: "getAnalytics", type: "query", collection: "analytics_events", executionCount: 5600, avgDuration: 120, createdAt: ago(60) },
  { id: "q6", name: "deleteSession", type: "mutation", collection: "sessions", executionCount: 15000, avgDuration: 8, createdAt: ago(85) },
];

export const mockBlogPosts: BlogPost[] = [
  { id: "bp1", title: "Introducing Modelence Cloud", slug: "introducing-modelence-cloud", excerpt: "Today we're launching Modelence Cloud — the easiest way to deploy production-ready applications.", content: "Full blog post content here...", author: "Team Modelence", publishedAt: ago(30), readTime: 5, tags: ["announcement", "cloud"], coverImage: "" },
  { id: "bp2", title: "Building Authentication in 5 Minutes", slug: "building-auth-in-5-minutes", excerpt: "Learn how to set up a complete authentication system with user management, sessions, and roles.", content: "Full blog post content here...", author: "Team Modelence", publishedAt: ago(20), readTime: 8, tags: ["tutorial", "authentication"], coverImage: "" },
  { id: "bp3", title: "Database Best Practices with Modelence", slug: "database-best-practices", excerpt: "Discover the patterns and practices that make database management effortless.", content: "Full blog post content here...", author: "Team Modelence", publishedAt: ago(10), readTime: 10, tags: ["tutorial", "database"], coverImage: "" },
  { id: "bp4", title: "Monitoring Your Production App", slug: "monitoring-production-app", excerpt: "Set up comprehensive monitoring with logs, metrics, and traces from day one.", content: "Full blog post content here...", author: "Team Modelence", publishedAt: ago(5), readTime: 7, tags: ["guide", "monitoring"], coverImage: "" },
  { id: "bp5", title: "Scaling with Cron Jobs", slug: "scaling-with-cron-jobs", excerpt: "Automate recurring tasks with sub-second precision cron job scheduling.", content: "Full blog post content here...", author: "Team Modelence", publishedAt: ago(2), readTime: 6, tags: ["tutorial", "cron"], coverImage: "" },
];

export const mockDocSections: DocSection[] = [
  { id: "ds1", title: "Getting Started", slug: "getting-started", content: "Welcome to Modelence. This guide will help you set up your first project and deploy it to production.", category: "Introduction", order: 1 },
  { id: "ds2", title: "Installation", slug: "installation", content: "Install the Modelence CLI using npm: `npm install -g modelence`. Then run `modelence init` to create a new project.", category: "Introduction", order: 2 },
  { id: "ds3", title: "Authentication", slug: "authentication", content: "Modelence provides built-in authentication with support for email/password, OAuth providers, and session management.", category: "Features", order: 3 },
  { id: "ds4", title: "Database", slug: "database", content: "Define your schema using TypeScript types. Modelence handles connection pooling, migrations, and indexing.", category: "Features", order: 4 },
  { id: "ds5", title: "Monitoring", slug: "monitoring", content: "Logs, metrics, and traces are automatically collected. View them in the dashboard or export to external services.", category: "Features", order: 5 },
  { id: "ds6", title: "Deployment", slug: "deployment", content: "Deploy your application with `modelence deploy`. Each deployment creates an immutable snapshot of your application.", category: "Deployment", order: 6 },
  { id: "ds7", title: "Environment Variables", slug: "env-variables", content: "Manage environment-specific configuration values and secrets through the dashboard or CLI.", category: "Configuration", order: 7 },
  { id: "ds8", title: "Cron Jobs", slug: "cron-jobs", content: "Schedule recurring tasks with cron expressions. Modelence ensures sub-second precision across distributed instances.", category: "Features", order: 8 },
  { id: "ds9", title: "API Reference", slug: "api-reference", content: "Complete API reference for the Modelence SDK, CLI, and REST APIs.", category: "Reference", order: 9 },
  { id: "ds10", title: "Troubleshooting", slug: "troubleshooting", content: "Common issues and solutions for Modelence applications.", category: "Reference", order: 10 },
];

export const mockUserProfile: UserProfile = {
  id: "u1",
  name: "Admin User",
  email: "admin@example.com",
  avatarUrl: "",
  timezone: "America/New_York",
  notifications: true,
  twoFactor: false,
  createdAt: ago(90),
};

export const mockBillingInfo: BillingInfo = {
  plan: "Pay as you go",
  status: "active",
  currentPeriodEnd: future(15),
  usage: [
    { category: "Compute", used: 720, limit: 2000, unit: "hours" },
    { category: "Storage", used: 2.5, limit: 10, unit: "GB" },
    { category: "Bandwidth", used: 15, limit: 100, unit: "GB" },
    { category: "AI Builder", used: 8, limit: 20, unit: "USD" },
  ],
  invoices: [
    { id: "inv-001", date: ago(30), amount: 43, status: "paid" },
    { id: "inv-002", date: ago(60), amount: 38, status: "paid" },
    { id: "inv-003", date: ago(90), amount: 29, status: "paid" },
  ],
};

export const mockDomains: Domain[] = [
  { id: "dom1", domain: "ecommerce.example.com", status: "active", ssl: true, createdAt: ago(60), environment: "production" },
  { id: "dom2", domain: "staging.ecommerce.example.com", status: "active", ssl: true, createdAt: ago(55), environment: "staging" },
  { id: "dom3", domain: "blog.example.com", status: "active", ssl: true, createdAt: ago(45), environment: "production" },
  { id: "dom4", domain: "new-app.example.com", status: "pending", ssl: false, createdAt: ago(1), environment: "production" },
];

export const mockNotificationSettings: NotificationSetting[] = [
  { id: "ns1", type: "Deployment Status", description: "Notifications when deployments succeed or fail", email: true, inApp: true, slack: true },
  { id: "ns2", type: "Alert Triggered", description: "Notifications when monitoring alerts fire", email: true, inApp: true, slack: true },
  { id: "ns3", type: "Team Activity", description: "Notifications about team member changes", email: false, inApp: true, slack: false },
  { id: "ns4", type: "Billing", description: "Notifications about billing and usage", email: true, inApp: true, slack: false },
  { id: "ns5", type: "Security", description: "Notifications about security events", email: true, inApp: true, slack: true },
  { id: "ns6", type: "System Updates", description: "Notifications about platform updates", email: false, inApp: true, slack: false },
];

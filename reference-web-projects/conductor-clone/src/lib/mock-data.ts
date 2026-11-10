export interface Connection {
  id: string;
  endUserId: string;
  companyName: string;
  companyFile: string;
  status: "connected" | "disconnected" | "error" | "pending";
  qbVersion: string;
  lastSyncAt: string;
  createdAt: string;
  requestCount: number;
  errorCount: number;
}

export interface EndUser {
  id: string;
  email: string;
  companyName: string;
  connectionsCount: number;
  createdAt: string;
  lastActiveAt: string;
  status: "active" | "inactive";
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string;
  environment: "test" | "production";
  status: "active" | "revoked";
}

export interface RequestLog {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number;
  duration: number;
  endUserId: string;
  timestamp: string;
  objectType: string;
  action: "create" | "read" | "update" | "delete" | "list";
}

export interface ErrorLog {
  id: string;
  type: string;
  code: string;
  message: string;
  userFacingMessage: string;
  httpStatusCode: number;
  endUserId: string;
  timestamp: string;
  resolved: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  createdAt: string;
  lastTriggeredAt: string;
  successRate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;
  lastActiveAt: string;
  avatarUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  timestamp: string;
}

export interface SyncJob {
  id: string;
  connectionId: string;
  companyName: string;
  objectType: string;
  status: "running" | "completed" | "failed" | "queued";
  recordsProcessed: number;
  recordsTotal: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  connections: number;
  period: string;
}

export interface EnvironmentConfig {
  id: string;
  name: string;
  type: "production" | "staging" | "development";
  apiKeyPrefix: string;
  connectionsCount: number;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  messages: number;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "configured";
  description: string;
  icon: string;
}

// Mock data generators
export const mockConnections: Connection[] = [
  { id: "conn_001", endUserId: "end_usr_001", companyName: "Acme Construction", companyFile: "AcmeConstruction.QBW", status: "connected", qbVersion: "QuickBooks Enterprise 2024", lastSyncAt: "2026-03-08T10:30:00Z", createdAt: "2025-11-15T08:00:00Z", requestCount: 15420, errorCount: 3 },
  { id: "conn_002", endUserId: "end_usr_002", companyName: "BuildRight LLC", companyFile: "BuildRight.QBW", status: "connected", qbVersion: "QuickBooks Desktop Pro 2023", lastSyncAt: "2026-03-08T09:45:00Z", createdAt: "2025-12-01T14:30:00Z", requestCount: 8930, errorCount: 1 },
  { id: "conn_003", endUserId: "end_usr_003", companyName: "Metro Supply Co", companyFile: "MetroSupply.QBW", status: "error", qbVersion: "QuickBooks Enterprise 2024", lastSyncAt: "2026-03-07T16:20:00Z", createdAt: "2026-01-10T10:00:00Z", requestCount: 4210, errorCount: 12 },
  { id: "conn_004", endUserId: "end_usr_004", companyName: "Pacific Logistics", companyFile: "PacificLog.QBW", status: "connected", qbVersion: "QuickBooks Desktop Premier 2024", lastSyncAt: "2026-03-08T11:00:00Z", createdAt: "2026-01-20T09:00:00Z", requestCount: 22100, errorCount: 5 },
  { id: "conn_005", endUserId: "end_usr_005", companyName: "Summit Materials", companyFile: "SummitMat.QBW", status: "disconnected", qbVersion: "QuickBooks Enterprise 2023", lastSyncAt: "2026-03-05T08:30:00Z", createdAt: "2026-02-01T11:00:00Z", requestCount: 1890, errorCount: 0 },
  { id: "conn_006", endUserId: "end_usr_006", companyName: "Valley Contractors", companyFile: "ValleyContr.QBW", status: "connected", qbVersion: "QuickBooks Desktop Pro 2024", lastSyncAt: "2026-03-08T10:55:00Z", createdAt: "2026-02-10T13:00:00Z", requestCount: 6780, errorCount: 2 },
  { id: "conn_007", endUserId: "end_usr_007", companyName: "Riverdale Transport", companyFile: "Riverdale.QBW", status: "pending", qbVersion: "QuickBooks Enterprise 2024", lastSyncAt: "", createdAt: "2026-03-07T15:00:00Z", requestCount: 0, errorCount: 0 },
  { id: "conn_008", endUserId: "end_usr_008", companyName: "Ironworks Inc", companyFile: "Ironworks.QBW", status: "connected", qbVersion: "QuickBooks Desktop Premier 2023", lastSyncAt: "2026-03-08T08:20:00Z", createdAt: "2025-10-20T07:00:00Z", requestCount: 31200, errorCount: 8 },
];

export const mockEndUsers: EndUser[] = [
  { id: "end_usr_001", email: "admin@acmeconstruction.com", companyName: "Acme Construction", connectionsCount: 1, createdAt: "2025-11-15T08:00:00Z", lastActiveAt: "2026-03-08T10:30:00Z", status: "active" },
  { id: "end_usr_002", email: "john@buildright.com", companyName: "BuildRight LLC", connectionsCount: 1, createdAt: "2025-12-01T14:30:00Z", lastActiveAt: "2026-03-08T09:45:00Z", status: "active" },
  { id: "end_usr_003", email: "ops@metrosupply.co", companyName: "Metro Supply Co", connectionsCount: 1, createdAt: "2026-01-10T10:00:00Z", lastActiveAt: "2026-03-07T16:20:00Z", status: "active" },
  { id: "end_usr_004", email: "tech@pacificlogistics.com", companyName: "Pacific Logistics", connectionsCount: 2, createdAt: "2026-01-20T09:00:00Z", lastActiveAt: "2026-03-08T11:00:00Z", status: "active" },
  { id: "end_usr_005", email: "info@summitmaterials.com", companyName: "Summit Materials", connectionsCount: 1, createdAt: "2026-02-01T11:00:00Z", lastActiveAt: "2026-03-05T08:30:00Z", status: "inactive" },
  { id: "end_usr_006", email: "dev@valleycontractors.com", companyName: "Valley Contractors", connectionsCount: 1, createdAt: "2026-02-10T13:00:00Z", lastActiveAt: "2026-03-08T10:55:00Z", status: "active" },
];

export const mockApiKeys: ApiKey[] = [
  { id: "key_001", name: "Production API Key", prefix: "sk_live_abc1", createdAt: "2025-11-15T08:00:00Z", lastUsedAt: "2026-03-08T10:30:00Z", environment: "production", status: "active" },
  { id: "key_002", name: "Test API Key", prefix: "sk_test_xyz2", createdAt: "2025-11-15T08:00:00Z", lastUsedAt: "2026-03-08T09:00:00Z", environment: "test", status: "active" },
  { id: "key_003", name: "Old Production Key", prefix: "sk_live_old3", createdAt: "2025-06-01T08:00:00Z", lastUsedAt: "2025-10-15T14:00:00Z", environment: "production", status: "revoked" },
  { id: "key_004", name: "Staging Key", prefix: "sk_test_stg4", createdAt: "2026-01-05T08:00:00Z", lastUsedAt: "2026-03-07T16:00:00Z", environment: "test", status: "active" },
];

export const mockRequestLogs: RequestLog[] = Array.from({ length: 50 }, (_, i) => ({
  id: `req_${String(i + 1).padStart(3, "0")}`,
  method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
  endpoint: ["/invoices", "/customers", "/vendors", "/bills", "/payments", "/items", "/accounts"][Math.floor(Math.random() * 7)],
  statusCode: [200, 200, 200, 201, 400, 500][Math.floor(Math.random() * 6)],
  duration: Math.floor(Math.random() * 800) + 50,
  endUserId: `end_usr_${String(Math.floor(Math.random() * 6) + 1).padStart(3, "0")}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
  objectType: ["Invoice", "Customer", "Vendor", "Bill", "Payment", "Item"][Math.floor(Math.random() * 6)],
  action: (["create", "read", "update", "delete", "list"] as const)[Math.floor(Math.random() * 5)],
}));

export const mockErrorLogs: ErrorLog[] = [
  { id: "err_001", type: "INTEGRATION_CONNECTION_ERROR", code: "QBD_CONNECTION_ERROR", message: "Could not start QuickBooks.", userFacingMessage: "We could not connect to your QuickBooks Desktop because QuickBooks is closed.", httpStatusCode: 502, endUserId: "end_usr_003", timestamp: "2026-03-07T16:20:00Z", resolved: false },
  { id: "err_002", type: "VALIDATION_ERROR", code: "INVALID_FIELD", message: "Invalid customer ID provided.", userFacingMessage: "The customer ID you provided does not exist.", httpStatusCode: 400, endUserId: "end_usr_001", timestamp: "2026-03-07T14:10:00Z", resolved: true },
  { id: "err_003", type: "RATE_LIMIT_ERROR", code: "RATE_LIMITED", message: "Too many requests.", userFacingMessage: "Please slow down your requests.", httpStatusCode: 429, endUserId: "end_usr_004", timestamp: "2026-03-06T11:00:00Z", resolved: true },
  { id: "err_004", type: "INTEGRATION_CONNECTION_ERROR", code: "QBD_TIMEOUT", message: "QuickBooks Desktop timed out.", userFacingMessage: "The connection to QuickBooks timed out. Please ensure QuickBooks is running.", httpStatusCode: 504, endUserId: "end_usr_003", timestamp: "2026-03-07T15:50:00Z", resolved: false },
  { id: "err_005", type: "AUTHENTICATION_ERROR", code: "INVALID_API_KEY", message: "Invalid API key.", userFacingMessage: "Your API key is invalid or has been revoked.", httpStatusCode: 401, endUserId: "end_usr_005", timestamp: "2026-03-05T08:30:00Z", resolved: true },
];

export const mockWebhooks: WebhookConfig[] = [
  { id: "wh_001", url: "https://api.acme.com/webhooks/conductor", events: ["connection.created", "connection.updated", "sync.completed"], status: "active", createdAt: "2025-12-01T08:00:00Z", lastTriggeredAt: "2026-03-08T10:30:00Z", successRate: 99.2 },
  { id: "wh_002", url: "https://hooks.buildright.com/qb-sync", events: ["sync.completed", "sync.failed"], status: "active", createdAt: "2026-01-15T10:00:00Z", lastTriggeredAt: "2026-03-08T09:45:00Z", successRate: 97.5 },
  { id: "wh_003", url: "https://staging.example.com/test-webhook", events: ["connection.created"], status: "inactive", createdAt: "2026-02-20T14:00:00Z", lastTriggeredAt: "2026-02-25T16:00:00Z", successRate: 85.0 },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "tm_001", name: "Alex Chen", email: "alex@conductor.is", role: "owner", joinedAt: "2025-06-01T08:00:00Z", lastActiveAt: "2026-03-08T11:00:00Z" },
  { id: "tm_002", name: "Sarah Kim", email: "sarah@conductor.is", role: "admin", joinedAt: "2025-08-15T10:00:00Z", lastActiveAt: "2026-03-08T09:30:00Z" },
  { id: "tm_003", name: "James Wilson", email: "james@conductor.is", role: "member", joinedAt: "2025-11-01T09:00:00Z", lastActiveAt: "2026-03-07T17:00:00Z" },
  { id: "tm_004", name: "Emily Zhang", email: "emily@conductor.is", role: "member", joinedAt: "2026-01-10T08:00:00Z", lastActiveAt: "2026-03-08T10:45:00Z" },
  { id: "tm_005", name: "David Park", email: "david@conductor.is", role: "viewer", joinedAt: "2026-02-20T14:00:00Z", lastActiveAt: "2026-03-06T16:00:00Z" },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: "al_001", action: "api_key.created", actor: "alex@conductor.is", resource: "API Key: Production API Key", details: "Created new production API key", timestamp: "2026-03-08T10:00:00Z", ipAddress: "192.168.1.1" },
  { id: "al_002", action: "connection.created", actor: "system", resource: "Connection: Acme Construction", details: "New connection established", timestamp: "2026-03-07T15:30:00Z", ipAddress: "10.0.0.1" },
  { id: "al_003", action: "team.member_invited", actor: "alex@conductor.is", resource: "Team Member: david@conductor.is", details: "Invited as viewer", timestamp: "2026-02-20T14:00:00Z", ipAddress: "192.168.1.1" },
  { id: "al_004", action: "webhook.updated", actor: "sarah@conductor.is", resource: "Webhook: api.acme.com", details: "Updated webhook events", timestamp: "2026-03-06T11:00:00Z", ipAddress: "192.168.1.2" },
  { id: "al_005", action: "api_key.revoked", actor: "alex@conductor.is", resource: "API Key: Old Production Key", details: "Revoked old production key", timestamp: "2025-10-15T14:00:00Z", ipAddress: "192.168.1.1" },
  { id: "al_006", action: "settings.updated", actor: "alex@conductor.is", resource: "Organization Settings", details: "Updated organization name", timestamp: "2026-03-05T09:00:00Z", ipAddress: "192.168.1.1" },
  { id: "al_007", action: "connection.deleted", actor: "sarah@conductor.is", resource: "Connection: OldCo Inc", details: "Removed inactive connection", timestamp: "2026-03-04T16:00:00Z", ipAddress: "192.168.1.2" },
];

export const mockNotifications: NotificationItem[] = [
  { id: "notif_001", title: "Connection Error", message: "Metro Supply Co connection has encountered an error.", type: "error", read: false, timestamp: "2026-03-07T16:20:00Z" },
  { id: "notif_002", title: "New Connection", message: "Riverdale Transport has initiated a connection.", type: "info", read: false, timestamp: "2026-03-07T15:00:00Z" },
  { id: "notif_003", title: "Sync Completed", message: "All connections synced successfully.", type: "success", read: true, timestamp: "2026-03-07T12:00:00Z" },
  { id: "notif_004", title: "Usage Alert", message: "You've reached 80% of your monthly API quota.", type: "warning", read: true, timestamp: "2026-03-06T09:00:00Z" },
  { id: "notif_005", title: "Team Update", message: "David Park joined as viewer.", type: "info", read: true, timestamp: "2026-02-20T14:00:00Z" },
];

export const mockSyncJobs: SyncJob[] = [
  { id: "sync_001", connectionId: "conn_001", companyName: "Acme Construction", objectType: "Invoice", status: "completed", recordsProcessed: 150, recordsTotal: 150, startedAt: "2026-03-08T10:00:00Z", completedAt: "2026-03-08T10:05:00Z" },
  { id: "sync_002", connectionId: "conn_002", companyName: "BuildRight LLC", objectType: "Customer", status: "running", recordsProcessed: 45, recordsTotal: 120, startedAt: "2026-03-08T10:30:00Z" },
  { id: "sync_003", connectionId: "conn_003", companyName: "Metro Supply Co", objectType: "Vendor", status: "failed", recordsProcessed: 10, recordsTotal: 80, startedAt: "2026-03-07T16:00:00Z", completedAt: "2026-03-07T16:02:00Z", errorMessage: "Connection timed out" },
  { id: "sync_004", connectionId: "conn_004", companyName: "Pacific Logistics", objectType: "Bill", status: "queued", recordsProcessed: 0, recordsTotal: 200, startedAt: "2026-03-08T11:00:00Z" },
  { id: "sync_005", connectionId: "conn_006", companyName: "Valley Contractors", objectType: "Payment", status: "completed", recordsProcessed: 75, recordsTotal: 75, startedAt: "2026-03-08T09:00:00Z", completedAt: "2026-03-08T09:03:00Z" },
];

export const mockBillingInvoices: BillingInvoice[] = [
  { id: "inv_001", date: "2026-03-01", amount: 294, status: "pending", connections: 6, period: "March 2026" },
  { id: "inv_002", date: "2026-02-01", amount: 245, status: "paid", connections: 5, period: "February 2026" },
  { id: "inv_003", date: "2026-01-01", amount: 196, status: "paid", connections: 4, period: "January 2026" },
  { id: "inv_004", date: "2025-12-01", amount: 147, status: "paid", connections: 3, period: "December 2025" },
  { id: "inv_005", date: "2025-11-01", amount: 98, status: "paid", connections: 2, period: "November 2025" },
];

export const mockEnvironments: EnvironmentConfig[] = [
  { id: "env_001", name: "Production", type: "production", apiKeyPrefix: "sk_live_", connectionsCount: 6, createdAt: "2025-06-01T08:00:00Z" },
  { id: "env_002", name: "Staging", type: "staging", apiKeyPrefix: "sk_test_", connectionsCount: 2, createdAt: "2025-06-01T08:00:00Z" },
  { id: "env_003", name: "Development", type: "development", apiKeyPrefix: "sk_dev_", connectionsCount: 1, createdAt: "2025-06-01T08:00:00Z" },
];

export const mockSupportTickets: SupportTicket[] = [
  { id: "tkt_001", subject: "Connection keeps dropping for Metro Supply", status: "open", priority: "high", createdAt: "2026-03-07T16:30:00Z", updatedAt: "2026-03-08T09:00:00Z", messages: 4 },
  { id: "tkt_002", subject: "How to set up multi-company file sync?", status: "resolved", priority: "medium", createdAt: "2026-03-05T10:00:00Z", updatedAt: "2026-03-06T14:00:00Z", messages: 6 },
  { id: "tkt_003", subject: "API rate limiting questions", status: "closed", priority: "low", createdAt: "2026-02-28T08:00:00Z", updatedAt: "2026-03-01T11:00:00Z", messages: 3 },
  { id: "tkt_004", subject: "Invoice creation failing with error 400", status: "in_progress", priority: "urgent", createdAt: "2026-03-08T08:00:00Z", updatedAt: "2026-03-08T10:00:00Z", messages: 2 },
];

export const mockIntegrations: IntegrationConfig[] = [
  { id: "int_001", name: "QuickBooks Desktop", type: "accounting", status: "active", description: "Sync with QuickBooks Desktop Pro, Premier, and Enterprise.", icon: "BookOpen" },
  { id: "int_002", name: "QuickBooks Enterprise", type: "accounting", status: "active", description: "Advanced features for QuickBooks Enterprise users.", icon: "Building" },
  { id: "int_003", name: "Slack", type: "notification", status: "configured", description: "Receive real-time notifications in your Slack channels.", icon: "MessageSquare" },
  { id: "int_004", name: "Zapier", type: "automation", status: "inactive", description: "Connect to 5,000+ apps with Zapier automation.", icon: "Zap" },
  { id: "int_005", name: "PagerDuty", type: "monitoring", status: "inactive", description: "Alert on-call engineers when critical errors occur.", icon: "AlertCircle" },
  { id: "int_006", name: "Datadog", type: "monitoring", status: "inactive", description: "Send metrics and logs to Datadog for monitoring.", icon: "BarChart" },
];

// Dashboard stats
export const mockDashboardStats = {
  totalConnections: 8,
  activeConnections: 5,
  totalRequests: 90530,
  requestsToday: 3240,
  errorRate: 0.8,
  avgResponseTime: 245,
  endUsers: 6,
  syncJobsToday: 12,
};

// Usage chart data
export const mockUsageData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0],
  requests: Math.floor(Math.random() * 2000) + 1000,
  errors: Math.floor(Math.random() * 30) + 2,
}));

// Object type stats
export const mockObjectStats = [
  { type: "Invoice", count: 12450, lastSync: "2026-03-08T10:30:00Z" },
  { type: "Customer", count: 3200, lastSync: "2026-03-08T10:30:00Z" },
  { type: "Vendor", count: 890, lastSync: "2026-03-08T09:00:00Z" },
  { type: "Bill", count: 8900, lastSync: "2026-03-08T10:00:00Z" },
  { type: "Payment", count: 6700, lastSync: "2026-03-08T09:30:00Z" },
  { type: "Item", count: 4500, lastSync: "2026-03-08T08:00:00Z" },
  { type: "Account", count: 250, lastSync: "2026-03-07T18:00:00Z" },
  { type: "Employee", count: 180, lastSync: "2026-03-07T18:00:00Z" },
  { type: "SalesReceipt", count: 2100, lastSync: "2026-03-08T10:00:00Z" },
  { type: "CreditMemo", count: 340, lastSync: "2026-03-08T09:00:00Z" },
];

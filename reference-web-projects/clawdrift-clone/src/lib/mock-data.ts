import { generateId } from "./calculations";

export interface Bot {
  id: string;
  name: string;
  description: string;
  modelId: string;
  platformId: string;
  status: "active" | "inactive" | "deploying" | "error";
  persona: string;
  messagesTotal: number;
  messagesThisMonth: number;
  createdAt: string;
  lastActive: string;
}

export interface Deployment {
  id: string;
  botId: string;
  botName: string;
  platform: string;
  status: "running" | "stopped" | "deploying" | "failed";
  region: string;
  uptime: number;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

export interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastTriggered: string;
  successRate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar: string;
  joinedAt: string;
  lastActive: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  botId: string;
  botName: string;
  platform: string;
  userName: string;
  lastMessage: string;
  messageCount: number;
  startedAt: string;
  lastMessageAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  persona: string;
  model: string;
  usageCount: number;
  rating: number;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  type: "document" | "url" | "text" | "faq";
  content: string;
  botIds: string[];
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  botId: string;
  botName: string;
  schedule: string;
  action: string;
  status: "active" | "paused" | "completed";
  lastRun: string;
  nextRun: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  messages: { sender: string; content: string; timestamp: string }[];
}

export interface Channel {
  id: string;
  platform: string;
  name: string;
  botId: string;
  botName: string;
  status: "connected" | "disconnected" | "error";
  connectedAt: string;
  messagesCount: number;
}

export interface BillingInfo {
  plan: string;
  nextBillingDate: string;
  amount: number;
  paymentMethod: string;
  invoices: { id: string; date: string; amount: number; status: string }[];
}

export interface UserSettings {
  notifications: { email: boolean; push: boolean; slack: boolean };
  timezone: string;
  language: string;
  twoFactor: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected";
  category: string;
}

export interface UsageData {
  date: string;
  messages: number;
  tokens: number;
  cost: number;
}

export interface AnalyticsData {
  totalMessages: number;
  totalConversations: number;
  avgResponseTime: number;
  satisfactionRate: number;
  messagesByDay: { date: string; count: number }[];
  messagesByPlatform: { platform: string; count: number }[];
  topBots: { name: string; messages: number }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  source: string;
  message: string;
  metadata?: Record<string, string>;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  createdAt: string;
}

// --- Generators ---

const now = new Date();
function daysAgo(d: number): string {
  return new Date(now.getTime() - d * 86400000).toISOString();
}
function hoursAgo(h: number): string {
  return new Date(now.getTime() - h * 3600000).toISOString();
}
function minutesAgo(m: number): string {
  return new Date(now.getTime() - m * 60000).toISOString();
}
function daysFromNow(d: number): string {
  return new Date(now.getTime() + d * 86400000).toISOString();
}

export const mockUser: MockUser = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@clawdrift.com",
  avatar: "AJ",
  plan: "pro",
  createdAt: daysAgo(120),
};

export const mockBots: Bot[] = [
  { id: "bot-1", name: "Support Agent", description: "Customer support bot for handling tickets and inquiries", modelId: "claude-4", platformId: "telegram", status: "active", persona: "Professional and helpful customer support agent", messagesTotal: 15420, messagesThisMonth: 2340, createdAt: daysAgo(90), lastActive: minutesAgo(5) },
  { id: "bot-2", name: "Sales Assistant", description: "Automated sales qualification and lead nurturing bot", modelId: "gpt-4o", platformId: "discord", status: "active", persona: "Friendly sales representative who qualifies leads", messagesTotal: 8930, messagesThisMonth: 1250, createdAt: daysAgo(60), lastActive: minutesAgo(12) },
  { id: "bot-3", name: "Content Writer", description: "AI content creation assistant for blog posts and social media", modelId: "claude-3.5", platformId: "whatsapp", status: "active", persona: "Creative content writer with SEO expertise", messagesTotal: 5670, messagesThisMonth: 890, createdAt: daysAgo(45), lastActive: hoursAgo(2) },
  { id: "bot-4", name: "HR Onboarding", description: "New employee onboarding assistant", modelId: "gemini-pro", platformId: "telegram", status: "inactive", persona: "Welcoming HR assistant for new employees", messagesTotal: 3200, messagesThisMonth: 0, createdAt: daysAgo(30), lastActive: daysAgo(5) },
  { id: "bot-5", name: "DevOps Monitor", description: "Infrastructure monitoring and alert bot", modelId: "gpt-4-turbo", platformId: "discord", status: "active", persona: "Technical DevOps engineer monitoring systems", messagesTotal: 22100, messagesThisMonth: 4500, createdAt: daysAgo(120), lastActive: minutesAgo(1) },
  { id: "bot-6", name: "Meeting Scheduler", description: "Automated meeting scheduling and reminders", modelId: "gemini-flash", platformId: "whatsapp", status: "deploying", persona: "Efficient scheduling assistant", messagesTotal: 1800, messagesThisMonth: 320, createdAt: daysAgo(15), lastActive: hoursAgo(6) },
];

export const mockDeployments: Deployment[] = [
  { id: "dep-1", botId: "bot-1", botName: "Support Agent", platform: "telegram", status: "running", region: "us-east-1", uptime: 99.9, createdAt: daysAgo(90) },
  { id: "dep-2", botId: "bot-2", botName: "Sales Assistant", platform: "discord", status: "running", region: "eu-west-1", uptime: 99.7, createdAt: daysAgo(60) },
  { id: "dep-3", botId: "bot-3", botName: "Content Writer", platform: "whatsapp", status: "running", region: "us-west-2", uptime: 98.5, createdAt: daysAgo(45) },
  { id: "dep-4", botId: "bot-5", botName: "DevOps Monitor", platform: "discord", status: "running", region: "ap-south-1", uptime: 99.99, createdAt: daysAgo(120) },
  { id: "dep-5", botId: "bot-6", botName: "Meeting Scheduler", platform: "whatsapp", status: "deploying", region: "us-east-1", uptime: 0, createdAt: minutesAgo(10) },
];

export const mockApiKeys: ApiKey[] = [
  { id: "key-1", name: "Production API Key", key: "cd_live_sk_xxxxxxxxxxxx", createdAt: daysAgo(90), lastUsed: minutesAgo(30), permissions: ["read", "write", "deploy"] },
  { id: "key-2", name: "Development Key", key: "cd_test_sk_xxxxxxxxxxxx", createdAt: daysAgo(60), lastUsed: hoursAgo(4), permissions: ["read", "write"] },
  { id: "key-3", name: "Read-Only Key", key: "cd_ro_sk_xxxxxxxxxxxx", createdAt: daysAgo(30), lastUsed: daysAgo(2), permissions: ["read"] },
];

export const mockWebhooks: WebhookEntry[] = [
  { id: "wh-1", url: "https://api.myapp.com/webhooks/clawdrift", events: ["message.received", "message.sent"], status: "active", lastTriggered: minutesAgo(15), successRate: 99.2 },
  { id: "wh-2", url: "https://slack.com/api/webhooks/abc123", events: ["bot.deployed", "bot.stopped", "error"], status: "active", lastTriggered: hoursAgo(2), successRate: 97.8 },
  { id: "wh-3", url: "https://analytics.internal/events", events: ["message.received"], status: "inactive", lastTriggered: daysAgo(10), successRate: 85.0 },
];

export const mockTeam: TeamMember[] = [
  { id: "tm-1", name: "Alex Johnson", email: "alex@clawdrift.com", role: "owner", avatar: "AJ", joinedAt: daysAgo(120), lastActive: minutesAgo(5) },
  { id: "tm-2", name: "Sarah Chen", email: "sarah@clawdrift.com", role: "admin", avatar: "SC", joinedAt: daysAgo(90), lastActive: hoursAgo(1) },
  { id: "tm-3", name: "Mike Ross", email: "mike@clawdrift.com", role: "member", avatar: "MR", joinedAt: daysAgo(60), lastActive: hoursAgo(3) },
  { id: "tm-4", name: "Emma Wilson", email: "emma@clawdrift.com", role: "member", avatar: "EW", joinedAt: daysAgo(30), lastActive: daysAgo(1) },
  { id: "tm-5", name: "David Kim", email: "david@clawdrift.com", role: "viewer", avatar: "DK", joinedAt: daysAgo(15), lastActive: daysAgo(3) },
];

export const mockNotifications: Notification[] = [
  { id: "n-1", title: "Bot Deployed", message: "Support Agent has been successfully deployed to Telegram.", type: "success", read: false, createdAt: minutesAgo(10) },
  { id: "n-2", title: "High Usage Alert", message: "You've used 80% of your monthly message quota.", type: "warning", read: false, createdAt: hoursAgo(2) },
  { id: "n-3", title: "Webhook Failed", message: "Webhook to analytics.internal/events failed 3 times.", type: "error", read: true, createdAt: hoursAgo(6) },
  { id: "n-4", title: "New Team Member", message: "David Kim joined your team as a viewer.", type: "info", read: true, createdAt: daysAgo(3) },
  { id: "n-5", title: "System Update", message: "ClawDrift v2.1 is now available with new features.", type: "info", read: true, createdAt: daysAgo(7) },
];

export const mockConversations: Conversation[] = [
  { id: "conv-1", botId: "bot-1", botName: "Support Agent", platform: "telegram", userName: "John Doe", lastMessage: "Thanks for the help! That resolved my issue.", messageCount: 12, startedAt: hoursAgo(3), lastMessageAt: minutesAgo(20) },
  { id: "conv-2", botId: "bot-1", botName: "Support Agent", platform: "telegram", userName: "Jane Smith", lastMessage: "Can you check on my order status?", messageCount: 5, startedAt: hoursAgo(1), lastMessageAt: minutesAgo(45) },
  { id: "conv-3", botId: "bot-2", botName: "Sales Assistant", platform: "discord", userName: "Bob Wilson", lastMessage: "I'd like to schedule a demo.", messageCount: 8, startedAt: daysAgo(1), lastMessageAt: hoursAgo(4) },
  { id: "conv-4", botId: "bot-3", botName: "Content Writer", platform: "whatsapp", userName: "Alice Brown", lastMessage: "Please write a blog post about AI trends.", messageCount: 15, startedAt: daysAgo(2), lastMessageAt: hoursAgo(6) },
  { id: "conv-5", botId: "bot-5", botName: "DevOps Monitor", platform: "discord", userName: "System", lastMessage: "CPU usage normalized. Alert resolved.", messageCount: 3, startedAt: hoursAgo(2), lastMessageAt: hoursAgo(1) },
];

export const mockTemplates: Template[] = [
  { id: "tpl-1", name: "Customer Support", description: "Professional customer support agent with ticket management", category: "Support", persona: "Helpful and patient support agent", model: "claude-4", usageCount: 1250, rating: 4.8 },
  { id: "tpl-2", name: "Sales Qualifier", description: "Lead qualification and nurturing assistant", category: "Sales", persona: "Friendly sales professional", model: "gpt-4o", usageCount: 890, rating: 4.6 },
  { id: "tpl-3", name: "Content Creator", description: "Blog and social media content generation", category: "Marketing", persona: "Creative writer with SEO skills", model: "claude-3.5", usageCount: 670, rating: 4.7 },
  { id: "tpl-4", name: "Code Reviewer", description: "Automated code review and suggestions", category: "Engineering", persona: "Senior software engineer", model: "gpt-4-turbo", usageCount: 450, rating: 4.5 },
  { id: "tpl-5", name: "Meeting Assistant", description: "Meeting scheduling, notes, and follow-ups", category: "Productivity", persona: "Efficient executive assistant", model: "gemini-flash", usageCount: 320, rating: 4.4 },
  { id: "tpl-6", name: "HR Helper", description: "Employee onboarding and HR FAQ bot", category: "HR", persona: "Welcoming HR representative", model: "gemini-pro", usageCount: 210, rating: 4.3 },
  { id: "tpl-7", name: "Data Analyst", description: "Data analysis and report generation", category: "Analytics", persona: "Detail-oriented data analyst", model: "gpt-4o", usageCount: 180, rating: 4.6 },
  { id: "tpl-8", name: "Legal Advisor", description: "Legal document review and compliance", category: "Legal", persona: "Professional legal advisor", model: "claude-4", usageCount: 150, rating: 4.2 },
];

export const mockKnowledgeBase: KnowledgeBaseItem[] = [
  { id: "kb-1", title: "Product Documentation", type: "document", content: "Complete product docs covering all features...", botIds: ["bot-1", "bot-2"], size: 245000, createdAt: daysAgo(60), updatedAt: daysAgo(2) },
  { id: "kb-2", title: "FAQ Database", type: "faq", content: "Frequently asked questions and answers...", botIds: ["bot-1"], size: 52000, createdAt: daysAgo(45), updatedAt: daysAgo(5) },
  { id: "kb-3", title: "Company Website", type: "url", content: "https://example.com", botIds: ["bot-1", "bot-2", "bot-3"], size: 180000, createdAt: daysAgo(30), updatedAt: daysAgo(10) },
  { id: "kb-4", title: "Sales Playbook", type: "document", content: "Sales strategies and objection handling...", botIds: ["bot-2"], size: 98000, createdAt: daysAgo(20), updatedAt: daysAgo(3) },
  { id: "kb-5", title: "Brand Guidelines", type: "text", content: "Brand voice, tone, and style guidelines...", botIds: ["bot-3"], size: 15000, createdAt: daysAgo(15), updatedAt: daysAgo(7) },
];

export const mockScheduledTasks: ScheduledTask[] = [
  { id: "st-1", name: "Daily Digest", botId: "bot-1", botName: "Support Agent", schedule: "0 9 * * *", action: "Send daily support ticket summary", status: "active", lastRun: hoursAgo(15), nextRun: daysFromNow(1) },
  { id: "st-2", name: "Weekly Report", botId: "bot-5", botName: "DevOps Monitor", schedule: "0 8 * * 1", action: "Generate weekly infrastructure report", status: "active", lastRun: daysAgo(5), nextRun: daysFromNow(2) },
  { id: "st-3", name: "Lead Follow-up", botId: "bot-2", botName: "Sales Assistant", schedule: "0 10 * * *", action: "Follow up with inactive leads", status: "active", lastRun: hoursAgo(23), nextRun: daysFromNow(1) },
  { id: "st-4", name: "Content Calendar", botId: "bot-3", botName: "Content Writer", schedule: "0 7 * * 1,3,5", action: "Suggest content topics for the week", status: "paused", lastRun: daysAgo(10), nextRun: daysFromNow(3) },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: "al-1", action: "bot.created", actor: "Alex Johnson", target: "Meeting Scheduler", details: "Created new bot with Gemini Flash model", timestamp: daysAgo(15), ip: "192.168.1.1" },
  { id: "al-2", action: "bot.deployed", actor: "Sarah Chen", target: "Support Agent", details: "Deployed to Telegram in us-east-1", timestamp: daysAgo(10), ip: "10.0.0.5" },
  { id: "al-3", action: "team.member_added", actor: "Alex Johnson", target: "David Kim", details: "Added as viewer role", timestamp: daysAgo(7), ip: "192.168.1.1" },
  { id: "al-4", action: "api_key.created", actor: "Mike Ross", target: "Read-Only Key", details: "Created API key with read permissions", timestamp: daysAgo(5), ip: "172.16.0.3" },
  { id: "al-5", action: "webhook.updated", actor: "Sarah Chen", target: "Slack Webhook", details: "Added error event to webhook", timestamp: daysAgo(3), ip: "10.0.0.5" },
  { id: "al-6", action: "bot.settings_updated", actor: "Alex Johnson", target: "Content Writer", details: "Updated persona and model settings", timestamp: daysAgo(2), ip: "192.168.1.1" },
  { id: "al-7", action: "deployment.restarted", actor: "Mike Ross", target: "DevOps Monitor", details: "Restarted deployment due to high memory", timestamp: daysAgo(1), ip: "172.16.0.3" },
  { id: "al-8", action: "billing.plan_upgraded", actor: "Alex Johnson", target: "Pro Plan", details: "Upgraded from Free to Pro plan", timestamp: hoursAgo(12), ip: "192.168.1.1" },
];

export const mockSupportTickets: SupportTicket[] = [
  { id: "ticket-1", subject: "Bot not responding on Telegram", description: "My Support Agent bot stopped responding to messages on Telegram.", status: "open", priority: "high", createdAt: hoursAgo(3), updatedAt: hoursAgo(1), messages: [{ sender: "Alex Johnson", content: "My bot stopped responding.", timestamp: hoursAgo(3) }, { sender: "Support Team", content: "We're looking into this. Can you share your bot ID?", timestamp: hoursAgo(1) }] },
  { id: "ticket-2", subject: "How to add custom knowledge base", description: "I want to add my company wiki as a knowledge source.", status: "resolved", priority: "medium", createdAt: daysAgo(5), updatedAt: daysAgo(4), messages: [{ sender: "Alex Johnson", content: "How do I add my wiki?", timestamp: daysAgo(5) }, { sender: "Support Team", content: "Go to Knowledge Base > Add Source > URL.", timestamp: daysAgo(4) }] },
  { id: "ticket-3", subject: "Billing question about Team plan", description: "Do unused messages roll over to the next month?", status: "closed", priority: "low", createdAt: daysAgo(10), updatedAt: daysAgo(8), messages: [{ sender: "Alex Johnson", content: "Do messages roll over?", timestamp: daysAgo(10) }, { sender: "Support Team", content: "Messages do not roll over.", timestamp: daysAgo(8) }] },
];

export const mockChannels: Channel[] = [
  { id: "ch-1", platform: "telegram", name: "@support_bot", botId: "bot-1", botName: "Support Agent", status: "connected", connectedAt: daysAgo(90), messagesCount: 15420 },
  { id: "ch-2", platform: "discord", name: "#sales-bot", botId: "bot-2", botName: "Sales Assistant", status: "connected", connectedAt: daysAgo(60), messagesCount: 8930 },
  { id: "ch-3", platform: "whatsapp", name: "+1 555-0123", botId: "bot-3", botName: "Content Writer", status: "connected", connectedAt: daysAgo(45), messagesCount: 5670 },
  { id: "ch-4", platform: "discord", name: "#devops-alerts", botId: "bot-5", botName: "DevOps Monitor", status: "connected", connectedAt: daysAgo(120), messagesCount: 22100 },
  { id: "ch-5", platform: "whatsapp", name: "+1 555-0456", botId: "bot-6", botName: "Meeting Scheduler", status: "disconnected", connectedAt: daysAgo(15), messagesCount: 1800 },
];

export const mockBilling: BillingInfo = {
  plan: "Pro",
  nextBillingDate: daysFromNow(22),
  amount: 29,
  paymentMethod: "Visa •••• 4242",
  invoices: [
    { id: "inv-1", date: daysAgo(30), amount: 29, status: "paid" },
    { id: "inv-2", date: daysAgo(60), amount: 29, status: "paid" },
    { id: "inv-3", date: daysAgo(90), amount: 0, status: "paid" },
  ],
};

export const mockSettings: UserSettings = {
  notifications: { email: true, push: true, slack: false },
  timezone: "America/New_York",
  language: "en",
  twoFactor: false,
};

export const mockIntegrations: Integration[] = [
  { id: "int-1", name: "Slack", description: "Send notifications and alerts to Slack channels", icon: "💬", status: "connected", category: "Communication" },
  { id: "int-2", name: "GitHub", description: "Connect repositories for code review bots", icon: "🐙", status: "connected", category: "Development" },
  { id: "int-3", name: "Jira", description: "Create and manage Jira tickets from bots", icon: "📋", status: "disconnected", category: "Project Management" },
  { id: "int-4", name: "Notion", description: "Sync knowledge base with Notion pages", icon: "📝", status: "disconnected", category: "Productivity" },
  { id: "int-5", name: "Zapier", description: "Connect with 5000+ apps through Zapier", icon: "⚡", status: "connected", category: "Automation" },
  { id: "int-6", name: "Google Calendar", description: "Sync schedules and meetings", icon: "📅", status: "disconnected", category: "Productivity" },
  { id: "int-7", name: "Stripe", description: "Process payments and manage subscriptions", icon: "💳", status: "connected", category: "Finance" },
  { id: "int-8", name: "HubSpot", description: "CRM integration for sales bots", icon: "🔶", status: "disconnected", category: "CRM" },
];

export function generateUsageData(days: number): UsageData[] {
  const data: UsageData[] = [];
  for (let i = days; i >= 0; i--) {
    const base = 150 + Math.floor(Math.random() * 200);
    data.push({
      date: new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10),
      messages: base,
      tokens: base * 450,
      cost: Math.round(base * 0.003 * 100) / 100,
    });
  }
  return data;
}

export function generateAnalyticsData(): AnalyticsData {
  const messagesByDay = [];
  for (let i = 29; i >= 0; i--) {
    messagesByDay.push({
      date: new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10),
      count: 100 + Math.floor(Math.random() * 300),
    });
  }
  return {
    totalMessages: 56120,
    totalConversations: 4230,
    avgResponseTime: 1.8,
    satisfactionRate: 94.5,
    messagesByDay,
    messagesByPlatform: [
      { platform: "Telegram", count: 25400 },
      { platform: "Discord", count: 19800 },
      { platform: "WhatsApp", count: 10920 },
    ],
    topBots: [
      { name: "DevOps Monitor", messages: 22100 },
      { name: "Support Agent", messages: 15420 },
      { name: "Sales Assistant", messages: 8930 },
      { name: "Content Writer", messages: 5670 },
    ],
  };
}

export function generateLogs(count: number): LogEntry[] {
  const levels: LogEntry["level"][] = ["info", "warn", "error", "debug"];
  const sources = ["bot-1", "bot-2", "bot-3", "bot-5", "system", "api"];
  const messages = [
    "Message processed successfully",
    "Webhook delivered",
    "Rate limit approaching",
    "Connection timeout - retrying",
    "Model response generated",
    "User session started",
    "Authentication token refreshed",
    "Deployment health check passed",
    "Memory usage above threshold",
    "API request completed",
  ];
  const logs: LogEntry[] = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      id: generateId(),
      timestamp: new Date(now.getTime() - i * 120000).toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  }
  return logs;
}

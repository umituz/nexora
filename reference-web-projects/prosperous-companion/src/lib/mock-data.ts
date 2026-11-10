import { generateId } from "./calculations";

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  linkedinAccountId: string;
  linkedinAccountName: string;
  leadsCount: number;
  sentCount: number;
  repliedCount: number;
  acceptedCount: number;
  dailyLimit: number;
  createdAt: string;
  updatedAt: string;
  sequenceSteps: SequenceStep[];
  tags: string[];
}

export interface SequenceStep {
  id: string;
  type: "send_connection" | "send_message" | "send_email" | "send_voice_note" | "view_profile" | "like_post" | "endorse_skill" | "wait";
  content?: string;
  delayDays: number;
  order: number;
  aiEnabled: boolean;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedinUrl: string;
  company: string;
  title: string;
  location: string;
  industry: string;
  status: "new" | "contacted" | "replied" | "interested" | "not_interested" | "converted";
  campaignId?: string;
  tags: string[];
  notes: string;
  avatar: string;
  createdAt: string;
  lastContactedAt?: string;
  phone?: string;
  website?: string;
  companySize?: string;
  enriched: boolean;
}

export interface InboxMessage {
  id: string;
  leadId: string;
  leadName: string;
  leadAvatar: string;
  leadTitle: string;
  linkedinAccountId: string;
  linkedinAccountName: string;
  messages: ChatMessage[];
  unread: boolean;
  starred: boolean;
  archived: boolean;
  lastMessageAt: string;
  campaignId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "lead";
  timestamp: string;
  type: "text" | "voice_note" | "connection_request";
}

export interface AITemplate {
  id: string;
  name: string;
  category: "connection_request" | "follow_up" | "introduction" | "pitch" | "thank_you";
  content: string;
  variables: string[];
  usageCount: number;
  replyRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceNote {
  id: string;
  name: string;
  duration: number;
  url: string;
  campaignId?: string;
  usageCount: number;
  createdAt: string;
}

export interface LinkedInAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "connected" | "disconnected" | "warming_up" | "limited";
  dailyLimit: number;
  usedToday: number;
  proxyId?: string;
  connectedAt: string;
  lastActiveAt: string;
  connectionCount: number;
  pendingInvites: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar: string;
  linkedinAccounts: string[];
  lastActiveAt: string;
  joinedAt: string;
  status: "active" | "invited" | "disabled";
}

export interface Proxy {
  id: string;
  name: string;
  host: string;
  port: number;
  type: "residential" | "datacenter" | "custom";
  country: string;
  status: "active" | "inactive" | "error";
  linkedinAccountId?: string;
  linkedinAccountName?: string;
  createdAt: string;
}

export interface Integration {
  id: string;
  name: string;
  type: "crm" | "email" | "zapier" | "webhook" | "csv" | "google_sheets";
  icon: string;
  status: "connected" | "disconnected";
  description: string;
  lastSyncAt?: string;
  config?: Record<string, string>;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  active: boolean;
}

export interface BlacklistEntry {
  id: string;
  type: "email" | "domain" | "company" | "linkedin_url";
  value: string;
  reason: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt: string;
}

export interface ExportJob {
  id: string;
  name: string;
  type: "leads" | "campaigns" | "analytics" | "inbox";
  status: "pending" | "processing" | "completed" | "failed";
  format: "csv" | "xlsx" | "json";
  recordCount: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetType: "campaign" | "lead" | "account" | "team" | "settings" | "integration";
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface UserSettings {
  id: string;
  name: string;
  email: string;
  avatar: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  twoFactorEnabled: boolean;
}

export interface BillingInfo {
  plan: "free" | "monthly" | "annual";
  pricePerAccount: number;
  totalAccounts: number;
  nextBillingDate: string;
  paymentMethod: string;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
}

export interface AnalyticsData {
  totalLeads: number;
  totalCampaigns: number;
  totalSent: number;
  totalReplies: number;
  totalAccepted: number;
  totalConverted: number;
  replyRate: number;
  acceptanceRate: number;
  conversionRate: number;
  dailyStats: DailyStat[];
  campaignPerformance: CampaignPerformance[];
  topPerformingTemplates: TemplatePerformance[];
}

export interface DailyStat {
  date: string;
  sent: number;
  replies: number;
  accepted: number;
  connections: number;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  sent: number;
  replies: number;
  replyRate: number;
}

export interface TemplatePerformance {
  templateId: string;
  templateName: string;
  usageCount: number;
  replyRate: number;
}

// ---- Mock Data Generators ----

const names = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Jessica Williams",
  "Robert Brown", "Amanda Davis", "Christopher Wilson", "Laura Martinez", "James Taylor",
  "Olivia Anderson", "Daniel Thomas", "Sophia Jackson", "Matthew White", "Isabella Harris",
  "Andrew Clark", "Emma Lewis", "Joshua Robinson", "Mia Walker", "Ethan Hall",
  "Ava Young", "Ryan Allen", "Charlotte King", "Nathan Wright", "Grace Lopez",
  "Tyler Hill", "Lily Scott", "Brandon Green", "Chloe Adams", "Justin Baker",
];

const companies = [
  "Google", "Microsoft", "Apple", "Amazon", "Meta", "Salesforce", "HubSpot",
  "Stripe", "Shopify", "Slack", "Zoom", "Notion", "Figma", "Vercel",
  "Datadog", "Snowflake", "Twilio", "Atlassian", "Dropbox", "Square",
];

const titles = [
  "CEO", "CTO", "VP of Sales", "Head of Marketing", "Product Manager",
  "Engineering Lead", "Sales Director", "Growth Manager", "CMO", "COO",
  "Head of BD", "Director of Engineering", "VP of Product", "Founder",
  "Revenue Operations", "Account Executive", "SDR Manager", "Head of Partnerships",
];

const locations = [
  "San Francisco, CA", "New York, NY", "London, UK", "Austin, TX", "Seattle, WA",
  "Toronto, CA", "Berlin, DE", "Paris, FR", "Boston, MA", "Chicago, IL",
  "Los Angeles, CA", "Miami, FL", "Denver, CO", "Amsterdam, NL", "Singapore",
];

const industries = [
  "SaaS", "FinTech", "HealthTech", "E-commerce", "AI/ML", "Cybersecurity",
  "EdTech", "MarTech", "Real Estate", "Consulting", "Recruitment", "Media",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  return d.toISOString();
}

function splitName(full: string): [string, string] {
  const parts = full.split(" ");
  return [parts[0], parts.slice(1).join(" ")];
}

export function generateMockCampaigns(count = 12): Campaign[] {
  const campaignNames = [
    "Q1 SaaS Founders Outreach", "FinTech Decision Makers", "Series A Startup CTOs",
    "Enterprise Sales Leaders", "Marketing Agency Owners", "Tech Recruiters Network",
    "AI Startup Founders", "E-commerce Growth Leads", "VP Sales Engagement",
    "Product Managers Connect", "DevOps Leaders Campaign", "Healthcare Innovation",
  ];
  return Array.from({ length: count }, (_, i) => {
    const sent = Math.floor(Math.random() * 500) + 50;
    return {
      id: generateId(),
      name: campaignNames[i % campaignNames.length],
      status: randomItem(["draft", "active", "active", "active", "paused", "completed"] as const),
      linkedinAccountId: `acc-${i % 3}`,
      linkedinAccountName: randomItem(names),
      leadsCount: Math.floor(Math.random() * 300) + 50,
      sentCount: sent,
      repliedCount: Math.floor(sent * (Math.random() * 0.3 + 0.05)),
      acceptedCount: Math.floor(sent * (Math.random() * 0.4 + 0.1)),
      dailyLimit: randomItem([25, 50, 75, 100]),
      createdAt: randomDate(90),
      updatedAt: randomDate(14),
      tags: [randomItem(["outbound", "inbound", "referral", "cold", "warm"])],
      sequenceSteps: [
        { id: generateId(), type: "view_profile", delayDays: 0, order: 0, aiEnabled: false },
        { id: generateId(), type: "send_connection", content: "Hi {{firstName}}, I noticed we're both in {{industry}}. Would love to connect!", delayDays: 0, order: 1, aiEnabled: true },
        { id: generateId(), type: "wait", delayDays: 3, order: 2, aiEnabled: false },
        { id: generateId(), type: "send_message", content: "Thanks for connecting, {{firstName}}! I'd love to learn more about what you're building at {{company}}.", delayDays: 0, order: 3, aiEnabled: true },
        { id: generateId(), type: "wait", delayDays: 5, order: 4, aiEnabled: false },
        { id: generateId(), type: "send_message", content: "Hi {{firstName}}, just following up on my previous message. Would you be open to a quick chat?", delayDays: 0, order: 5, aiEnabled: true },
      ],
    };
  });
}

export function generateMockLeads(count = 60): Lead[] {
  return Array.from({ length: count }, () => {
    const name = randomItem(names);
    const [firstName, lastName] = splitName(name);
    const company = randomItem(companies);
    return {
      id: generateId(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      company,
      title: randomItem(titles),
      location: randomItem(locations),
      industry: randomItem(industries),
      status: randomItem(["new", "contacted", "replied", "interested", "not_interested", "converted"] as const),
      tags: [randomItem(["hot", "warm", "cold", "priority", "follow-up"])],
      notes: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      createdAt: randomDate(60),
      lastContactedAt: Math.random() > 0.3 ? randomDate(14) : undefined,
      phone: Math.random() > 0.5 ? `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      website: Math.random() > 0.6 ? `https://${company.toLowerCase()}.com` : undefined,
      companySize: randomItem(["1-10", "11-50", "51-200", "201-500", "500+"]),
      enriched: Math.random() > 0.3,
    };
  });
}

export function generateMockInboxMessages(count = 20): InboxMessage[] {
  return Array.from({ length: count }, () => {
    const name = randomItem(names);
    const [firstName, lastName] = splitName(name);
    const msgCount = Math.floor(Math.random() * 6) + 1;
    return {
      id: generateId(),
      leadId: generateId(),
      leadName: name,
      leadAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      leadTitle: `${randomItem(titles)} at ${randomItem(companies)}`,
      linkedinAccountId: `acc-${Math.floor(Math.random() * 3)}`,
      linkedinAccountName: randomItem(names),
      messages: Array.from({ length: msgCount }, (_, j) => ({
        id: generateId(),
        content: j % 2 === 0
          ? randomItem(["Hi! Thanks for reaching out.", "I'd be happy to chat.", "Could you tell me more?", "Let's schedule a call.", "Interesting, tell me more about your solution."])
          : randomItem(["Thanks for connecting!", "Would love to discuss further.", "Are you available for a quick call this week?", "Great to hear from you!"]),
        sender: (j % 2 === 0 ? "lead" : "user") as "lead" | "user",
        timestamp: randomDate(14 - j),
        type: "text" as const,
      })),
      unread: Math.random() > 0.5,
      starred: Math.random() > 0.7,
      archived: false,
      lastMessageAt: randomDate(3),
    };
  });
}

export function generateMockAITemplates(): AITemplate[] {
  return [
    { id: generateId(), name: "Professional Introduction", category: "introduction", content: "Hi {{firstName}}, I came across your profile and was impressed by your work at {{company}}. As a fellow {{industry}} professional, I'd love to connect and exchange ideas.", variables: ["firstName", "company", "industry"], usageCount: 342, replyRate: 28.5, createdAt: randomDate(90), updatedAt: randomDate(7) },
    { id: generateId(), name: "Mutual Connection", category: "connection_request", content: "Hey {{firstName}}! I noticed we both know {{mutualConnection}}. Would love to connect and learn more about what you're doing at {{company}}.", variables: ["firstName", "mutualConnection", "company"], usageCount: 256, replyRate: 35.2, createdAt: randomDate(60), updatedAt: randomDate(14) },
    { id: generateId(), name: "Value Proposition", category: "pitch", content: "Hi {{firstName}}, I help {{title}}s like you at {{company}} achieve {{benefit}}. Would you be open to a quick 15-min chat to see if we could help?", variables: ["firstName", "title", "company", "benefit"], usageCount: 189, replyRate: 22.1, createdAt: randomDate(45), updatedAt: randomDate(5) },
    { id: generateId(), name: "Follow-up Nudge", category: "follow_up", content: "Hi {{firstName}}, just wanted to follow up on my previous message. I understand you're busy — happy to work around your schedule if you're interested in a quick chat.", variables: ["firstName"], usageCount: 412, replyRate: 18.7, createdAt: randomDate(120), updatedAt: randomDate(3) },
    { id: generateId(), name: "Thank You Note", category: "thank_you", content: "Thanks for accepting my connection, {{firstName}}! I've been following {{company}}'s growth and would love to hear your perspective on {{topic}}.", variables: ["firstName", "company", "topic"], usageCount: 167, replyRate: 42.3, createdAt: randomDate(30), updatedAt: randomDate(10) },
    { id: generateId(), name: "Event Follow-up", category: "follow_up", content: "Hi {{firstName}}, great meeting you at {{event}}! I really enjoyed our conversation about {{topic}}. Would love to continue the discussion.", variables: ["firstName", "event", "topic"], usageCount: 89, replyRate: 45.1, createdAt: randomDate(20), updatedAt: randomDate(2) },
  ];
}

export function generateMockVoiceNotes(): VoiceNote[] {
  return [
    { id: generateId(), name: "Warm Introduction", duration: 15, url: "#", usageCount: 45, createdAt: randomDate(30) },
    { id: generateId(), name: "Quick Follow-up", duration: 10, url: "#", usageCount: 78, createdAt: randomDate(20) },
    { id: generateId(), name: "Product Demo Request", duration: 20, url: "#", usageCount: 32, createdAt: randomDate(15) },
    { id: generateId(), name: "Thank You Message", duration: 12, url: "#", usageCount: 56, createdAt: randomDate(10) },
    { id: generateId(), name: "Meeting Scheduler", duration: 18, url: "#", usageCount: 23, createdAt: randomDate(5) },
  ];
}

export function generateMockLinkedInAccounts(): LinkedInAccount[] {
  return [
    { id: "acc-0", name: "John Smith", email: "john@company.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnSmith", status: "connected", dailyLimit: 100, usedToday: 67, proxyId: "proxy-0", connectedAt: randomDate(120), lastActiveAt: randomDate(0), connectionCount: 2340, pendingInvites: 45 },
    { id: "acc-1", name: "Sarah Miller", email: "sarah@company.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahMiller", status: "connected", dailyLimit: 75, usedToday: 23, proxyId: "proxy-1", connectedAt: randomDate(90), lastActiveAt: randomDate(0), connectionCount: 1890, pendingInvites: 32 },
    { id: "acc-2", name: "Alex Turner", email: "alex@company.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexTurner", status: "warming_up", dailyLimit: 25, usedToday: 12, proxyId: "proxy-2", connectedAt: randomDate(7), lastActiveAt: randomDate(0), connectionCount: 456, pendingInvites: 8 },
  ];
}

export function generateMockTeamMembers(): TeamMember[] {
  return [
    { id: generateId(), name: "You (Admin)", email: "admin@company.com", role: "owner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin", linkedinAccounts: ["acc-0", "acc-1", "acc-2"], lastActiveAt: new Date().toISOString(), joinedAt: randomDate(180), status: "active" },
    { id: generateId(), name: "Jane Cooper", email: "jane@company.com", role: "admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JaneCooper", linkedinAccounts: ["acc-1"], lastActiveAt: randomDate(1), joinedAt: randomDate(120), status: "active" },
    { id: generateId(), name: "Tom Harris", email: "tom@company.com", role: "member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TomHarris", linkedinAccounts: ["acc-2"], lastActiveAt: randomDate(3), joinedAt: randomDate(60), status: "active" },
    { id: generateId(), name: "Lisa Wang", email: "lisa@company.com", role: "viewer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LisaWang", linkedinAccounts: [], lastActiveAt: randomDate(7), joinedAt: randomDate(30), status: "invited" },
  ];
}

export function generateMockProxies(): Proxy[] {
  return [
    { id: "proxy-0", name: "US Residential 1", host: "us-proxy-1.prosp.ai", port: 8080, type: "residential", country: "United States", status: "active", linkedinAccountId: "acc-0", linkedinAccountName: "John Smith", createdAt: randomDate(120) },
    { id: "proxy-1", name: "UK Residential 1", host: "uk-proxy-1.prosp.ai", port: 8080, type: "residential", country: "United Kingdom", status: "active", linkedinAccountId: "acc-1", linkedinAccountName: "Sarah Miller", createdAt: randomDate(90) },
    { id: "proxy-2", name: "US Residential 2", host: "us-proxy-2.prosp.ai", port: 8080, type: "residential", country: "United States", status: "active", linkedinAccountId: "acc-2", linkedinAccountName: "Alex Turner", createdAt: randomDate(7) },
    { id: "proxy-3", name: "DE Datacenter 1", host: "de-proxy-1.prosp.ai", port: 8080, type: "datacenter", country: "Germany", status: "inactive", createdAt: randomDate(60) },
  ];
}

export function generateMockIntegrations(): Integration[] {
  return [
    { id: generateId(), name: "HubSpot", type: "crm", icon: "hubspot", status: "connected", description: "Sync leads and activities with HubSpot CRM", lastSyncAt: randomDate(0) },
    { id: generateId(), name: "Salesforce", type: "crm", icon: "salesforce", status: "disconnected", description: "Connect your Salesforce CRM to sync contacts" },
    { id: generateId(), name: "Zapier", type: "zapier", icon: "zapier", status: "connected", description: "Automate workflows with 5000+ apps", lastSyncAt: randomDate(1) },
    { id: generateId(), name: "Google Sheets", type: "google_sheets", icon: "sheets", status: "connected", description: "Export and import leads from Google Sheets", lastSyncAt: randomDate(2) },
    { id: generateId(), name: "Gmail", type: "email", icon: "gmail", status: "disconnected", description: "Send email sequences through Gmail" },
    { id: generateId(), name: "CSV Import", type: "csv", icon: "csv", status: "connected", description: "Import leads from CSV files" },
  ];
}

export function generateMockWebhooks(): WebhookConfig[] {
  return [
    { id: generateId(), name: "New Reply Notification", url: "https://hooks.example.com/reply", events: ["message.received", "reply.detected"], active: true, secret: "whsec_****", createdAt: randomDate(60), lastTriggeredAt: randomDate(1), failureCount: 0 },
    { id: generateId(), name: "Lead Status Change", url: "https://hooks.example.com/lead-status", events: ["lead.status_changed"], active: true, secret: "whsec_****", createdAt: randomDate(45), lastTriggeredAt: randomDate(3), failureCount: 2 },
    { id: generateId(), name: "Campaign Completed", url: "https://hooks.example.com/campaign", events: ["campaign.completed"], active: false, secret: "whsec_****", createdAt: randomDate(30), failureCount: 0 },
  ];
}

export function generateMockApiKeys(): ApiKey[] {
  return [
    { id: generateId(), name: "Production API Key", key: "pk_live_****************************", permissions: ["read", "write", "delete"], createdAt: randomDate(90), lastUsedAt: randomDate(0), active: true },
    { id: generateId(), name: "Development API Key", key: "pk_test_****************************", permissions: ["read", "write"], createdAt: randomDate(60), lastUsedAt: randomDate(7), active: true },
    { id: generateId(), name: "Read-only Key", key: "pk_ro_******************************", permissions: ["read"], createdAt: randomDate(30), active: false },
  ];
}

export function generateMockBlacklist(): BlacklistEntry[] {
  return [
    { id: generateId(), type: "domain", value: "competitor.com", reason: "Competitor company", createdAt: randomDate(60) },
    { id: generateId(), type: "email", value: "spam@example.com", reason: "Known spam", createdAt: randomDate(45) },
    { id: generateId(), type: "company", value: "Blocked Corp", reason: "Do not contact", createdAt: randomDate(30) },
    { id: generateId(), type: "linkedin_url", value: "linkedin.com/in/blocked-user", reason: "Requested removal", createdAt: randomDate(15) },
  ];
}

export function generateMockTags(): Tag[] {
  return [
    { id: generateId(), name: "Hot Lead", color: "#ef4444", count: 24, createdAt: randomDate(90) },
    { id: generateId(), name: "Warm Lead", color: "#f59e0b", count: 45, createdAt: randomDate(90) },
    { id: generateId(), name: "Cold Lead", color: "#3b82f6", count: 89, createdAt: randomDate(90) },
    { id: generateId(), name: "Priority", color: "#8b5cf6", count: 12, createdAt: randomDate(60) },
    { id: generateId(), name: "Follow-up", color: "#10b981", count: 34, createdAt: randomDate(45) },
    { id: generateId(), name: "Outbound", color: "#06b6d4", count: 67, createdAt: randomDate(30) },
    { id: generateId(), name: "Inbound", color: "#ec4899", count: 23, createdAt: randomDate(30) },
    { id: generateId(), name: "Enterprise", color: "#6366f1", count: 15, createdAt: randomDate(20) },
  ];
}

export function generateMockExports(): ExportJob[] {
  return [
    { id: generateId(), name: "All Leads Export", type: "leads", status: "completed", format: "csv", recordCount: 1250, createdAt: randomDate(7), completedAt: randomDate(7), downloadUrl: "#" },
    { id: generateId(), name: "Campaign Analytics Q1", type: "analytics", status: "completed", format: "xlsx", recordCount: 45, createdAt: randomDate(14), completedAt: randomDate(14), downloadUrl: "#" },
    { id: generateId(), name: "Inbox Messages Backup", type: "inbox", status: "processing", format: "json", recordCount: 890, createdAt: randomDate(0) },
    { id: generateId(), name: "Active Campaign Leads", type: "campaigns", status: "pending", format: "csv", recordCount: 0, createdAt: randomDate(0) },
  ];
}

export function generateMockActivityLog(): ActivityLogEntry[] {
  const actions = [
    { action: "Created campaign", target: "Q1 SaaS Founders Outreach", targetType: "campaign" as const, details: "New campaign created with 150 leads" },
    { action: "Updated lead status", target: "Sarah Johnson", targetType: "lead" as const, details: "Status changed from 'contacted' to 'replied'" },
    { action: "Connected LinkedIn account", target: "John Smith", targetType: "account" as const, details: "LinkedIn account successfully connected" },
    { action: "Invited team member", target: "Lisa Wang", targetType: "team" as const, details: "Invited as viewer role" },
    { action: "Updated settings", target: "Daily limits", targetType: "settings" as const, details: "Changed daily connection limit to 100" },
    { action: "Enabled integration", target: "HubSpot", targetType: "integration" as const, details: "CRM integration enabled and synced" },
    { action: "Paused campaign", target: "FinTech Decision Makers", targetType: "campaign" as const, details: "Campaign paused due to daily limit reached" },
    { action: "Exported leads", target: "All Leads Export", targetType: "lead" as const, details: "1,250 leads exported to CSV" },
    { action: "Added to blacklist", target: "competitor.com", targetType: "settings" as const, details: "Domain added to blacklist" },
    { action: "Created AI template", target: "Professional Introduction", targetType: "campaign" as const, details: "New AI template created" },
  ];
  return Array.from({ length: 30 }, (_, i) => {
    const a = actions[i % actions.length];
    return { id: generateId(), userId: "user-1", userName: randomItem(["You", "Jane Cooper", "Tom Harris"]), ...a, timestamp: randomDate(30 - i) };
  });
}

export function generateMockNotifications(): Notification[] {
  return [
    { id: generateId(), title: "New reply received", message: "Sarah Johnson replied to your message in Q1 SaaS Founders campaign", type: "success", read: false, actionUrl: "/inbox", createdAt: randomDate(0) },
    { id: generateId(), title: "Campaign completed", message: "FinTech Decision Makers campaign has finished running", type: "info", read: false, actionUrl: "/campaigns", createdAt: randomDate(1) },
    { id: generateId(), title: "Daily limit reached", message: "LinkedIn account John Smith has reached its daily limit", type: "warning", read: true, actionUrl: "/linkedin-accounts", createdAt: randomDate(1) },
    { id: generateId(), title: "Webhook failed", message: "Lead Status Change webhook failed 3 consecutive times", type: "error", read: true, actionUrl: "/webhooks", createdAt: randomDate(3) },
    { id: generateId(), title: "New team member joined", message: "Tom Harris has accepted the team invitation", type: "info", read: true, createdAt: randomDate(5) },
    { id: generateId(), title: "Integration synced", message: "HubSpot sync completed — 45 contacts updated", type: "success", read: true, actionUrl: "/integrations", createdAt: randomDate(7) },
  ];
}

export function generateMockSettings(): UserSettings {
  return {
    id: "user-1",
    name: "Admin User",
    email: "admin@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    timezone: "America/New_York",
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    twoFactorEnabled: false,
  };
}

export function generateMockBilling(): BillingInfo {
  return {
    plan: "monthly",
    pricePerAccount: 79,
    totalAccounts: 3,
    nextBillingDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    paymentMethod: "Visa ending in 4242",
    invoices: [
      { id: generateId(), date: randomDate(0), amount: 237, status: "paid", downloadUrl: "#" },
      { id: generateId(), date: randomDate(30), amount: 237, status: "paid", downloadUrl: "#" },
      { id: generateId(), date: randomDate(60), amount: 158, status: "paid", downloadUrl: "#" },
    ],
  };
}

export function generateMockAnalytics(): AnalyticsData {
  const dailyStats: DailyStat[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().split("T")[0],
      sent: Math.floor(Math.random() * 100) + 20,
      replies: Math.floor(Math.random() * 30) + 5,
      accepted: Math.floor(Math.random() * 40) + 10,
      connections: Math.floor(Math.random() * 50) + 15,
    };
  });

  const totalSent = dailyStats.reduce((s, d) => s + d.sent, 0);
  const totalReplies = dailyStats.reduce((s, d) => s + d.replies, 0);
  const totalAccepted = dailyStats.reduce((s, d) => s + d.accepted, 0);

  return {
    totalLeads: 1250,
    totalCampaigns: 12,
    totalSent,
    totalReplies,
    totalAccepted,
    totalConverted: Math.floor(totalReplies * 0.35),
    replyRate: Math.round((totalReplies / totalSent) * 100 * 10) / 10,
    acceptanceRate: Math.round((totalAccepted / totalSent) * 100 * 10) / 10,
    conversionRate: Math.round((Math.floor(totalReplies * 0.35) / totalSent) * 100 * 10) / 10,
    dailyStats,
    campaignPerformance: [
      { campaignId: "1", campaignName: "Q1 SaaS Founders", sent: 450, replies: 89, replyRate: 19.8 },
      { campaignId: "2", campaignName: "FinTech Leaders", sent: 320, replies: 78, replyRate: 24.4 },
      { campaignId: "3", campaignName: "Series A CTOs", sent: 280, replies: 95, replyRate: 33.9 },
      { campaignId: "4", campaignName: "Enterprise Sales", sent: 190, replies: 42, replyRate: 22.1 },
      { campaignId: "5", campaignName: "Marketing Agency", sent: 150, replies: 51, replyRate: 34.0 },
    ],
    topPerformingTemplates: [
      { templateId: "1", templateName: "Thank You Note", usageCount: 167, replyRate: 42.3 },
      { templateId: "2", templateName: "Event Follow-up", usageCount: 89, replyRate: 45.1 },
      { templateId: "3", templateName: "Mutual Connection", usageCount: 256, replyRate: 35.2 },
    ],
  };
}

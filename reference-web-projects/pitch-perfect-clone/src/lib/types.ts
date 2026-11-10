export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  tags: string[];
  status: "active" | "opted-out" | "bounced";
  segment?: string;
  createdAt: string;
  lastContactedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  type: "bulk" | "drip";
  templateId?: string;
  contactIds: string[];
  sentCount: number;
  deliveredCount: number;
  repliedCount: number;
  optOutCount: number;
  scheduledAt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  body: string;
  variables: string[];
  usageCount: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  status: "open" | "closed" | "pending";
  tags: string[];
  messages: ConversationMessage[];
  lastMessageAt: string;
  unread: boolean;
}

export interface ConversationMessage {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  timestamp: string;
  status: "sent" | "delivered" | "failed" | "read";
}

export interface Workflow {
  id: string;
  name: string;
  status: "active" | "inactive" | "draft";
  triggerType: "manual" | "tag_applied" | "contact_created" | "reply_received";
  steps: WorkflowStep[];
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  type: "send_sms" | "wait" | "add_tag" | "remove_tag" | "condition";
  config: Record<string, string | number>;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  contactCount: number;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
}

export interface PhoneNumber {
  id: string;
  number: string;
  label: string;
  status: "active" | "pending" | "suspended";
  type: "local" | "toll-free";
  monthlyMessages: number;
  createdAt: string;
}

export interface ScheduledMessage {
  id: string;
  contactId: string;
  contactName: string;
  body: string;
  scheduledAt: string;
  status: "pending" | "sent" | "cancelled";
  campaignId?: string;
}

export interface OptOut {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  reason: string;
  optedOutAt: string;
}

export interface DripCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  steps: DripStep[];
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
}

export interface DripStep {
  id: string;
  type: "sms" | "wait" | "condition";
  body?: string;
  delay?: number;
  delayUnit?: "minutes" | "hours" | "days" | "weeks";
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: string;
}

export interface AnalyticsData {
  date: string;
  sent: number;
  delivered: number;
  replied: number;
  optOuts: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent";
  status: "active" | "invited";
  lastActive?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

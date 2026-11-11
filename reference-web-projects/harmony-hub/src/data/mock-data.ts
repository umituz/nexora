export interface Agent {
  id: string;
  name: string;
  website: string;
  status: "active" | "paused" | "draft";
  channels: string[];
  totalConversations: number;
  conversionsCount: number;
  revenue: number;
  createdAt: string;
  instructions: string;
  greeting: string;
  personality: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  agentId: string;
  agentName: string;
  channel: string;
  status: "active" | "closed" | "pending";
  lastMessage: string;
  lastMessageAt: string;
  messagesCount: number;
  isRead: boolean;
  tags: string[];
  messages: Message[];
}

export interface Message {
  id: string;
  sender: "ai" | "contact" | "human";
  content: string;
  timestamp: string;
  type: "text" | "image" | "voice" | "document";
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  channel: string;
  tags: string[];
  score: number;
  status: "lead" | "qualified" | "customer" | "churned";
  totalConversations: number;
  totalRevenue: number;
  lastContactedAt: string;
  createdAt: string;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "incoming" | "outgoing" | "comment-to-dm";
  status: "draft" | "active" | "paused" | "completed";
  channel: string;
  agentId: string;
  agentName: string;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  convertedCount: number;
  scheduledAt: string | null;
  createdAt: string;
  message: string;
  targetTags: string[];
}

export interface Appointment {
  id: string;
  contactId: string;
  contactName: string;
  agentId: string;
  agentName: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes: string;
  channel: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[];
  usageCount: number;
  createdAt: string;
}

export interface TagItem {
  id: string;
  name: string;
  color: string;
  contactCount: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
  executionCount: number;
  createdAt: string;
}

export interface LeadScoreRule {
  id: string;
  name: string;
  condition: string;
  points: number;
  isActive: boolean;
}

export interface ActivityLogEntry {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata: Record<string, string>;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar: string;
  joinedAt: string;
  lastActiveAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  plan: string;
  creditsUsed: number;
  creditsTotal: number;
  timezone: string;
}

// ---------- MOCK DATA ----------

export const mockUser: UserProfile = {
  id: "u1",
  name: "John Doe",
  email: "john@agency.com",
  avatar: "",
  company: "AI Growth Agency",
  plan: "agency",
  creditsUsed: 623,
  creditsTotal: 1000,
  timezone: "Europe/Amsterdam",
};

export const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "FueGenix Sales Agent",
    website: "https://fuegenix.com",
    status: "active",
    channels: ["whatsapp", "instagram", "webchat"],
    totalConversations: 1247,
    conversionsCount: 312,
    revenue: 156000,
    createdAt: "2024-08-15",
    instructions: "You are a professional sales agent for FueGenix Hair Clinic...",
    greeting: "Hi! Welcome to FueGenix. How can I help you today?",
    personality: "Professional, empathetic, knowledgeable about hair transplant procedures",
  },
  {
    id: "a2",
    name: "Web Academie Assistant",
    website: "https://webacademie.nl",
    status: "active",
    channels: ["whatsapp", "instagram"],
    totalConversations: 834,
    conversionsCount: 201,
    revenue: 45200,
    createdAt: "2024-09-20",
    instructions: "You are a friendly assistant for Web Academie online courses...",
    greeting: "Welcome to Web Academie! Ready to learn something new?",
    personality: "Friendly, encouraging, educational",
  },
  {
    id: "a3",
    name: "Cobo Streaming Support",
    website: "https://cobostreaming.com",
    status: "paused",
    channels: ["messenger", "webchat"],
    totalConversations: 456,
    conversionsCount: 89,
    revenue: 12400,
    createdAt: "2024-10-05",
    instructions: "You help customers with streaming service questions and upgrades...",
    greeting: "Hey! Welcome to Cobo's Streaming. What can I do for you?",
    personality: "Casual, tech-savvy, helpful",
  },
  {
    id: "a4",
    name: "Belgravia Dental",
    website: "https://belgraviadental.com",
    status: "draft",
    channels: ["whatsapp"],
    totalConversations: 0,
    conversionsCount: 0,
    revenue: 0,
    createdAt: "2025-01-10",
    instructions: "You represent Belgravia Dental for appointment bookings...",
    greeting: "Hello! Thank you for reaching out to Belgravia Dental.",
    personality: "Professional, caring, detail-oriented",
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    contactId: "ct1",
    contactName: "Sarah Johnson",
    contactAvatar: "",
    agentId: "a1",
    agentName: "FueGenix Sales Agent",
    channel: "whatsapp",
    status: "active",
    lastMessage: "That sounds great! Can you tell me more about the FUE procedure?",
    lastMessageAt: "2025-03-08T10:30:00",
    messagesCount: 12,
    isRead: false,
    tags: ["hot-lead", "high-ticket"],
    messages: [
      { id: "m1", sender: "contact", content: "Hi, I'm interested in hair transplant", timestamp: "2025-03-08T10:00:00", type: "text" },
      { id: "m2", sender: "ai", content: "Welcome to FueGenix! I'd be happy to help you learn about our procedures. Could you tell me a bit about what you're looking for?", timestamp: "2025-03-08T10:00:15", type: "text" },
      { id: "m3", sender: "contact", content: "I've been losing hair for about 3 years now. Looking for a permanent solution.", timestamp: "2025-03-08T10:05:00", type: "text" },
      { id: "m4", sender: "ai", content: "I understand. Hair loss can be frustrating, but you've come to the right place! Our FUE procedure has helped thousands of clients achieve natural-looking results. The procedure starts from €8,000 depending on the number of grafts needed. Would you like to schedule a free consultation?", timestamp: "2025-03-08T10:05:20", type: "text" },
      { id: "m5", sender: "contact", content: "That sounds great! Can you tell me more about the FUE procedure?", timestamp: "2025-03-08T10:30:00", type: "text" },
    ],
  },
  {
    id: "c2",
    contactId: "ct2",
    contactName: "Michael Chen",
    contactAvatar: "",
    agentId: "a1",
    agentName: "FueGenix Sales Agent",
    channel: "instagram",
    status: "active",
    lastMessage: "I'd like to book a consultation for next week",
    lastMessageAt: "2025-03-08T09:15:00",
    messagesCount: 8,
    isRead: true,
    tags: ["qualified"],
    messages: [
      { id: "m6", sender: "contact", content: "Saw your results on Instagram. Very impressive!", timestamp: "2025-03-08T08:00:00", type: "text" },
      { id: "m7", sender: "ai", content: "Thank you! We're proud of our results. Would you like to learn more about how we can help you?", timestamp: "2025-03-08T08:00:10", type: "text" },
      { id: "m8", sender: "contact", content: "I'd like to book a consultation for next week", timestamp: "2025-03-08T09:15:00", type: "text" },
    ],
  },
  {
    id: "c3",
    contactId: "ct3",
    contactName: "Emma Williams",
    contactAvatar: "",
    agentId: "a2",
    agentName: "Web Academie Assistant",
    channel: "whatsapp",
    status: "closed",
    lastMessage: "Thank you! I just enrolled in the course.",
    lastMessageAt: "2025-03-07T16:45:00",
    messagesCount: 15,
    isRead: true,
    tags: ["customer", "course-buyer"],
    messages: [
      { id: "m9", sender: "contact", content: "Hi, what courses do you offer?", timestamp: "2025-03-07T14:00:00", type: "text" },
      { id: "m10", sender: "ai", content: "Hi Emma! We offer web development, design, and digital marketing courses. What interests you?", timestamp: "2025-03-07T14:00:12", type: "text" },
      { id: "m11", sender: "contact", content: "Thank you! I just enrolled in the course.", timestamp: "2025-03-07T16:45:00", type: "text" },
    ],
  },
  {
    id: "c4",
    contactId: "ct4",
    contactName: "David Park",
    contactAvatar: "",
    agentId: "a3",
    agentName: "Cobo Streaming Support",
    channel: "messenger",
    status: "pending",
    lastMessage: "Can I upgrade my plan?",
    lastMessageAt: "2025-03-08T11:00:00",
    messagesCount: 3,
    isRead: false,
    tags: ["upgrade"],
    messages: [
      { id: "m12", sender: "contact", content: "Can I upgrade my plan?", timestamp: "2025-03-08T11:00:00", type: "text" },
    ],
  },
];

export const mockContacts: Contact[] = [
  { id: "ct1", name: "Sarah Johnson", email: "sarah@email.com", phone: "+31612345678", avatar: "", channel: "whatsapp", tags: ["hot-lead", "high-ticket"], score: 92, status: "qualified", totalConversations: 5, totalRevenue: 0, lastContactedAt: "2025-03-08T10:30:00", createdAt: "2025-02-15", notes: "Interested in FUE procedure, budget around €15k" },
  { id: "ct2", name: "Michael Chen", email: "michael@email.com", phone: "+31687654321", avatar: "", channel: "instagram", tags: ["qualified"], score: 78, status: "qualified", totalConversations: 3, totalRevenue: 0, lastContactedAt: "2025-03-08T09:15:00", createdAt: "2025-02-20", notes: "Referred by Instagram, wants consultation" },
  { id: "ct3", name: "Emma Williams", email: "emma@email.com", phone: "+31698765432", avatar: "", channel: "whatsapp", tags: ["customer", "course-buyer"], score: 85, status: "customer", totalConversations: 8, totalRevenue: 497, lastContactedAt: "2025-03-07T16:45:00", createdAt: "2025-01-10", notes: "Purchased web dev course" },
  { id: "ct4", name: "David Park", email: "david@email.com", phone: "+31676543210", avatar: "", channel: "messenger", tags: ["upgrade"], score: 45, status: "lead", totalConversations: 1, totalRevenue: 29, lastContactedAt: "2025-03-08T11:00:00", createdAt: "2025-03-01", notes: "Current basic subscriber, wants to upgrade" },
  { id: "ct5", name: "Lisa Anderson", email: "lisa@email.com", phone: "+31665432109", avatar: "", channel: "webchat", tags: ["new-lead"], score: 35, status: "lead", totalConversations: 1, totalRevenue: 0, lastContactedAt: "2025-03-06T14:00:00", createdAt: "2025-03-06", notes: "" },
  { id: "ct6", name: "Robert Taylor", email: "robert@email.com", phone: "+31654321098", avatar: "", channel: "whatsapp", tags: ["churned"], score: 20, status: "churned", totalConversations: 12, totalRevenue: 1200, lastContactedAt: "2025-01-15T09:00:00", createdAt: "2024-06-01", notes: "Cancelled subscription, price concerns" },
];

export const mockCampaigns: Campaign[] = [
  { id: "cp1", name: "Spring Hair Promo", type: "outgoing", status: "active", channel: "whatsapp", agentId: "a1", agentName: "FueGenix Sales Agent", sentCount: 450, openedCount: 380, repliedCount: 120, convertedCount: 28, scheduledAt: null, createdAt: "2025-02-28", message: "Spring special! Get 20% off your FUE consultation this month.", targetTags: ["hot-lead", "qualified"] },
  { id: "cp2", name: "Course Launch", type: "outgoing", status: "completed", channel: "whatsapp", agentId: "a2", agentName: "Web Academie Assistant", sentCount: 800, openedCount: 650, repliedCount: 234, convertedCount: 67, scheduledAt: null, createdAt: "2025-02-15", message: "New advanced React course launching! Early bird discount inside.", targetTags: ["course-buyer", "qualified"] },
  { id: "cp3", name: "Instagram Comment DM", type: "comment-to-dm", status: "active", channel: "instagram", agentId: "a1", agentName: "FueGenix Sales Agent", sentCount: 1200, openedCount: 890, repliedCount: 445, convertedCount: 89, scheduledAt: null, createdAt: "2025-03-01", message: "Thanks for your comment! Want to learn more about our services?", targetTags: [] },
  { id: "cp4", name: "Re-engagement", type: "outgoing", status: "draft", channel: "whatsapp", agentId: "a3", agentName: "Cobo Streaming Support", sentCount: 0, openedCount: 0, repliedCount: 0, convertedCount: 0, scheduledAt: "2025-03-15", createdAt: "2025-03-05", message: "We miss you! Come back and enjoy 1 month free.", targetTags: ["churned"] },
];

export const mockAppointments: Appointment[] = [
  { id: "ap1", contactId: "ct1", contactName: "Sarah Johnson", agentId: "a1", agentName: "FueGenix Sales Agent", date: "2025-03-10", time: "10:00", duration: 30, status: "scheduled", notes: "FUE consultation", channel: "whatsapp" },
  { id: "ap2", contactId: "ct2", contactName: "Michael Chen", agentId: "a1", agentName: "FueGenix Sales Agent", date: "2025-03-11", time: "14:00", duration: 45, status: "scheduled", notes: "Initial assessment", channel: "instagram" },
  { id: "ap3", contactId: "ct3", contactName: "Emma Williams", agentId: "a2", agentName: "Web Academie Assistant", date: "2025-03-07", time: "11:00", duration: 60, status: "completed", notes: "Course orientation", channel: "whatsapp" },
  { id: "ap4", contactId: "ct5", contactName: "Lisa Anderson", agentId: "a1", agentName: "FueGenix Sales Agent", date: "2025-03-09", time: "15:30", duration: 30, status: "cancelled", notes: "Rescheduled by client", channel: "webchat" },
  { id: "ap5", contactId: "ct6", contactName: "Robert Taylor", agentId: "a3", agentName: "Cobo Streaming Support", date: "2025-03-05", time: "09:00", duration: 15, status: "no-show", notes: "Follow-up call", channel: "whatsapp" },
];

export const mockTemplates: Template[] = [
  { id: "t1", name: "Welcome Message", category: "greeting", content: "Hi {{name}}! Welcome to {{company}}. How can I help you today?", variables: ["name", "company"], usageCount: 1245, createdAt: "2024-08-01" },
  { id: "t2", name: "Follow Up", category: "follow-up", content: "Hi {{name}}, just checking in! You mentioned interest in {{product}}. Would you like to continue our conversation?", variables: ["name", "product"], usageCount: 890, createdAt: "2024-08-15" },
  { id: "t3", name: "Appointment Confirmation", category: "booking", content: "Your appointment is confirmed for {{date}} at {{time}}. See you then, {{name}}!", variables: ["name", "date", "time"], usageCount: 567, createdAt: "2024-09-01" },
  { id: "t4", name: "Promo Offer", category: "promotion", content: "Hey {{name}}! For a limited time, get {{discount}}% off {{product}}. Reply YES to claim!", variables: ["name", "discount", "product"], usageCount: 2340, createdAt: "2024-10-01" },
  { id: "t5", name: "Payment Link", category: "payment", content: "Hi {{name}}, here's your secure payment link for {{amount}}: {{link}}", variables: ["name", "amount", "link"], usageCount: 345, createdAt: "2024-11-01" },
];

export const mockTags: TagItem[] = [
  { id: "tg1", name: "hot-lead", color: "#EF4444", contactCount: 45 },
  { id: "tg2", name: "qualified", color: "#F59E0B", contactCount: 89 },
  { id: "tg3", name: "customer", color: "#10B981", contactCount: 156 },
  { id: "tg4", name: "high-ticket", color: "#8B5CF6", contactCount: 23 },
  { id: "tg5", name: "course-buyer", color: "#3B82F6", contactCount: 67 },
  { id: "tg6", name: "churned", color: "#6B7280", contactCount: 34 },
  { id: "tg7", name: "new-lead", color: "#06B6D4", contactCount: 112 },
  { id: "tg8", name: "upgrade", color: "#EC4899", contactCount: 28 },
  { id: "tg9", name: "vip", color: "#F97316", contactCount: 12 },
];

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  { id: "ka1", title: "FUE Hair Transplant Procedure", content: "The FUE procedure involves extracting individual hair follicles...", category: "Products", agentId: "a1", createdAt: "2024-08-15", updatedAt: "2025-01-10" },
  { id: "ka2", title: "Pricing & Packages", content: "Our pricing starts from €8,000 for basic procedures...", category: "Pricing", agentId: "a1", createdAt: "2024-08-15", updatedAt: "2025-02-20" },
  { id: "ka3", title: "Recovery Process", content: "After the procedure, patients can expect...", category: "FAQ", agentId: "a1", createdAt: "2024-09-01", updatedAt: "2025-01-15" },
  { id: "ka4", title: "Web Dev Course Curriculum", content: "Our comprehensive web development course covers...", category: "Products", agentId: "a2", createdAt: "2024-09-20", updatedAt: "2025-02-01" },
  { id: "ka5", title: "Refund Policy", content: "We offer a 30-day money-back guarantee...", category: "Policies", agentId: "a2", createdAt: "2024-10-01", updatedAt: "2024-12-15" },
];

export const mockAutomations: AutomationRule[] = [
  { id: "ar1", name: "Auto-tag hot leads", trigger: "Message contains price inquiry", conditions: ["Score > 70", "Channel: WhatsApp"], actions: ["Add tag: hot-lead", "Notify team"], isActive: true, executionCount: 234, createdAt: "2024-09-01" },
  { id: "ar2", name: "Follow-up after 24h", trigger: "No reply in 24 hours", conditions: ["Status: active", "Tags include: qualified"], actions: ["Send follow-up template", "Update status"], isActive: true, executionCount: 567, createdAt: "2024-09-15" },
  { id: "ar3", name: "Book appointment on intent", trigger: "Booking intent detected", conditions: ["Agent: FueGenix"], actions: ["Show calendar", "Create appointment"], isActive: true, executionCount: 189, createdAt: "2024-10-01" },
  { id: "ar4", name: "Escalate to human", trigger: "Negative sentiment 3x", conditions: ["Conversation active"], actions: ["Pause AI", "Notify team", "Add tag: needs-attention"], isActive: false, executionCount: 45, createdAt: "2024-11-01" },
];

export const mockLeadScoreRules: LeadScoreRule[] = [
  { id: "ls1", name: "Opens message", condition: "Contact opens a message", points: 5, isActive: true },
  { id: "ls2", name: "Replies to AI", condition: "Contact replies to AI message", points: 10, isActive: true },
  { id: "ls3", name: "Asks about pricing", condition: "Message contains pricing keywords", points: 20, isActive: true },
  { id: "ls4", name: "Books appointment", condition: "Contact books an appointment", points: 30, isActive: true },
  { id: "ls5", name: "Makes purchase", condition: "Payment completed", points: 50, isActive: true },
  { id: "ls6", name: "No reply 7 days", condition: "No response in 7 days", points: -15, isActive: true },
  { id: "ls7", name: "Unsubscribes", condition: "Contact unsubscribes", points: -30, isActive: true },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "al1", type: "conversation", description: "New conversation started with Sarah Johnson", userId: "u1", userName: "AI Agent", timestamp: "2025-03-08T10:00:00", metadata: { agentId: "a1", contactId: "ct1" } },
  { id: "al2", type: "campaign", description: "Campaign 'Spring Hair Promo' launched", userId: "u1", userName: "John Doe", timestamp: "2025-03-08T09:00:00", metadata: { campaignId: "cp1" } },
  { id: "al3", type: "appointment", description: "Appointment booked for Michael Chen", userId: "u1", userName: "AI Agent", timestamp: "2025-03-08T08:30:00", metadata: { appointmentId: "ap2" } },
  { id: "al4", type: "agent", description: "Agent 'Belgravia Dental' created", userId: "u1", userName: "John Doe", timestamp: "2025-03-08T08:00:00", metadata: { agentId: "a4" } },
  { id: "al5", type: "contact", description: "Contact Lisa Anderson added", userId: "u1", userName: "AI Agent", timestamp: "2025-03-06T14:00:00", metadata: { contactId: "ct5" } },
  { id: "al6", type: "system", description: "WhatsApp channel reconnected", userId: "u1", userName: "System", timestamp: "2025-03-06T12:00:00", metadata: {} },
  { id: "al7", type: "billing", description: "Invoice #1234 paid - €497.00", userId: "u1", userName: "System", timestamp: "2025-03-01T00:00:00", metadata: {} },
  { id: "al8", type: "conversation", description: "Conversation closed with Emma Williams", userId: "u1", userName: "AI Agent", timestamp: "2025-03-07T16:50:00", metadata: { conversationId: "c3" } },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "tm1", name: "John Doe", email: "john@agency.com", role: "owner", avatar: "", joinedAt: "2024-01-01", lastActiveAt: "2025-03-08T10:00:00" },
  { id: "tm2", name: "Jane Smith", email: "jane@agency.com", role: "admin", avatar: "", joinedAt: "2024-03-15", lastActiveAt: "2025-03-08T09:30:00" },
  { id: "tm3", name: "Bob Wilson", email: "bob@agency.com", role: "member", avatar: "", joinedAt: "2024-06-01", lastActiveAt: "2025-03-07T18:00:00" },
];

export const mockAnalyticsData = {
  overview: {
    totalConversations: 2537,
    totalConversionsCount: 602,
    totalRevenue: 213600,
    avgResponseTime: 3,
    activeAgents: 2,
    totalContacts: 1847,
    creditsUsed: 623,
    creditsTotal: 1000,
  },
  revenueByMonth: [
    { month: "Sep", revenue: 12400 },
    { month: "Oct", revenue: 18900 },
    { month: "Nov", revenue: 24500 },
    { month: "Dec", revenue: 31200 },
    { month: "Jan", revenue: 38700 },
    { month: "Feb", revenue: 42300 },
    { month: "Mar", revenue: 45600 },
  ],
  conversationsByChannel: [
    { channel: "WhatsApp", count: 1245 },
    { channel: "Instagram", count: 678 },
    { channel: "Messenger", count: 389 },
    { channel: "Web Chat", count: 225 },
  ],
  conversionsByAgent: [
    { agent: "FueGenix", conversions: 312, conversations: 1247 },
    { agent: "Web Academie", conversions: 201, conversations: 834 },
    { agent: "Cobo Streaming", conversions: 89, conversations: 456 },
  ],
  dailyConversations: [
    { date: "Mar 1", count: 45 },
    { date: "Mar 2", count: 52 },
    { date: "Mar 3", count: 38 },
    { date: "Mar 4", count: 67 },
    { date: "Mar 5", count: 59 },
    { date: "Mar 6", count: 71 },
    { date: "Mar 7", count: 63 },
    { date: "Mar 8", count: 48 },
  ],
};

import type {
  User, Contact, Campaign, MessageTemplate, Conversation,
  ConversationMessage, Workflow, Tag, CreditPack, PhoneNumber,
  ScheduledMessage, OptOut, DripCampaign, Integration,
  AnalyticsData, TeamMember, ApiKey,
} from "./types";

export const MOCK_USER: User = {
  id: "u1",
  firstName: "Mark",
  lastName: "Johnson",
  email: "mark@company.com",
  role: "admin",
  createdAt: "2024-01-15T10:00:00Z",
};

export const MOCK_CONTACTS: Contact[] = [
  { id: "c1", firstName: "Stephen", lastName: "Wright", phone: "+14155551001", email: "stephen@email.com", tags: ["Interested", "Hot Lead"], status: "active", segment: "Insurance Leads", createdAt: "2024-06-01T10:00:00Z", lastContactedAt: "2024-12-10T14:30:00Z" },
  { id: "c2", firstName: "Sarah", lastName: "Connor", phone: "+14155551002", email: "sarah@email.com", tags: ["New Lead"], status: "active", segment: "Insurance Leads", createdAt: "2024-06-05T10:00:00Z", lastContactedAt: "2024-12-09T11:00:00Z" },
  { id: "c3", firstName: "James", lastName: "Miller", phone: "+14155551003", tags: ["Follow-Up"], status: "active", segment: "Homeowners", createdAt: "2024-07-10T10:00:00Z", lastContactedAt: "2024-12-08T09:00:00Z" },
  { id: "c4", firstName: "Emily", lastName: "Davis", phone: "+14155551004", email: "emily@email.com", tags: ["Closed"], status: "active", segment: "Insurance Leads", createdAt: "2024-08-15T10:00:00Z", lastContactedAt: "2024-12-07T16:00:00Z" },
  { id: "c5", firstName: "Robert", lastName: "Wilson", phone: "+14155551005", tags: ["No Response"], status: "active", segment: "Business Owners", createdAt: "2024-09-01T10:00:00Z" },
  { id: "c6", firstName: "Lisa", lastName: "Anderson", phone: "+14155551006", email: "lisa@email.com", tags: ["Replied"], status: "active", segment: "Homeowners", createdAt: "2024-09-15T10:00:00Z", lastContactedAt: "2024-12-06T10:00:00Z" },
  { id: "c7", firstName: "Michael", lastName: "Brown", phone: "+14155551007", tags: ["Missed Appointment"], status: "active", createdAt: "2024-10-01T10:00:00Z" },
  { id: "c8", firstName: "Jennifer", lastName: "Taylor", phone: "+14155551008", email: "jen@email.com", tags: ["Business Owner", "Interested"], status: "active", segment: "Business Owners", createdAt: "2024-10-15T10:00:00Z", lastContactedAt: "2024-12-05T14:00:00Z" },
  { id: "c9", firstName: "David", lastName: "Thomas", phone: "+14155551009", tags: ["Homeowner"], status: "opted-out", segment: "Homeowners", createdAt: "2024-11-01T10:00:00Z" },
  { id: "c10", firstName: "Amanda", lastName: "Jackson", phone: "+14155551010", email: "amanda@email.com", tags: ["New Lead", "18-25"], status: "active", segment: "Young Professionals", createdAt: "2024-11-15T10:00:00Z" },
  { id: "c11", firstName: "Chris", lastName: "Martinez", phone: "+14155551011", tags: ["Hot Lead"], status: "active", segment: "Insurance Leads", createdAt: "2024-11-20T10:00:00Z", lastContactedAt: "2024-12-11T08:00:00Z" },
  { id: "c12", firstName: "Patricia", lastName: "Garcia", phone: "+14155551012", tags: ["Follow-Up", "Replied"], status: "active", segment: "Business Owners", createdAt: "2024-12-01T10:00:00Z", lastContactedAt: "2024-12-10T17:00:00Z" },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "camp1", name: "Holiday Special Offer", status: "completed", type: "bulk", contactIds: ["c1", "c2", "c3", "c4"], sentCount: 1250, deliveredCount: 1180, repliedCount: 234, optOutCount: 12, createdAt: "2024-11-20T10:00:00Z", completedAt: "2024-12-01T10:00:00Z" },
  { id: "camp2", name: "New Year Follow-Up", status: "active", type: "bulk", contactIds: ["c5", "c6", "c7"], sentCount: 890, deliveredCount: 845, repliedCount: 156, optOutCount: 5, createdAt: "2024-12-05T10:00:00Z" },
  { id: "camp3", name: "Insurance Quote Blast", status: "active", type: "bulk", contactIds: ["c1", "c8", "c11"], sentCount: 2100, deliveredCount: 1995, repliedCount: 378, optOutCount: 18, createdAt: "2024-12-08T10:00:00Z" },
  { id: "camp4", name: "Welcome Series", status: "active", type: "drip", contactIds: ["c2", "c10"], sentCount: 450, deliveredCount: 432, repliedCount: 89, optOutCount: 3, createdAt: "2024-12-01T10:00:00Z" },
  { id: "camp5", name: "Re-engagement Campaign", status: "draft", type: "bulk", contactIds: [], sentCount: 0, deliveredCount: 0, repliedCount: 0, optOutCount: 0, createdAt: "2024-12-10T10:00:00Z" },
  { id: "camp6", name: "Renewal Reminders", status: "paused", type: "drip", contactIds: ["c3", "c4", "c6"], sentCount: 320, deliveredCount: 305, repliedCount: 67, optOutCount: 2, createdAt: "2024-11-15T10:00:00Z" },
];

export const MOCK_TEMPLATES: MessageTemplate[] = [
  { id: "t1", name: "Quote Follow-Up", category: "Sales", body: "Hey {firstName}, it's {agentName} — just following up to see if you had a chance to look over that quote I sent.", variables: ["firstName", "agentName"], usageCount: 342, createdAt: "2024-06-01T10:00:00Z" },
  { id: "t2", name: "Quick Check-In", category: "Sales", body: "Hi {firstName}, just checking in to see how everything's going. Any questions about the plan we discussed?", variables: ["firstName"], usageCount: 218, createdAt: "2024-06-15T10:00:00Z" },
  { id: "t3", name: "Last Touch", category: "Sales", body: "Hey {firstName}, wanted to reach out one more time before I close your file. Still interested in moving forward?", variables: ["firstName"], usageCount: 156, createdAt: "2024-07-01T10:00:00Z" },
  { id: "t4", name: "Reconnect", category: "Retention", body: "Hi {firstName}! It's been a while since we connected. Just wanted to see if there's anything I can help with.", variables: ["firstName"], usageCount: 98, createdAt: "2024-07-15T10:00:00Z" },
  { id: "t5", name: "Friendly Nudge", category: "Sales", body: "Hey {firstName}, just a friendly nudge — let me know if you'd like to chat about your options. Happy to help!", variables: ["firstName"], usageCount: 187, createdAt: "2024-08-01T10:00:00Z" },
  { id: "t6", name: "Renewal Notice", category: "Retention", body: "Hi {firstName}, your policy is up for renewal soon. Let's chat about getting you the best rate possible.", variables: ["firstName"], usageCount: 124, createdAt: "2024-08-15T10:00:00Z" },
  { id: "t7", name: "Welcome Message", category: "Onboarding", body: "Welcome aboard, {firstName}! I'm {agentName}, and I'll be your point of contact. Feel free to reach out anytime.", variables: ["firstName", "agentName"], usageCount: 456, createdAt: "2024-05-01T10:00:00Z" },
  { id: "t8", name: "Appointment Reminder", category: "Scheduling", body: "Hi {firstName}, just a reminder about your appointment tomorrow at {time}. See you then!", variables: ["firstName", "time"], usageCount: 312, createdAt: "2024-09-01T10:00:00Z" },
  { id: "t9", name: "Referral Request", category: "Growth", body: "Hey {firstName}, glad we could help! Know anyone else who might benefit? We'd love to help them too.", variables: ["firstName"], usageCount: 76, createdAt: "2024-10-01T10:00:00Z" },
  { id: "t10", name: "Special Offer", category: "Promotions", body: "Hey {firstName}! We've got a limited-time offer just for you — {offerDetails}. Interested?", variables: ["firstName", "offerDetails"], usageCount: 234, createdAt: "2024-10-15T10:00:00Z" },
];

const makeMessages = (contactName: string): ConversationMessage[] => [
  { id: "m1", direction: "outbound", body: `Hey ${contactName}, it's Mark — just following up to see if you had a chance to look over that quote I sent.`, timestamp: "2024-12-10T14:00:00Z", status: "delivered" },
  { id: "m2", direction: "inbound", body: "Hey Mark, yeah I reviewed it this morning.", timestamp: "2024-12-10T14:15:00Z", status: "read" },
  { id: "m3", direction: "outbound", body: "Perfect — want me to lock that in and get things started for you?", timestamp: "2024-12-10T14:20:00Z", status: "delivered" },
  { id: "m4", direction: "inbound", body: "Yeah, let's do it. Go ahead.", timestamp: "2024-12-10T14:25:00Z", status: "read" },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "conv1", contactId: "c1", contactName: "Stephen Wright", contactPhone: "+14155551001", status: "open", tags: ["Hot Lead", "Interested"], messages: makeMessages("Stephen"), lastMessageAt: "2024-12-10T14:25:00Z", unread: false },
  { id: "conv2", contactId: "c2", contactName: "Sarah Connor", contactPhone: "+14155551002", status: "open", tags: ["New Lead"], messages: [
    { id: "m5", direction: "outbound", body: "Hi Sarah, this is Mark from PitchPrfct. I wanted to reach out about our insurance options.", timestamp: "2024-12-09T11:00:00Z", status: "delivered" },
    { id: "m6", direction: "inbound", body: "Hi Mark! Yes, I've been looking for better coverage. What do you have?", timestamp: "2024-12-09T11:30:00Z", status: "read" },
  ], lastMessageAt: "2024-12-09T11:30:00Z", unread: true },
  { id: "conv3", contactId: "c3", contactName: "James Miller", contactPhone: "+14155551003", status: "pending", tags: ["Follow-Up"], messages: [
    { id: "m7", direction: "outbound", body: "Hey James, just checking in on that quote. Let me know if you have any questions!", timestamp: "2024-12-08T09:00:00Z", status: "delivered" },
  ], lastMessageAt: "2024-12-08T09:00:00Z", unread: false },
  { id: "conv4", contactId: "c8", contactName: "Jennifer Taylor", contactPhone: "+14155551008", status: "open", tags: ["Business Owner", "Interested"], messages: [
    { id: "m8", direction: "outbound", body: "Hi Jennifer, I noticed you run a business in the area. We have some great coverage options for business owners.", timestamp: "2024-12-05T14:00:00Z", status: "delivered" },
    { id: "m9", direction: "inbound", body: "That sounds interesting! Can you send me more details?", timestamp: "2024-12-05T14:30:00Z", status: "read" },
    { id: "m10", direction: "outbound", body: "Absolutely! I'll send over a detailed breakdown. What's the best time to call?", timestamp: "2024-12-05T14:35:00Z", status: "delivered" },
  ], lastMessageAt: "2024-12-05T14:35:00Z", unread: true },
  { id: "conv5", contactId: "c11", contactName: "Chris Martinez", contactPhone: "+14155551011", status: "open", tags: ["Hot Lead"], messages: [
    { id: "m11", direction: "outbound", body: "Hey Chris, great news — I found an even better rate for you. Want to hear about it?", timestamp: "2024-12-11T08:00:00Z", status: "delivered" },
  ], lastMessageAt: "2024-12-11T08:00:00Z", unread: false },
  { id: "conv6", contactId: "c12", contactName: "Patricia Garcia", contactPhone: "+14155551012", status: "closed", tags: ["Replied", "Follow-Up"], messages: [
    { id: "m12", direction: "outbound", body: "Hi Patricia, following up on our conversation. Did you get a chance to review the policy details?", timestamp: "2024-12-10T16:00:00Z", status: "delivered" },
    { id: "m13", direction: "inbound", body: "Yes! Everything looks great. I'm ready to sign up.", timestamp: "2024-12-10T17:00:00Z", status: "read" },
  ], lastMessageAt: "2024-12-10T17:00:00Z", unread: false },
];

export const MOCK_WORKFLOWS: Workflow[] = [
  { id: "w1", name: "Welcome New Leads", status: "active", triggerType: "contact_created", steps: [
    { id: "ws1", type: "send_sms", config: { templateId: "t7", message: "Welcome message" } },
    { id: "ws2", type: "wait", config: { duration: "3", unit: "days" } },
    { id: "ws3", type: "send_sms", config: { templateId: "t2", message: "Check-in message" } },
    { id: "ws4", type: "add_tag", config: { tag: "Follow-Up" } },
  ], enrolledCount: 245, completedCount: 189, createdAt: "2024-08-01T10:00:00Z" },
  { id: "w2", name: "Re-engagement Flow", status: "active", triggerType: "tag_applied", steps: [
    { id: "ws5", type: "send_sms", config: { templateId: "t4", message: "Reconnect message" } },
    { id: "ws6", type: "wait", config: { duration: "1", unit: "weeks" } },
    { id: "ws7", type: "send_sms", config: { templateId: "t3", message: "Last touch" } },
  ], enrolledCount: 120, completedCount: 98, createdAt: "2024-09-15T10:00:00Z" },
  { id: "w3", name: "Appointment Follow-Up", status: "inactive", triggerType: "manual", steps: [
    { id: "ws8", type: "send_sms", config: { templateId: "t8", message: "Reminder" } },
    { id: "ws9", type: "wait", config: { duration: "1", unit: "days" } },
    { id: "ws10", type: "send_sms", config: { templateId: "t5", message: "Nudge" } },
  ], enrolledCount: 56, completedCount: 45, createdAt: "2024-10-01T10:00:00Z" },
  { id: "w4", name: "Renewal Pipeline", status: "draft", triggerType: "manual", steps: [
    { id: "ws11", type: "send_sms", config: { templateId: "t6", message: "Renewal notice" } },
    { id: "ws12", type: "wait", config: { duration: "5", unit: "days" } },
    { id: "ws13", type: "condition", config: { condition: "replied", value: "true" } },
    { id: "ws14", type: "send_sms", config: { templateId: "t2", message: "Follow-up" } },
  ], enrolledCount: 0, completedCount: 0, createdAt: "2024-12-01T10:00:00Z" },
];

export const MOCK_TAGS: Tag[] = [
  { id: "tag1", name: "Interested", color: "#22C55E", contactCount: 34 },
  { id: "tag2", name: "Follow-Up", color: "#3B82F6", contactCount: 28 },
  { id: "tag3", name: "Hot Lead", color: "#EF4444", contactCount: 15 },
  { id: "tag4", name: "New Lead", color: "#8B5CF6", contactCount: 42 },
  { id: "tag5", name: "Missed Appointment", color: "#F59E0B", contactCount: 8 },
  { id: "tag6", name: "Homeowner", color: "#06B6D4", contactCount: 21 },
  { id: "tag7", name: "No Response", color: "#6B7280", contactCount: 56 },
  { id: "tag8", name: "Closed", color: "#10B981", contactCount: 19 },
  { id: "tag9", name: "Replied", color: "#14B8A6", contactCount: 67 },
  { id: "tag10", name: "Business Owner", color: "#F97316", contactCount: 12 },
  { id: "tag11", name: "18-25", color: "#A855F7", contactCount: 9 },
];

export const MOCK_CREDIT_PACKS: CreditPack[] = [
  { id: "cp1", name: "Starter Pack", credits: 5000, price: 35, pricePerCredit: 0.007 },
  { id: "cp2", name: "Growth Pack", credits: 15000, price: 97.50, pricePerCredit: 0.0065 },
  { id: "cp3", name: "Pro Pack", credits: 50000, price: 300, pricePerCredit: 0.006 },
  { id: "cp4", name: "Enterprise Pack", credits: 200000, price: 1100, pricePerCredit: 0.0055 },
];

export const MOCK_PHONE_NUMBERS: PhoneNumber[] = [
  { id: "pn1", number: "+14155551234", label: "Main Line", status: "active", type: "local", monthlyMessages: 3420, createdAt: "2024-06-01T10:00:00Z" },
  { id: "pn2", number: "+18005559876", label: "Toll-Free", status: "active", type: "toll-free", monthlyMessages: 1890, createdAt: "2024-07-15T10:00:00Z" },
  { id: "pn3", number: "+14155555678", label: "Secondary", status: "pending", type: "local", monthlyMessages: 0, createdAt: "2024-12-01T10:00:00Z" },
];

export const MOCK_SCHEDULED_MESSAGES: ScheduledMessage[] = [
  { id: "sm1", contactId: "c1", contactName: "Stephen Wright", body: "Hey Stephen, reminder about our call tomorrow!", scheduledAt: "2024-12-12T09:00:00Z", status: "pending" },
  { id: "sm2", contactId: "c2", contactName: "Sarah Connor", body: "Hi Sarah, your quote is ready! Let me know when you'd like to review.", scheduledAt: "2024-12-12T10:00:00Z", status: "pending" },
  { id: "sm3", contactId: "c8", contactName: "Jennifer Taylor", body: "Good morning Jennifer! Just wanted to check if you received the policy details.", scheduledAt: "2024-12-13T08:00:00Z", status: "pending" },
  { id: "sm4", contactId: "c4", contactName: "Emily Davis", body: "Hi Emily, congrats on your new policy! Let us know if you need anything.", scheduledAt: "2024-12-11T15:00:00Z", status: "sent" },
  { id: "sm5", contactId: "c5", contactName: "Robert Wilson", body: "Hey Robert, I have some great new rates to share. Are you available for a quick chat?", scheduledAt: "2024-12-14T11:00:00Z", status: "pending" },
];

export const MOCK_OPT_OUTS: OptOut[] = [
  { id: "oo1", contactId: "c9", contactName: "David Thomas", contactPhone: "+14155551009", reason: "Replied STOP", optedOutAt: "2024-11-28T10:00:00Z" },
  { id: "oo2", contactId: "oo-c2", contactName: "Karen White", contactPhone: "+14155552001", reason: "Replied STOP", optedOutAt: "2024-12-02T14:00:00Z" },
  { id: "oo3", contactId: "oo-c3", contactName: "Tom Harris", contactPhone: "+14155552002", reason: "Manual removal request", optedOutAt: "2024-12-05T09:00:00Z" },
];

export const MOCK_DRIP_CAMPAIGNS: DripCampaign[] = [
  { id: "dc1", name: "7-Day Welcome Series", status: "active", steps: [
    { id: "ds1", type: "sms", body: "Welcome aboard! We're excited to have you.", delay: 0, delayUnit: "minutes" },
    { id: "ds2", type: "wait", delay: 2, delayUnit: "days" },
    { id: "ds3", type: "sms", body: "How's everything going? Any questions so far?", delay: 0, delayUnit: "minutes" },
    { id: "ds4", type: "wait", delay: 3, delayUnit: "days" },
    { id: "ds5", type: "sms", body: "Just checking in one last time. Here to help whenever you need!", delay: 0, delayUnit: "minutes" },
  ], enrolledCount: 156, completedCount: 89, createdAt: "2024-10-01T10:00:00Z" },
  { id: "dc2", name: "Quote Follow-Up Sequence", status: "active", steps: [
    { id: "ds6", type: "sms", body: "Thanks for requesting a quote! I'll have it ready for you shortly." },
    { id: "ds7", type: "wait", delay: 1, delayUnit: "days" },
    { id: "ds8", type: "sms", body: "Your quote is ready! Want me to walk you through it?" },
    { id: "ds9", type: "wait", delay: 3, delayUnit: "days" },
    { id: "ds10", type: "sms", body: "Just following up on your quote. Any questions?" },
  ], enrolledCount: 234, completedCount: 178, createdAt: "2024-09-15T10:00:00Z" },
  { id: "dc3", name: "Renewal Reminder Series", status: "draft", steps: [
    { id: "ds11", type: "sms", body: "Hi! Your policy renewal is coming up. Let's make sure you have the best rate." },
    { id: "ds12", type: "wait", delay: 5, delayUnit: "days" },
    { id: "ds13", type: "sms", body: "Reminder: Your renewal date is approaching. Let's chat!" },
  ], enrolledCount: 0, completedCount: 0, createdAt: "2024-12-05T10:00:00Z" },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: "int1", name: "Salesforce", description: "Sync contacts and deals with Salesforce CRM", icon: "Cloud", connected: true, category: "CRM" },
  { id: "int2", name: "HubSpot", description: "Connect your HubSpot marketing and sales data", icon: "Circle", connected: false, category: "CRM" },
  { id: "int3", name: "Zapier", description: "Automate workflows with 5000+ apps", icon: "Zap", connected: true, category: "Automation" },
  { id: "int4", name: "Google Sheets", description: "Import/export contacts from Google Sheets", icon: "Sheet", connected: false, category: "Data" },
  { id: "int5", name: "Calendly", description: "Auto-book appointments from SMS conversations", icon: "Calendar", connected: true, category: "Scheduling" },
  { id: "int6", name: "Stripe", description: "Process payments and track revenue", icon: "CreditCard", connected: false, category: "Payments" },
  { id: "int7", name: "Slack", description: "Get real-time notifications in Slack", icon: "Hash", connected: true, category: "Notifications" },
  { id: "int8", name: "Webhook", description: "Send data to custom endpoints", icon: "Globe", connected: false, category: "Developer" },
];

export const MOCK_ANALYTICS: AnalyticsData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2024, 11, i + 1);
  const base = 80 + Math.floor(Math.random() * 120);
  return {
    date: date.toISOString().split("T")[0],
    sent: base,
    delivered: Math.floor(base * (0.92 + Math.random() * 0.06)),
    replied: Math.floor(base * (0.15 + Math.random() * 0.1)),
    optOuts: Math.floor(base * (0.005 + Math.random() * 0.01)),
  };
});

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "tm1", name: "Mark Johnson", email: "mark@company.com", role: "admin", status: "active", lastActive: "2024-12-11T10:00:00Z" },
  { id: "tm2", name: "Jessica Lee", email: "jessica@company.com", role: "manager", status: "active", lastActive: "2024-12-11T09:30:00Z" },
  { id: "tm3", name: "Alex Rivera", email: "alex@company.com", role: "agent", status: "active", lastActive: "2024-12-10T18:00:00Z" },
  { id: "tm4", name: "Samantha Chen", email: "samantha@company.com", role: "agent", status: "invited" },
];

export const MOCK_API_KEYS: ApiKey[] = [
  { id: "ak1", name: "Production Key", key: "pk_live_••••••••••••••••••••3f8a", createdAt: "2024-06-01T10:00:00Z", lastUsed: "2024-12-11T10:00:00Z" },
  { id: "ak2", name: "Test Key", key: "pk_test_••••••••••••••••••••9b2c", createdAt: "2024-06-01T10:00:00Z", lastUsed: "2024-12-09T15:00:00Z" },
];

export const MOCK_TESTIMONIALS = [
  { id: 1, name: "Matheus Bueno", role: "Insurance Agent", text: "Before using this platform, we were drowning in spreadsheets and missed opportunities. Now everything's in one place, easy to track, and super simple to use." },
  { id: 2, name: "Gabriel Perez", role: "Insurance Agent", text: "This platform has been a breath of fresh air. Deliverability averaging 94-97%. Great customer service, super quick to respond. Within my first day I had gotten a deal closed. 10/10" },
  { id: 3, name: "Deandrick Loubeau", role: "Insurance Agent", text: "This has been working wonders. Helped me expand my business in ways I thought weren't possible. Able to reach out to leads at a much greater speed while staying compliant." },
  { id: 4, name: "Dylan Hernandez", role: "Insurance Agent", text: "Amazing tool. I'm able to reach almost double the leads for the same cost. They have helped me lean out my business tremendously." },
  { id: 5, name: "Senecia Werling", role: "Insurance Agent", text: "This has completely changed the way I run my business — none of the other platforms even begin to compare to the consistency and reliability that this platform has provided!" },
];

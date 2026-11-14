export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  workflow?: WorkflowStep[];
};

export type WorkflowStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
};

export type Task = {
  id: string;
  title: string;
  category: "work" | "personal" | "finance" | "health";
  priority: "high" | "medium" | "low";
  done: boolean;
  dueDate?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
  type: "meeting" | "reminder" | "task" | "event";
  description?: string;
};

export type Subscription = {
  id: string;
  name: string;
  category: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  nextBilling: string;
  status: "active" | "paused" | "cancelled";
  logo: string;
  expensive: boolean;
  cancelReminder?: boolean;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  color: string;
  updatedAt: number;
  aiSummary?: string;
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: "daily" | "weekly";
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  goal: number;
};

export type Goal = {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  progress: number;
  milestones: { id: string; label: string; done: boolean }[];
  color: string;
  icon: string;
};

export type Email = {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  read: boolean;
  starred: boolean;
  category: "inbox" | "sent" | "draft" | "spam";
  avatar: string;
  important: boolean;
};

export type BudgetCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  spent: number;
  budget: number;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
  icon: string;
  color: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  icon: string;
  color: string;
  current: number;
  target: number;
  deadline: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
  avatar: string;
  aiInsight: string;
  tags: string[];
};

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  category: string;
  time: string;
  readTime: string;
  summary: string;
  color: string;
  saved: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: ShoppingItem[];
  color: string;
  createdAt: number;
};

export type ShoppingItem = {
  id: string;
  name: string;
  qty: string;
  done: boolean;
  category: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: number;
  content: string;
  aiPromptUsed: string;
  tags: string[];
  wordCount: number;
};

export type TravelPlan = {
  id: string;
  destination: string;
  country: string;
  flag: string;
  startDate: string;
  endDate: string;
  status: "planning" | "booked" | "upcoming" | "completed";
  budget: number;
  spent: number;
  items: { id: string; label: string; done: boolean }[];
  color: string;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  icon: string;
  color: string;
  tags: string[];
  aiSummary: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
  tasks: number;
  completedTasks: number;
};

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  steps: number;
  lastRun?: string;
  category: string;
  icon: string;
  color: string;
  runs: number;
};

export type HealthMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
};

export type WeatherDay = {
  day: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
};

export type Notification = {
  id: string;
  type: "task" | "reminder" | "ai" | "team" | "finance";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
  group: "today" | "earlier";
};

export type AnalyticsData = {
  productivityScore: number;
  productivityDelta: number;
  dailyScores: number[];
  tasksDone: number;
  tasksDelta: number;
  focusHours: number;
  focusDelta: number;
  habitStreak: number;
  habitDelta: number;
  avgMood: string;
  moodDelta: string;
  categories: { name: string; pct: number; color: string }[];
  insights: string[];
};

export type AnalyticsPeriodMap = {
  "7D": AnalyticsData;
  "30D": AnalyticsData;
  "90D": AnalyticsData;
  "1Y": AnalyticsData;
};

export type WorkflowRun = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: "done" | "running" | "pending" | "failed";
  triggeredAt: string;
  steps: WorkflowStep[];
};

// ─── MOCK DATA ──────────────────────────────────────────────────────────────

export const MOCK_TASKS: Task[] = [
  { id: "t1", title: "Review Q1 financial report", category: "work", priority: "high", done: false, dueDate: "Today" },
  { id: "t2", title: "Schedule dentist appointment", category: "health", priority: "medium", done: false, dueDate: "This week" },
  { id: "t3", title: "Cancel unused streaming services", category: "finance", priority: "high", done: false, dueDate: "Today" },
  { id: "t4", title: "Team standup prep notes", category: "work", priority: "medium", done: true, dueDate: "Yesterday" },
  { id: "t5", title: "Pay credit card bill", category: "finance", priority: "high", done: false, dueDate: "Tomorrow" },
  { id: "t6", title: "Renew gym membership", category: "health", priority: "low", done: false, dueDate: "Next week" },
  { id: "t7", title: "Send project proposal", category: "work", priority: "high", done: true, dueDate: "Yesterday" },
  { id: "t8", title: "Call mom", category: "personal", priority: "medium", done: false, dueDate: "Today" },
  { id: "t9", title: "Read new design system docs", category: "work", priority: "low", done: false, dueDate: "This week" },
  { id: "t10", title: "Backup laptop data", category: "personal", priority: "medium", done: false, dueDate: "This week" },
  { id: "t11", title: "Review insurance policy", category: "finance", priority: "medium", done: false, dueDate: "Next week" },
  { id: "t12", title: "Update LinkedIn profile", category: "personal", priority: "low", done: true, dueDate: "Last week" },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Team Standup", date: "2026-03-04", time: "9:00 AM", color: "#4F8EF7", type: "meeting", description: "Daily sync with product team" },
  { id: "e2", title: "Dentist Appointment", date: "2026-03-05", time: "2:30 PM", color: "#10B981", type: "reminder", description: "Routine checkup at Dr. Smith's" },
  { id: "e3", title: "Cancel Netflix reminder", date: "2026-03-04", time: "6:00 PM", color: "#F59E0B", type: "reminder", description: "Review and decide to cancel or keep" },
  { id: "e4", title: "Quarterly Review", date: "2026-03-06", time: "11:00 AM", color: "#8B5CF6", type: "meeting", description: "Q1 performance review with leadership" },
  { id: "e5", title: "Pay credit card", date: "2026-03-05", time: "12:00 PM", color: "#EF4444", type: "task", description: "Due date for credit card payment" },
  { id: "e6", title: "Yoga class", date: "2026-03-07", time: "7:00 AM", color: "#06B6D4", type: "event", description: "Morning yoga at the studio" },
  { id: "e7", title: "Product Launch", date: "2026-03-10", time: "3:00 PM", color: "#4F8EF7", type: "event", description: "v2.0 launch — all hands" },
  { id: "e8", title: "Grocery shopping", date: "2026-03-08", time: "5:00 PM", color: "#10B981", type: "task", description: "Weekly grocery run" },
  { id: "e9", title: "Coffee with Sarah", date: "2026-03-09", time: "10:00 AM", color: "#F59E0B", type: "event", description: "Catch-up meeting" },
  { id: "e10", title: "Book club", date: "2026-03-11", time: "7:00 PM", color: "#8B5CF6", type: "event", description: "Monthly book club meeting" },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: "s1", name: "Netflix", category: "Entertainment", price: 22.99, billingCycle: "monthly", nextBilling: "Mar 15", status: "active", logo: "tv-outline", expensive: true, cancelReminder: false },
  { id: "s2", name: "Spotify", category: "Music", price: 11.99, billingCycle: "monthly", nextBilling: "Mar 18", status: "active", logo: "musical-notes-outline", expensive: false, cancelReminder: false },
  { id: "s3", name: "Adobe CC", category: "Productivity", price: 59.99, billingCycle: "monthly", nextBilling: "Mar 20", status: "active", logo: "color-palette-outline", expensive: true, cancelReminder: false },
  { id: "s4", name: "iCloud+", category: "Storage", price: 2.99, billingCycle: "monthly", nextBilling: "Mar 10", status: "active", logo: "cloud-outline", expensive: false, cancelReminder: false },
  { id: "s5", name: "Hulu", category: "Entertainment", price: 17.99, billingCycle: "monthly", nextBilling: "Mar 22", status: "active", logo: "play-circle-outline", expensive: true, cancelReminder: false },
  { id: "s6", name: "LinkedIn Premium", category: "Professional", price: 39.99, billingCycle: "monthly", nextBilling: "Mar 25", status: "active", logo: "briefcase-outline", expensive: true, cancelReminder: false },
  { id: "s7", name: "GitHub Copilot", category: "Developer", price: 10.00, billingCycle: "monthly", nextBilling: "Mar 12", status: "active", logo: "code-slash-outline", expensive: false, cancelReminder: false },
  { id: "s8", name: "Headspace", category: "Health", price: 12.99, billingCycle: "monthly", nextBilling: "Mar 28", status: "paused", logo: "heart-outline", expensive: false, cancelReminder: false },
];

export const MOCK_NOTES: Note[] = [
  { id: "n1", title: "Q1 Strategy Notes", content: "Key priorities for Q1:\n\n1. Launch new onboarding flow\n2. Reduce churn by 15%\n3. Expand to EMEA markets\n\nThe team is aligned on these goals. Need to schedule weekly check-ins.", tags: ["work", "strategy"], pinned: true, color: "#4F8EF7", updatedAt: Date.now() - 3600000, aiSummary: "Q1 focus: onboarding, churn reduction, EMEA expansion" },
  { id: "n2", title: "Book recommendations", content: "Books to read this year:\n• Thinking Fast and Slow\n• The Lean Startup\n• Atomic Habits\n• Deep Work\n• Zero to One", tags: ["personal", "reading"], pinned: false, color: "#8B5CF6", updatedAt: Date.now() - 86400000, aiSummary: "Reading list of 5 productivity & business books" },
  { id: "n3", title: "Meeting notes - Product sync", content: "Attendees: Alex, Sarah, Mike, Jordan\n\nAction items:\n- Alex: finalize dashboard spec by Friday\n- Sarah: user research report due Monday\n- Mike: backend API v2 planning\n- Jordan: QA checklist update", tags: ["work", "meetings"], pinned: true, color: "#10B981", updatedAt: Date.now() - 7200000, aiSummary: "Product sync with 4 action items due this week" },
  { id: "n4", title: "Gym routine", content: "Mon/Wed/Fri: Strength training\n• Bench press 4x8\n• Squat 4x6\n• Deadlift 3x5\n\nTue/Thu: Cardio + core\n• 30min run or cycling\n• Plank 3x60s", tags: ["health", "fitness"], pinned: false, color: "#F59E0B", updatedAt: Date.now() - 172800000, aiSummary: "5-day workout split: strength 3x + cardio 2x" },
  { id: "n5", title: "App ideas", content: "Side project ideas:\n1. AI recipe generator based on fridge contents\n2. Focus timer with biometric feedback\n3. Travel budget tracker with AI suggestions\n4. Personal CRM for relationship management", tags: ["personal", "ideas"], pinned: false, color: "#06B6D4", updatedAt: Date.now() - 259200000, aiSummary: "4 app ideas for side projects" },
  { id: "n6", title: "Financial goals 2026", content: "Savings targets:\n• Emergency fund: $20,000 (60% done)\n• Europe trip: $5,000 (40% done)\n• Investment portfolio: $50,000 (35% done)\n\nMonthly savings rate: 30% of income", tags: ["finance"], pinned: false, color: "#EF4444", updatedAt: Date.now() - 432000000, aiSummary: "3 savings goals with 35-60% completion rates" },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export const MOCK_HABITS: Habit[] = [
  { id: "h1", name: "Morning meditation", icon: "body-outline", color: "#8B5CF6", frequency: "daily", streak: 14, completedToday: true, completedDates: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(6)], goal: 21 },
  { id: "h2", name: "Read for 30 mins", icon: "book-outline", color: "#4F8EF7", frequency: "daily", streak: 7, completedToday: false, completedDates: [daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5), daysAgo(6)], goal: 30 },
  { id: "h3", name: "Exercise", icon: "fitness-outline", color: "#10B981", frequency: "daily", streak: 21, completedToday: true, completedDates: [daysAgo(0), daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(5), daysAgo(6)], goal: 30 },
  { id: "h4", name: "Drink 2L water", icon: "water-outline", color: "#06B6D4", frequency: "daily", streak: 5, completedToday: false, completedDates: [daysAgo(1), daysAgo(2), daysAgo(3), daysAgo(4), daysAgo(5)], goal: 30 },
  { id: "h5", name: "Gratitude journal", icon: "journal-outline", color: "#F59E0B", frequency: "daily", streak: 3, completedToday: true, completedDates: [daysAgo(0), daysAgo(1), daysAgo(2)], goal: 21 },
  { id: "h6", name: "Weekly review", icon: "checkbox-outline", color: "#EF4444", frequency: "weekly", streak: 8, completedToday: false, completedDates: [daysAgo(7), daysAgo(14), daysAgo(21)], goal: 12 },
  { id: "h7", name: "No social media before 9am", icon: "phone-portrait-outline", color: "#F59E0B", frequency: "daily", streak: 2, completedToday: false, completedDates: [daysAgo(1), daysAgo(2)], goal: 21 },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: "g1", title: "Launch side project", category: "Career", targetDate: "Jun 2026", progress: 35, color: "#4F8EF7", icon: "rocket-outline",
    milestones: [
      { id: "m1", label: "Define MVP features", done: true },
      { id: "m2", label: "Build prototype", done: true },
      { id: "m3", label: "User testing", done: false },
      { id: "m4", label: "Beta launch", done: false },
      { id: "m5", label: "Public launch", done: false },
    ],
  },
  {
    id: "g2", title: "Run a half marathon", category: "Health", targetDate: "Sep 2026", progress: 60, color: "#10B981", icon: "walk-outline",
    milestones: [
      { id: "m1", label: "Run 5K without stopping", done: true },
      { id: "m2", label: "Complete 10K race", done: true },
      { id: "m3", label: "Build to 15K training runs", done: true },
      { id: "m4", label: "Complete half marathon", done: false },
    ],
  },
  {
    id: "g3", title: "Save $20K emergency fund", category: "Finance", targetDate: "Dec 2026", progress: 62, color: "#F59E0B", icon: "shield-outline",
    milestones: [
      { id: "m1", label: "Save first $5,000", done: true },
      { id: "m2", label: "Reach $10,000", done: true },
      { id: "m3", label: "Reach $15,000", done: false },
      { id: "m4", label: "Complete $20,000", done: false },
    ],
  },
  {
    id: "g4", title: "Learn Spanish (B2 level)", category: "Personal", targetDate: "Dec 2026", progress: 20, color: "#8B5CF6", icon: "language-outline",
    milestones: [
      { id: "m1", label: "Complete A1 course", done: true },
      { id: "m2", label: "Complete A2 course", done: false },
      { id: "m3", label: "Pass B1 exam", done: false },
      { id: "m4", label: "Pass B2 exam", done: false },
    ],
  },
];

export const MOCK_EMAILS: Email[] = [
  { id: "em1", from: "Sarah Chen", fromEmail: "sarah@company.com", subject: "Q1 Review - Action Items", preview: "Hi Alex, following up on today's quarterly review. Here are the key action items we discussed...", body: "Hi Alex,\n\nFollowing up on today's quarterly review. Here are the key action items we discussed:\n\n1. Finalize the dashboard redesign by March 15\n2. Complete the user research synthesis report\n3. Set up weekly 1:1s with the new team members\n\nCan you confirm you've received this and let me know your timeline?\n\nBest,\nSarah", time: "9:32 AM", date: "Today", read: false, starred: true, category: "inbox", avatar: "S", important: true },
  { id: "em2", from: "Netflix", fromEmail: "no-reply@netflix.com", subject: "Your Netflix bill is ready", preview: "Your monthly Netflix subscription of $22.99 will be charged on March 15...", body: "Hi there,\n\nYour Netflix subscription payment of $22.99 is due on March 15, 2026.\n\nPlan: Standard with Ads\nNext billing date: March 15, 2026\nAmount: $22.99\n\nIf you'd like to cancel or change your plan, visit your account settings.", time: "8:15 AM", date: "Today", read: true, starred: false, category: "inbox", avatar: "N", important: false },
  { id: "em3", from: "Jordan Lee", fromEmail: "jordan@company.com", subject: "Design system update - review needed", preview: "Hey! I've pushed the new design tokens to Figma. Could you review and approve before EOD?", body: "Hey Alex!\n\nI've pushed the new design tokens to Figma. Could you review and approve before EOD?\n\nHere's what changed:\n- Updated color palette for dark mode\n- New spacing scale\n- Revised typography hierarchy\n\nLink: figma.com/design/xyz123\n\nThanks!\nJordan", time: "Yesterday", date: "Yesterday", read: false, starred: false, category: "inbox", avatar: "J", important: false },
  { id: "em4", from: "LinkedIn", fromEmail: "jobs@linkedin.com", subject: "5 new jobs match your profile", preview: "Senior Product Designer at Stripe, Lead UX at Notion, and 3 more opportunities...", body: "Based on your profile and job preferences, here are this week's top matches:\n\n1. Senior Product Designer - Stripe ($180K-$220K)\n2. Lead UX Designer - Notion ($150K-$190K)\n3. Design Systems Lead - Airbnb ($170K-$210K)\n4. Head of Design - Figma ($200K-$250K)\n5. Principal Designer - Linear ($160K-$200K)", time: "Yesterday", date: "Yesterday", read: true, starred: true, category: "inbox", avatar: "L", important: false },
  { id: "em5", from: "Mike Rodriguez", fromEmail: "mike@company.com", subject: "API v2 planning doc - needs your input", preview: "Hi, I've drafted the API v2 architecture doc. Would love your product perspective on a few decisions...", body: "Hi Alex,\n\nI've drafted the API v2 architecture document. Would love your product perspective on a few key decisions:\n\n1. Should we support GraphQL alongside REST?\n2. Versioning strategy - URL path vs. headers?\n3. Rate limiting approach for free tier\n\nDraft is in Notion: notion.so/api-v2-planning\n\nHappy to jump on a call.\n\nMike", time: "2 days ago", date: "Mar 2", read: false, starred: false, category: "inbox", avatar: "M", important: true },
  { id: "em6", from: "GitHub", fromEmail: "noreply@github.com", subject: "Pull request review requested", preview: "mike-rodriguez requested your review on PR #247: 'feat: Add AI-powered search'...", body: "mike-rodriguez has requested your review on:\n\nPR #247: feat: Add AI-powered search\nRepository: company/main-app\n\nChanges: +847 lines, -203 lines\n\nView this pull request on GitHub to review.", time: "2 days ago", date: "Mar 2", read: true, starred: false, category: "inbox", avatar: "G", important: false },
  { id: "em7", from: "American Express", fromEmail: "alerts@americanexpress.com", subject: "Payment reminder: $1,247.33 due Mar 5", preview: "Your American Express credit card payment of $1,247.33 is due on March 5, 2026...", body: "Your payment is due:\n\nAmount due: $1,247.33\nMinimum payment: $35.00\nDue date: March 5, 2026\n\nPay online at americanexpress.com or set up autopay to never miss a payment.", time: "3 days ago", date: "Mar 1", read: false, starred: false, category: "inbox", avatar: "A", important: true },
];

export const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: "bc1", name: "Housing", icon: "home-outline", color: "#4F8EF7", spent: 2100, budget: 2500 },
  { id: "bc2", name: "Food & Dining", icon: "restaurant-outline", color: "#10B981", spent: 680, budget: 800 },
  { id: "bc3", name: "Transportation", icon: "car-outline", color: "#F59E0B", spent: 290, budget: 400 },
  { id: "bc4", name: "Entertainment", icon: "film-outline", color: "#8B5CF6", spent: 185, budget: 200 },
  { id: "bc5", name: "Health", icon: "heart-outline", color: "#EF4444", spent: 120, budget: 300 },
  { id: "bc6", name: "Shopping", icon: "bag-outline", color: "#06B6D4", spent: 430, budget: 500 },
  { id: "bc7", name: "Subscriptions", icon: "card-outline", color: "#F59E0B", spent: 179, budget: 200 },
  { id: "bc8", name: "Savings", icon: "trending-up-outline", color: "#10B981", spent: 1200, budget: 1500 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tr1", title: "Whole Foods Market", amount: -87.43, type: "expense", category: "Food & Dining", date: "Today", icon: "cart-outline", color: "#10B981" },
  { id: "tr2", title: "Salary Deposit", amount: 6250.00, type: "income", category: "Income", date: "Mar 1", icon: "trending-up-outline", color: "#4F8EF7" },
  { id: "tr3", title: "Netflix", amount: -22.99, type: "expense", category: "Entertainment", date: "Mar 1", icon: "tv-outline", color: "#EF4444" },
  { id: "tr4", title: "Uber", amount: -24.50, type: "expense", category: "Transportation", date: "Feb 28", icon: "car-outline", color: "#F59E0B" },
  { id: "tr5", title: "Freelance payment", amount: 1500.00, type: "income", category: "Income", date: "Feb 27", icon: "briefcase-outline", color: "#4F8EF7" },
  { id: "tr6", title: "Gym membership", amount: -49.99, type: "expense", category: "Health", date: "Feb 25", icon: "fitness-outline", color: "#10B981" },
  { id: "tr7", title: "Amazon", amount: -156.78, type: "expense", category: "Shopping", date: "Feb 24", icon: "bag-outline", color: "#F59E0B" },
  { id: "tr8", title: "Rent", amount: -2100.00, type: "expense", category: "Housing", date: "Feb 1", icon: "home-outline", color: "#8B5CF6" },
];

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: "sg1", name: "Emergency Fund", icon: "shield-outline", color: "#10B981", current: 12400, target: 20000, deadline: "Dec 2026" },
  { id: "sg2", name: "Europe Trip", icon: "airplane-outline", color: "#4F8EF7", current: 2100, target: 5000, deadline: "Aug 2026" },
  { id: "sg3", name: "New MacBook", icon: "laptop-outline", color: "#8B5CF6", current: 800, target: 3000, deadline: "Jun 2026" },
  { id: "sg4", name: "Investment Portfolio", icon: "trending-up-outline", color: "#F59E0B", current: 17500, target: 50000, deadline: "Dec 2027" },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: "c1", name: "Sarah Chen", role: "Product Manager", company: "TechCorp", email: "sarah@techcorp.com", phone: "+1 (555) 234-5678", lastContact: "Today", avatar: "SC", aiInsight: "Sarah prefers morning meetings and responds best to data-driven proposals.", tags: ["work", "manager"] },
  { id: "c2", name: "Jordan Lee", role: "Lead Designer", company: "TechCorp", email: "jordan@techcorp.com", phone: "+1 (555) 345-6789", lastContact: "Yesterday", avatar: "JL", aiInsight: "Jordan is highly collaborative and usually has design reviews on Thursdays.", tags: ["work", "design"] },
  { id: "c3", name: "Mike Rodriguez", role: "Senior Engineer", company: "TechCorp", email: "mike@techcorp.com", phone: "+1 (555) 456-7890", lastContact: "2 days ago", avatar: "MR", aiInsight: "Mike is most responsive to async communication via GitHub or Slack.", tags: ["work", "engineering"] },
  { id: "c4", name: "Emily Watson", role: "CFO", company: "TechCorp", email: "emily@techcorp.com", phone: "+1 (555) 567-8901", lastContact: "Last week", avatar: "EW", aiInsight: "Emily reviews budgets on Mondays. Best time to discuss finance requests.", tags: ["work", "leadership"] },
  { id: "c5", name: "David Park", role: "Investor", company: "Sequoia Capital", email: "david@sequoia.com", phone: "+1 (555) 678-9012", lastContact: "3 days ago", avatar: "DP", aiInsight: "David invests in B2B SaaS and prefers quarterly updates. Very network-connected.", tags: ["investor", "vip"] },
  { id: "c6", name: "Lisa Thompson", role: "UX Researcher", company: "TechCorp", email: "lisa@techcorp.com", phone: "+1 (555) 789-0123", lastContact: "4 days ago", avatar: "LT", aiInsight: "Lisa conducts user interviews weekly. Valuable for product validation.", tags: ["work", "research"] },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: "nw1", title: "OpenAI launches GPT-5 with multimodal reasoning capabilities", source: "TechCrunch", category: "AI", time: "2h ago", readTime: "4 min", summary: "OpenAI's latest model demonstrates breakthrough reasoning across text, image, and code modalities, outperforming all benchmarks.", color: "#4F8EF7", saved: false },
  { id: "nw2", title: "Apple unveils iOS 26 with AI-first design language", source: "9to5Mac", category: "Tech", time: "5h ago", readTime: "3 min", summary: "Apple's iOS 26 introduces liquid glass UI, on-device AI processing, and a redesigned home screen with intelligent widgets.", color: "#8B5CF6", saved: true },
  { id: "nw3", title: "Fed holds rates steady; markets rally 2.3%", source: "Bloomberg", category: "Finance", time: "8h ago", readTime: "5 min", summary: "Federal Reserve maintains current interest rate levels, signaling potential cuts later in 2026 as inflation continues to moderate.", color: "#10B981", saved: false },
  { id: "nw4", title: "Stripe raises $6.5B at $95B valuation", source: "WSJ", category: "Finance", time: "1d ago", readTime: "3 min", summary: "Payment giant Stripe closes its largest funding round, with plans to accelerate international expansion and AI-powered financial tools.", color: "#F59E0B", saved: false },
  { id: "nw5", title: "EU passes landmark AI regulation framework", source: "Reuters", category: "Policy", time: "1d ago", readTime: "6 min", summary: "The European Union's comprehensive AI Act enters full enforcement, requiring transparency and safety audits for high-risk AI systems.", color: "#EF4444", saved: true },
  { id: "nw6", title: "Remote work hits 5-year high; office occupancy drops 40%", source: "Forbes", category: "Business", time: "2d ago", readTime: "4 min", summary: "New data shows record numbers of professionals working fully remote, with major cities reporting lowest office occupancy since 2020.", color: "#06B6D4", saved: false },
];

export const MOCK_SHOPPING_LISTS: ShoppingList[] = [
  {
    id: "sl1", name: "Weekly Groceries", color: "#10B981", createdAt: Date.now(),
    items: [
      { id: "si1", name: "Avocados", qty: "4", done: false, category: "Produce" },
      { id: "si2", name: "Almond milk", qty: "2 cartons", done: true, category: "Dairy" },
      { id: "si3", name: "Chicken breast", qty: "1.5 kg", done: false, category: "Meat" },
      { id: "si4", name: "Greek yogurt", qty: "3 packs", done: false, category: "Dairy" },
      { id: "si5", name: "Spinach", qty: "1 bag", done: true, category: "Produce" },
      { id: "si6", name: "Sourdough bread", qty: "1 loaf", done: false, category: "Bakery" },
    ],
  },
  {
    id: "sl2", name: "Home Office Supplies", color: "#4F8EF7", createdAt: Date.now() - 86400000,
    items: [
      { id: "si7", name: "Notebook", qty: "2", done: true, category: "Stationery" },
      { id: "si8", name: "Blue pens", qty: "1 pack", done: false, category: "Stationery" },
      { id: "si9", name: "USB-C hub", qty: "1", done: false, category: "Tech" },
      { id: "si10", name: "Desk lamp", qty: "1", done: false, category: "Furniture" },
    ],
  },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  { id: "j1", date: "Mar 4, 2026", mood: 4, content: "Productive day today. Finished the Q1 review and had a great team standup. Feeling motivated by the roadmap ahead. Need to remember to take breaks more often.", aiPromptUsed: "What made today meaningful?", tags: ["work", "productivity"], wordCount: 38 },
  { id: "j2", date: "Mar 3, 2026", mood: 3, content: "Mixed feelings today. The morning was slow, but the afternoon picked up. Had a great conversation with Sarah about the product direction. Still trying to balance work and personal time.", aiPromptUsed: "What challenged you today?", tags: ["reflection"], wordCount: 42 },
  { id: "j3", date: "Mar 2, 2026", mood: 5, content: "Amazing workout this morning! Hit a new PR on squats. The energy carried through the whole day. Finished all my high-priority tasks and even got ahead on some next-week items.", aiPromptUsed: "Describe your energy today", tags: ["health", "achievement"], wordCount: 40 },
  { id: "j4", date: "Mar 1, 2026", mood: 2, content: "Tough day. The deployment had a bug and we had to roll back. Stressed about the timeline. Tomorrow is a new day and we'll figure it out.", aiPromptUsed: "What would you do differently?", tags: ["work", "stress"], wordCount: 33 },
];

export const MOCK_TRAVEL_PLANS: TravelPlan[] = [
  {
    id: "tp1", destination: "Barcelona", country: "Spain", flag: "ES", startDate: "Jul 15", endDate: "Jul 25", status: "planning", budget: 3000, spent: 450, color: "#F59E0B",
    items: [
      { id: "ti1", label: "Book flights", done: true },
      { id: "ti2", label: "Reserve hotel", done: true },
      { id: "ti3", label: "Travel insurance", done: false },
      { id: "ti4", label: "Book Sagrada Família tour", done: false },
      { id: "ti5", label: "Research restaurants", done: false },
    ],
  },
  {
    id: "tp2", destination: "Tokyo", country: "Japan", flag: "JP", startDate: "Nov 1", endDate: "Nov 14", status: "planning", budget: 5000, spent: 0, color: "#EF4444",
    items: [
      { id: "ti6", label: "Research best areas to stay", done: false },
      { id: "ti7", label: "Book flights", done: false },
      { id: "ti8", label: "Apply for JRPASS", done: false },
    ],
  },
  {
    id: "tp3", destination: "New York", country: "USA", flag: "US", startDate: "Mar 20", endDate: "Mar 23", status: "booked", budget: 1500, spent: 890, color: "#4F8EF7",
    items: [
      { id: "ti9", label: "Book flights", done: true },
      { id: "ti10", label: "Reserve hotel", done: true },
      { id: "ti11", label: "Broadway show tickets", done: true },
      { id: "ti12", label: "Met Museum visit", done: false },
    ],
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: "d1", name: "Passport.pdf", type: "PDF", size: "2.4 MB", updatedAt: "Jan 15", icon: "document-text-outline", color: "#4F8EF7", tags: ["identity", "travel"], aiSummary: "US Passport valid until 2031. Issuer: US Department of State." },
  { id: "d2", name: "Health Insurance Card.pdf", type: "PDF", size: "1.1 MB", updatedAt: "Mar 1", icon: "card-outline", color: "#10B981", tags: ["health", "insurance"], aiSummary: "Blue Cross PPO plan. Group #: 482901. Member ID: A12345678." },
  { id: "d3", name: "Lease Agreement 2026.pdf", type: "PDF", size: "8.7 MB", updatedAt: "Jan 1", icon: "home-outline", color: "#8B5CF6", tags: ["housing", "legal"], aiSummary: "12-month lease at 123 Main St. Expires Dec 31, 2026. Rent: $2,100/mo." },
  { id: "d4", name: "Tax Return 2025.pdf", type: "PDF", size: "4.2 MB", updatedAt: "Apr 15 2025", icon: "receipt-outline", color: "#F59E0B", tags: ["finance", "tax"], aiSummary: "Filed April 2025. Refund: $1,847. Federal + CA State returns included." },
  { id: "d5", name: "Car Insurance Policy.pdf", type: "PDF", size: "3.8 MB", updatedAt: "Feb 1", icon: "car-outline", color: "#EF4444", tags: ["insurance", "car"], aiSummary: "Geico comprehensive coverage. Policy expires Jan 31, 2027. Premium: $147/mo." },
  { id: "d6", name: "Employment Contract.pdf", type: "PDF", size: "1.9 MB", updatedAt: "Sep 1 2025", icon: "briefcase-outline", color: "#06B6D4", tags: ["work", "legal"], aiSummary: "Full-time employment at TechCorp. Start date: Sep 1, 2025. Salary: $125,000." },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "tm1", name: "Sarah Chen", role: "Product Manager", avatar: "SC", status: "online", tasks: 8, completedTasks: 5 },
  { id: "tm2", name: "Jordan Lee", role: "Lead Designer", avatar: "JL", status: "online", tasks: 6, completedTasks: 4 },
  { id: "tm3", name: "Mike Rodriguez", role: "Senior Engineer", avatar: "MR", status: "away", tasks: 12, completedTasks: 9 },
  { id: "tm4", name: "Lisa Thompson", role: "UX Researcher", avatar: "LT", status: "offline", tasks: 5, completedTasks: 5 },
  { id: "tm5", name: "David Kim", role: "Data Analyst", avatar: "DK", status: "online", tasks: 7, completedTasks: 3 },
];

export const MOCK_WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  { id: "wf1", name: "Subscription Audit", description: "Analyze all subscriptions, flag expensive ones, create cancel reminders", steps: 4, lastRun: "2h ago", category: "Finance", icon: "card-outline", color: "#4F8EF7", runs: 12 },
  { id: "wf2", name: "Weekly Summary", description: "Compile task completion, events, and productivity metrics into a report", steps: 5, lastRun: "3 days ago", category: "Productivity", icon: "bar-chart-outline", color: "#8B5CF6", runs: 24 },
  { id: "wf3", name: "Email Triage", description: "Categorize inbox, flag urgent emails, draft quick replies for routine messages", steps: 6, category: "Communication", icon: "mail-outline", color: "#10B981", runs: 8 },
  { id: "wf4", name: "Goal Check-in", description: "Review all active goals, update progress, suggest next actions", steps: 3, lastRun: "1 week ago", category: "Personal", icon: "flag-outline", color: "#F59E0B", runs: 6 },
  { id: "wf5", name: "Budget Review", description: "Analyze monthly spending, compare to budget, highlight overruns", steps: 5, lastRun: "Yesterday", category: "Finance", icon: "pie-chart-outline", color: "#EF4444", runs: 18 },
  { id: "wf6", name: "Morning Briefing", description: "Summarize today's tasks, weather, news, and calendar events", steps: 7, lastRun: "Today", category: "Daily", icon: "sunny-outline", color: "#F59E0B", runs: 48 },
  { id: "wf7", name: "Meeting Prep", description: "Gather context, draft agenda, and set reminders for upcoming meetings", steps: 4, category: "Work", icon: "people-outline", color: "#06B6D4", runs: 15 },
  { id: "wf8", name: "Travel Checklist", description: "Generate packing list, verify bookings, and brief travel itinerary", steps: 5, category: "Travel", icon: "airplane-outline", color: "#8B5CF6", runs: 4 },
];

export const MOCK_HEALTH_METRICS: HealthMetric[] = [
  { id: "hm1", label: "Steps Today", value: "7,842", unit: "steps", icon: "walk-outline", color: "#10B981", trend: "up", trendValue: "+12%" },
  { id: "hm2", label: "Sleep", value: "7.2", unit: "hrs", icon: "moon-outline", color: "#8B5CF6", trend: "stable", trendValue: "avg 7.1" },
  { id: "hm3", label: "Heart Rate", value: "68", unit: "bpm", icon: "heart-outline", color: "#EF4444", trend: "down", trendValue: "-3 bpm" },
  { id: "hm4", label: "Water Intake", value: "1.4", unit: "L", icon: "water-outline", color: "#06B6D4", trend: "down", trendValue: "-0.6L" },
  { id: "hm5", label: "Calories Burned", value: "2,147", unit: "kcal", icon: "flame-outline", color: "#F59E0B", trend: "up", trendValue: "+180 kcal" },
  { id: "hm6", label: "Active Minutes", value: "48", unit: "min", icon: "timer-outline", color: "#4F8EF7", trend: "up", trendValue: "+8 min" },
];

export const MOCK_WEATHER: WeatherDay[] = [
  { day: "Today", icon: "partly-sunny-outline", high: 68, low: 54, condition: "Partly Cloudy" },
  { day: "Wed", icon: "sunny-outline", high: 72, low: 56, condition: "Sunny" },
  { day: "Thu", icon: "rainy-outline", high: 61, low: 50, condition: "Rainy" },
  { day: "Fri", icon: "cloudy-outline", high: 64, low: 52, condition: "Cloudy" },
  { day: "Sat", icon: "sunny-outline", high: 75, low: 58, condition: "Sunny" },
  { day: "Sun", icon: "partly-sunny-outline", high: 70, low: 55, condition: "Partly Cloudy" },
  { day: "Mon", icon: "thunderstorm-outline", high: 58, low: 48, condition: "Thunderstorms" },
];

export const MOCK_WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: "wr1", name: "Subscription Audit", description: "Analyze all subscriptions and flag expensive ones",
    icon: "card-outline", color: "#4F8EF7", status: "done", triggeredAt: "2h ago",
    steps: [
      { id: "s1", label: "Fetch subscription data", status: "done", detail: "8 active subscriptions found" },
      { id: "s2", label: "Analyze spending patterns", status: "done", detail: "4 flagged as expensive" },
      { id: "s3", label: "Create cancel reminders", status: "done", detail: "2 reminders scheduled" },
      { id: "s4", label: "Generate summary report", status: "done", detail: "Analysis complete" },
    ],
  },
  {
    id: "wr2", name: "Weekly Summary", description: "Compile weekly productivity metrics",
    icon: "bar-chart-outline", color: "#8B5CF6", status: "done", triggeredAt: "3 days ago",
    steps: [
      { id: "s1", label: "Aggregate weekly data", status: "done", detail: "Tasks, calendar, finance" },
      { id: "s2", label: "Calculate productivity score", status: "done", detail: "Score: 87% — up 12%" },
      { id: "s3", label: "Generate insights", status: "done", detail: "3 key recommendations" },
    ],
  },
  {
    id: "wr3", name: "Morning Briefing", description: "Summarize today's tasks, weather and calendar",
    icon: "sunny-outline", color: "#F59E0B", status: "done", triggeredAt: "Today, 7:00 AM",
    steps: [
      { id: "s1", label: "Load today's tasks", status: "done", detail: "9 pending tasks" },
      { id: "s2", label: "Check calendar events", status: "done", detail: "3 events today" },
      { id: "s3", label: "Fetch weather data", status: "done", detail: "68°F, partly cloudy" },
      { id: "s4", label: "Compile briefing", status: "done", detail: "Ready" },
    ],
  },
  {
    id: "wr4", name: "Budget Review", description: "Analyze monthly spending vs budget",
    icon: "pie-chart-outline", color: "#EF4444", status: "failed", triggeredAt: "Yesterday",
    steps: [
      { id: "s1", label: "Load transaction data", status: "done", detail: "8 transactions loaded" },
      { id: "s2", label: "Compare to budget", status: "done", detail: "1 category at risk" },
      { id: "s3", label: "Generate forecast", status: "failed", detail: "Insufficient data" },
    ],
  },
  {
    id: "wr5", name: "Email Triage", description: "Categorize inbox and draft replies",
    icon: "mail-outline", color: "#10B981", status: "pending", triggeredAt: "Queued",
    steps: [
      { id: "s1", label: "Scan inbox", status: "pending" },
      { id: "s2", label: "Categorize emails", status: "pending" },
      { id: "s3", label: "Draft replies", status: "pending" },
    ],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "notif1", type: "ai", title: "Aria completed your workflow", body: "Subscription audit finished — 4 services flagged as expensive, saving $82.97/mo possible", time: "Just now", read: false, icon: "sparkles", color: "#4F8EF7", group: "today" },
  { id: "notif2", type: "reminder", title: "Cancel Netflix reminder", body: "Your reminder to review Netflix subscription is due today at 6:00 PM", time: "2h ago", read: false, icon: "alarm-outline", color: "#F59E0B", group: "today" },
  { id: "notif3", type: "finance", title: "Credit card payment due", body: "American Express payment of $1,247.33 is due tomorrow, March 5", time: "3h ago", read: false, icon: "card-outline", color: "#EF4444", group: "today" },
  { id: "notif4", type: "task", title: "3 tasks due today", body: "Review Q1 report, Cancel streaming services, Call mom — all due today", time: "5h ago", read: true, icon: "checkmark-circle-outline", color: "#10B981", group: "today" },
  { id: "notif5", type: "team", title: "Sarah requested a review", body: "Sarah Chen added you as reviewer on 'Q1 Strategy Document'", time: "Yesterday", read: true, icon: "people-outline", color: "#8B5CF6", group: "earlier" },
  { id: "notif6", type: "ai", title: "Weekly report ready", body: "Your AI-generated weekly summary for Feb 25 – Mar 3 is available", time: "Yesterday", read: true, icon: "document-text-outline", color: "#4F8EF7", group: "earlier" },
  { id: "notif7", type: "reminder", title: "Dentist appointment tomorrow", body: "Routine checkup at Dr. Smith's office — 2:30 PM, March 5", time: "2 days ago", read: true, icon: "calendar-outline", color: "#06B6D4", group: "earlier" },
];

export const MOCK_ANALYTICS: AnalyticsPeriodMap = {
  "7D": {
    productivityScore: 87,
    productivityDelta: 12,
    dailyScores: [72, 68, 85, 90, 88, 82, 87],
    tasksDone: 7,
    tasksDelta: 3,
    focusHours: 22,
    focusDelta: 4,
    habitStreak: 14,
    habitDelta: 2,
    avgMood: "Good",
    moodDelta: "+0.4",
    categories: [
      { name: "Work", pct: 45, color: "#4F8EF7" },
      { name: "Health", pct: 20, color: "#10B981" },
      { name: "Personal", pct: 20, color: "#8B5CF6" },
      { name: "Finance", pct: 15, color: "#F59E0B" },
    ],
    insights: [
      "Your peak productivity is between 9–11 AM. Schedule deep work then.",
      "You completed 87% of tasks this week — up from 75% last week.",
      "3 habits missed on weekend days. Try a lighter weekend routine.",
    ],
  },
  "30D": {
    productivityScore: 81,
    productivityDelta: 8,
    dailyScores: [65, 70, 75, 80, 78, 82, 85, 79, 72, 88, 84, 77, 80, 83, 76, 71, 69, 74, 81, 86, 83, 78, 85, 88, 82, 79, 84, 87, 90, 81],
    tasksDone: 28,
    tasksDelta: 6,
    focusHours: 88,
    focusDelta: 14,
    habitStreak: 21,
    habitDelta: 5,
    avgMood: "Good",
    moodDelta: "+0.6",
    categories: [
      { name: "Work", pct: 48, color: "#4F8EF7" },
      { name: "Health", pct: 18, color: "#10B981" },
      { name: "Personal", pct: 22, color: "#8B5CF6" },
      { name: "Finance", pct: 12, color: "#F59E0B" },
    ],
    insights: [
      "March has been your most productive month this quarter.",
      "Sleep quality correlates strongly with your next-day task completion.",
      "Finance tasks consistently get pushed — consider time-blocking them.",
    ],
  },
  "90D": {
    productivityScore: 76,
    productivityDelta: 5,
    dailyScores: [60, 65, 70, 68, 72, 75, 73, 78, 80, 77, 82, 79, 76, 81, 84, 82, 78, 80, 83, 85, 79, 76, 81, 83, 87, 84, 80, 85, 88, 82],
    tasksDone: 84,
    tasksDelta: 12,
    focusHours: 264,
    focusDelta: 36,
    habitStreak: 21,
    habitDelta: -3,
    avgMood: "Okay",
    moodDelta: "+0.2",
    categories: [
      { name: "Work", pct: 50, color: "#4F8EF7" },
      { name: "Health", pct: 16, color: "#10B981" },
      { name: "Personal", pct: 20, color: "#8B5CF6" },
      { name: "Finance", pct: 14, color: "#F59E0B" },
    ],
    insights: [
      "Q1 showed a steady improvement trend — great momentum heading into Q2.",
      "You averaged 2.9 focus sessions per day, slightly below your 3.5 goal.",
      "Health habits dropped in February. Consider a habit review each month.",
    ],
  },
  "1Y": {
    productivityScore: 72,
    productivityDelta: 18,
    dailyScores: [55, 58, 62, 65, 70, 68, 72, 74, 71, 76, 78, 80],
    tasksDone: 312,
    tasksDelta: 48,
    focusHours: 1040,
    focusDelta: 160,
    habitStreak: 21,
    habitDelta: 8,
    avgMood: "Good",
    moodDelta: "+1.2",
    categories: [
      { name: "Work", pct: 52, color: "#4F8EF7" },
      { name: "Health", pct: 15, color: "#10B981" },
      { name: "Personal", pct: 19, color: "#8B5CF6" },
      { name: "Finance", pct: 14, color: "#F59E0B" },
    ],
    insights: [
      "You've improved productivity by 18% year-over-year — remarkable growth.",
      "Q3 was your strongest quarter; Q1 this year is already tracking higher.",
      "Annual focus time of 1,040 hours equals ~4 hours of deep work per weekday.",
    ],
  },
};

export const MOCK_CONVERSATIONS = [
  {
    id: "conv1",
    title: "Subscription analysis",
    preview: "Check my subscriptions and flag expensive ones...",
    lastMessage: "2h ago",
    messages: [
      {
        id: "m1",
        role: "user" as const,
        content: "Check my subscriptions, list the expensive ones, and schedule reminders to cancel unnecessary ones.",
        timestamp: Date.now() - 7200000,
      },
      {
        id: "m2",
        role: "assistant" as const,
        content: "Running OpenClaw workflow to analyze your subscriptions...\n\nI found **4 subscriptions** that are costing you significantly:\n\n• **Adobe CC** — $59.99/mo (highest spend)\n• **LinkedIn Premium** — $39.99/mo\n• **Netflix** — $22.99/mo\n• **Hulu** — $17.99/mo\n\nTotal monthly spend across all services: **$178.93**\n\nI've scheduled cancel reminders for Netflix (Mar 15) and Hulu (Mar 22) in your calendar. Want me to also draft cancellation emails for these services?",
        timestamp: Date.now() - 7180000,
        workflow: [
          { id: "w1", label: "Fetch subscription data", status: "done" as const, detail: "8 active subscriptions found" },
          { id: "w2", label: "Analyze spending patterns", status: "done" as const, detail: "4 flagged as expensive (>$15/mo)" },
          { id: "w3", label: "Create calendar reminders", status: "done" as const, detail: "2 reminders scheduled" },
          { id: "w4", label: "Generate summary report", status: "done" as const, detail: "Analysis complete" },
        ],
      },
    ],
  },
  {
    id: "conv2",
    title: "Weekly productivity summary",
    preview: "Here's your weekly summary with AI insights...",
    lastMessage: "Yesterday",
    messages: [
      { id: "m3", role: "user" as const, content: "Give me a weekly productivity summary", timestamp: Date.now() - 86400000 },
      { id: "m4", role: "assistant" as const, content: "**Weekly Summary — Feb 25 – Mar 3**\n\nProductivity score: **87%** ↑12%\nTasks completed: **7 / 10**\nCalendar events: **9 attended**\nFocus hours logged: **22.5 hrs**\n\n**Top wins:**\n• Shipped the dashboard redesign\n• Completed Q1 financial review\n• Maintained 21-day exercise streak\n\n**This week's priority:** Tackle the 3 high-priority pending tasks before the quarterly review.", timestamp: Date.now() - 86300000, workflow: [{ id: "w1", label: "Aggregate weekly data", status: "done" as const, detail: "Tasks, calendar, finance" }, { id: "w2", label: "Calculate score", status: "done" as const, detail: "87% — up 12%" }] },
    ],
  },
];

export const WORKFLOW_TEMPLATES = [
  { id: "wt1", label: "Analyze my subscriptions", icon: "card-outline" },
  { id: "wt2", label: "Summarize my week", icon: "bar-chart-outline" },
  { id: "wt3", label: "Schedule my tasks", icon: "calendar-outline" },
  { id: "wt4", label: "Check upcoming bills", icon: "receipt-outline" },
];

export const AI_TOOLS = [
  { id: "at1", name: "Email Writer", icon: "mail-outline", color: "#4F8EF7", desc: "Draft professional emails in seconds" },
  { id: "at2", name: "Summarizer", icon: "list-outline", color: "#8B5CF6", desc: "Condense long documents instantly" },
  { id: "at3", name: "Translator", icon: "language-outline", color: "#10B981", desc: "Translate to 50+ languages" },
  { id: "at4", name: "Code Helper", icon: "code-slash-outline", color: "#F59E0B", desc: "Debug and explain code" },
  { id: "at5", name: "Meeting Notes", icon: "mic-outline", color: "#06B6D4", desc: "AI-structured meeting summaries" },
  { id: "at6", name: "Idea Generator", icon: "bulb-outline", color: "#EF4444", desc: "Brainstorm with AI assistance" },
];

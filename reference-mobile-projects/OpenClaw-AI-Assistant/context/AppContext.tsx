import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChatMessage, Task, CalendarEvent, Subscription, WorkflowStep,
  Note, Habit, Goal, Email, BudgetCategory, Transaction, SavingsGoal,
  Contact, NewsItem, ShoppingList, ShoppingItem, JournalEntry, TravelPlan, Document, TeamMember,
  WorkflowTemplate, WorkflowRun, HealthMetric, Notification, AnalyticsPeriodMap,
  MOCK_TASKS, MOCK_EVENTS, MOCK_SUBSCRIPTIONS, MOCK_CONVERSATIONS,
  MOCK_NOTES, MOCK_HABITS, MOCK_GOALS, MOCK_EMAILS, MOCK_BUDGET_CATEGORIES,
  MOCK_TRANSACTIONS, MOCK_SAVINGS_GOALS, MOCK_CONTACTS, MOCK_NEWS,
  MOCK_SHOPPING_LISTS, MOCK_JOURNAL_ENTRIES, MOCK_TRAVEL_PLANS, MOCK_DOCUMENTS,
  MOCK_TEAM_MEMBERS, MOCK_WORKFLOW_TEMPLATES, MOCK_WORKFLOW_RUNS, MOCK_HEALTH_METRICS, MOCK_NOTIFICATIONS,
  MOCK_ANALYTICS,
} from "@/constants/mockData";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  lastMessage: string;
  messages: ChatMessage[];
}

interface AppContextValue {
  tasks: Task[];
  events: CalendarEvent[];
  subscriptions: Subscription[];
  conversations: Conversation[];
  activeConversationId: string | null;
  isPremium: boolean;
  notes: Note[];
  habits: Habit[];
  goals: Goal[];
  emails: Email[];
  budgetCategories: BudgetCategory[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  contacts: Contact[];
  news: NewsItem[];
  shoppingLists: ShoppingList[];
  journalEntries: JournalEntry[];
  travelPlans: TravelPlan[];
  documents: Document[];
  teamMembers: TeamMember[];
  workflowTemplates: WorkflowTemplate[];
  workflowRuns: WorkflowRun[];
  healthMetrics: HealthMetric[];
  notifications: Notification[];
  analytics: AnalyticsPeriodMap;

  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  toggleCancelReminder: (subId: string) => void;
  setIsPremium: (val: boolean) => void;
  toggleHabit: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "updatedAt">) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNewsItem: (id: string) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;
  addShoppingItem: (listId: string, item: Omit<ShoppingItem, "id">) => void;
  addShoppingList: (list: Omit<ShoppingList, "id" | "createdAt">) => void;
  markEmailRead: (id: string) => void;
  toggleEmailStar: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateGoalProgress: (id: string, progress: number) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;

  totalMonthlySpend: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  unreadEmailCount: number;
  unreadNotificationCount: number;
  totalBudget: number;
  totalSpent: number;
}

const AppContext = createContext<AppContextValue | null>(null);

const AI_RESPONSES: Record<string, { content: string; workflow?: WorkflowStep[] }> = {
  default: {
    content: "I've processed your request. Here's what I found:\n\nYour productivity score is **87%** this week — up 12% from last week. You have **3 high-priority tasks** pending today.\n\nWould you like me to prioritize and reschedule any of them?",
  },
  subscription: {
    content: "Running OpenClaw workflow to analyze your subscriptions...\n\nI found **4 subscriptions** costing you significantly:\n\n• **Adobe CC** — $59.99/mo\n• **LinkedIn Premium** — $39.99/mo\n• **Netflix** — $22.99/mo\n• **Hulu** — $17.99/mo\n\nTotal monthly spend: **$178.93**\n\nI've flagged these as expensive and can schedule cancel reminders. Should I proceed?",
    workflow: [
      { id: "w1", label: "Fetch subscription data", status: "done", detail: "8 active subscriptions found" },
      { id: "w2", label: "Analyze spending patterns", status: "done", detail: "4 flagged as expensive" },
      { id: "w3", label: "Generate cost report", status: "done", detail: "Monthly total: $178.93" },
    ],
  },
  calendar: {
    content: "I've reviewed your calendar for the next 7 days:\n\n**Today (Mar 4)**\n• 9:00 AM — Team Standup\n• 6:00 PM — Netflix cancel reminder\n\n**Tomorrow (Mar 5)**\n• 12:00 PM — Pay credit card\n• 2:30 PM — Dentist\n\nYou have **2 conflicts** on Mar 6. Want me to reschedule the lower-priority one?",
    workflow: [
      { id: "w1", label: "Load calendar events", status: "done", detail: "10 events found" },
      { id: "w2", label: "Detect scheduling conflicts", status: "done", detail: "2 conflicts on Mar 6" },
      { id: "w3", label: "Suggest resolutions", status: "done", detail: "1 rescheduling option ready" },
    ],
  },
  task: {
    content: "Here's your task summary:\n\n**High Priority** (3 pending)\n• Review Q1 financial report — due today\n• Pay credit card bill — due tomorrow\n• Cancel unused streaming services — due today\n\n**Medium Priority** (2 pending)\n• Schedule dentist appointment\n• Call mom\n\nShall I create a focused work session for today's high-priority tasks?",
    workflow: [
      { id: "w1", label: "Load task database", status: "done", detail: "12 tasks loaded" },
      { id: "w2", label: "Prioritize by urgency", status: "done", detail: "3 high-priority today" },
      { id: "w3", label: "Build action plan", status: "done", detail: "Session plan ready" },
    ],
  },
  week: {
    content: "**Weekly Summary — Week of Mar 4**\n\nProductivity: **87%** ↑12%\nTasks completed: **7 / 12**\nSubscription savings identified: **$40.98/mo**\nCalendar events attended: **5**\nHabits maintained: **4 / 7**\n\n**Top recommendation**: Schedule 2hr deep work blocks each morning to tackle your high-priority backlog.\n\nGreat week overall — you're trending upward!",
    workflow: [
      { id: "w1", label: "Aggregate weekly data", status: "done", detail: "Tasks, calendar, finance, habits" },
      { id: "w2", label: "Calculate productivity score", status: "done", detail: "Score: 87%" },
      { id: "w3", label: "Generate insights", status: "done", detail: "3 key recommendations" },
    ],
  },
  email: {
    content: "I've analyzed your inbox:\n\n**7 emails** — 4 unread\n\n**Urgent:**\n• AmEx payment reminder ($1,247.33 due Mar 5)\n• Mike's PR review request\n\n**Action required:**\n• Sarah's Q1 review items — 3 tasks assigned to you\n• Jordan's design system approval\n\nWant me to draft quick replies for the routine emails?",
    workflow: [
      { id: "w1", label: "Scan inbox", status: "done", detail: "7 emails analyzed" },
      { id: "w2", label: "Flag urgent items", status: "done", detail: "2 urgent, 2 action needed" },
      { id: "w3", label: "Generate reply drafts", status: "done", detail: "2 drafts ready" },
    ],
  },
  budget: {
    content: "Budget analysis for March 2026:\n\n**Total budget:** $5,900/mo\n**Spent so far:** $4,004\n\n**On track:** Housing, Food, Transport, Entertainment\n**Approaching limit:** Shopping (86% used)\n**Under budget:** Health (40% used)\n\n**Insight:** You're 8 days into March but have spent 68% of your monthly budget. Consider reducing dining out this week.",
    workflow: [
      { id: "w1", label: "Load transaction data", status: "done", detail: "8 transactions this month" },
      { id: "w2", label: "Compare to budget", status: "done", detail: "1 category at risk" },
      { id: "w3", label: "Generate spending forecast", status: "done", detail: "On pace to hit budget" },
    ],
  },
  health: {
    content: "Health check for today:\n\n• Steps: **7,842** (78% of 10K goal)\n• Sleep: **7.2 hrs** (on target)\n• Heart rate: **68 bpm** (excellent)\n• Water: **1.4L** (below 2L goal)\n• Active minutes: **48 min** ✓\n\n**Habits today:** Meditation ✓, Exercise ✓, Gratitude ✓\n\n**Drink 600ml more water** to hit your daily goal!",
    workflow: [
      { id: "w1", label: "Sync health metrics", status: "done", detail: "6 metrics loaded" },
      { id: "w2", label: "Compare to goals", status: "done", detail: "4/6 goals met" },
      { id: "w3", label: "Generate recommendations", status: "done", detail: "2 action items" },
    ],
  },
};

function pickAIResponse(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("subscri") || lower.includes("cancel") || lower.includes("netflix")) return AI_RESPONSES.subscription;
  if (lower.includes("calendar") || lower.includes("schedule") || lower.includes("appointment")) return AI_RESPONSES.calendar;
  if (lower.includes("task") || lower.includes("todo") || lower.includes("priority")) return AI_RESPONSES.task;
  if (lower.includes("week") || lower.includes("summary") || lower.includes("report")) return AI_RESPONSES.week;
  if (lower.includes("email") || lower.includes("inbox") || lower.includes("mail")) return AI_RESPONSES.email;
  if (lower.includes("budget") || lower.includes("spend") || lower.includes("money")) return AI_RESPONSES.budget;
  if (lower.includes("health") || lower.includes("step") || lower.includes("sleep") || lower.includes("water")) return AI_RESPONSES.health;
  return AI_RESPONSES.default;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS as Conversation[]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isPremium, setIsPremiumState] = useState(false);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [budgetCategories] = useState<BudgetCategory[]>(MOCK_BUDGET_CATEGORIES);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [savingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(MOCK_SHOPPING_LISTS);
  const [journalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [travelPlans] = useState<TravelPlan[]>(MOCK_TRAVEL_PLANS);
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [workflowTemplates] = useState<WorkflowTemplate[]>(MOCK_WORKFLOW_TEMPLATES);
  const [workflowRuns] = useState<WorkflowRun[]>(MOCK_WORKFLOW_RUNS);
  const [healthMetrics] = useState<HealthMetric[]>(MOCK_HEALTH_METRICS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const analytics = MOCK_ANALYTICS;

  useEffect(() => {
    AsyncStorage.getItem("aria_premium").then((val) => { if (val === "true") setIsPremiumState(true); });
  }, []);

  const setIsPremium = (val: boolean) => {
    setIsPremiumState(val);
    AsyncStorage.setItem("aria_premium", val ? "true" : "false");
  };

  const totalMonthlySpend = useMemo(() => subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + (s.billingCycle === "yearly" ? s.price / 12 : s.price), 0), [subscriptions]);
  const completedTasksCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const pendingTasksCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);
  const unreadEmailCount = useMemo(() => emails.filter((e) => !e.read).length, [emails]);
  const unreadNotificationCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const totalBudget = useMemo(() => budgetCategories.reduce((s, c) => s + c.budget, 0), [budgetCategories]);
  const totalSpent = useMemo(() => budgetCategories.reduce((s, c) => s + c.spent, 0), [budgetCategories]);

  const createConversation = () => {
    const id = `conv_${Date.now()}`;
    setConversations((prev) => [{ id, title: "New conversation", preview: "Ask me anything...", lastMessage: "Just now", messages: [] }, ...prev]);
    return id;
  };

  const deleteConversation = (id: string) => setConversations((prev) => prev.filter((c) => c.id !== id));

  const sendMessage = async (conversationId: string, text: string) => {
    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, role: "user", content: text, timestamp: Date.now() };
    setConversations((prev) => prev.map((c) => c.id !== conversationId ? c : { ...c, title: c.messages.length === 0 ? text.slice(0, 40) : c.title, preview: text, lastMessage: "Just now", messages: [...c.messages, userMsg] }));
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const aiResponse = pickAIResponse(text);
    const assistantMsg: ChatMessage = { id: `msg_${Date.now() + 1}`, role: "assistant", content: aiResponse.content, timestamp: Date.now(), workflow: aiResponse.workflow };
    setConversations((prev) => prev.map((c) => c.id !== conversationId ? c : { ...c, lastMessage: "Just now", messages: [...c.messages, assistantMsg] }));
  };

  const toggleTask = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = (task: Omit<Task, "id">) => setTasks((prev) => [{ ...task, id: `t_${Date.now()}` }, ...prev]);
  const addEvent = (event: Omit<CalendarEvent, "id">) => setEvents((prev) => [{ ...event, id: `e_${Date.now()}` }, ...prev]);
  const toggleCancelReminder = (subId: string) => setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, cancelReminder: !s.cancelReminder } : s));
  const toggleHabit = (id: string) => setHabits((prev) => prev.map((h) => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1) } : h));
  const addNote = (note: Omit<Note, "id" | "updatedAt">) => { const id = `n_${Date.now()}`; setNotes((prev) => [{ ...note, id, updatedAt: Date.now() }, ...prev]); return id; };
  const updateNote = (id: string, updates: Partial<Note>) => setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const toggleNewsItem = (id: string) => setNews((prev) => prev.map((n) => n.id === id ? { ...n, saved: !n.saved } : n));
  const toggleShoppingItem = (listId: string, itemId: string) => setShoppingLists((prev) => prev.map((l) => l.id !== listId ? l : { ...l, items: l.items.map((i) => i.id === itemId ? { ...i, done: !i.done } : i) }));
  const addShoppingItem = (listId: string, item: Omit<ShoppingItem, "id">) => setShoppingLists((prev) => prev.map((l) => l.id !== listId ? l : { ...l, items: [...l.items, { ...item, id: `si_${Date.now()}` }] }));
  const addShoppingList = (list: Omit<ShoppingList, "id" | "createdAt">) => setShoppingLists((prev) => [{ ...list, id: `sl_${Date.now()}`, createdAt: Date.now() }, ...prev]);
  const markEmailRead = (id: string) => setEmails((prev) => prev.map((e) => e.id === id ? { ...e, read: true } : e));
  const toggleEmailStar = (id: string) => setEmails((prev) => prev.map((e) => e.id === id ? { ...e, starred: !e.starred } : e));
  const markNotificationRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const updateGoalProgress = (id: string, progress: number) => setGoals((prev) => prev.map((g) => g.id === id ? { ...g, progress } : g));
  const toggleGoalMilestone = (goalId: string, milestoneId: string) => setGoals((prev) => prev.map((g) => {
    if (g.id !== goalId) return g;
    const updatedMilestones = g.milestones.map((m) => m.id === milestoneId ? { ...m, done: !m.done } : m);
    const doneMilestones = updatedMilestones.filter((m) => m.done).length;
    const progress = Math.round((doneMilestones / Math.max(updatedMilestones.length, 1)) * 100);
    return { ...g, milestones: updatedMilestones, progress };
  }));

  const value = useMemo(() => ({
    tasks, events, subscriptions, conversations, activeConversationId, isPremium,
    notes, habits, goals, emails, budgetCategories, transactions, savingsGoals,
    contacts, news, shoppingLists, journalEntries, travelPlans, documents,
    teamMembers, workflowTemplates, workflowRuns, healthMetrics, notifications, analytics,
    setActiveConversationId, sendMessage, createConversation, deleteConversation,
    toggleTask, addTask, addEvent, toggleCancelReminder, setIsPremium,
    toggleHabit, addNote, updateNote, deleteNote, toggleNewsItem,
    toggleShoppingItem, addShoppingItem, addShoppingList, markEmailRead, toggleEmailStar,
    markNotificationRead, markAllNotificationsRead, updateGoalProgress, toggleGoalMilestone,
    totalMonthlySpend, completedTasksCount, pendingTasksCount,
    unreadEmailCount, unreadNotificationCount, totalBudget, totalSpent,
  }), [tasks, events, subscriptions, conversations, activeConversationId, isPremium, notes, habits, goals, emails, news, shoppingLists, notifications, totalMonthlySpend, completedTasksCount, pendingTasksCount, unreadEmailCount, unreadNotificationCount, totalSpent]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

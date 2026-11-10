import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";
import {
  generateMockCampaigns,
  generateMockLeads,
  generateMockInboxMessages,
  generateMockAITemplates,
  generateMockVoiceNotes,
  generateMockLinkedInAccounts,
  generateMockTeamMembers,
  generateMockProxies,
  generateMockIntegrations,
  generateMockWebhooks,
  generateMockApiKeys,
  generateMockBlacklist,
  generateMockTags,
  generateMockExports,
  generateMockActivityLog,
  generateMockNotifications,
  generateMockSettings,
  generateMockBilling,
  generateMockAnalytics,
  type Campaign,
  type Lead,
  type InboxMessage,
  type AITemplate,
  type VoiceNote,
  type LinkedInAccount,
  type TeamMember,
  type Proxy,
  type Integration,
  type WebhookConfig,
  type ApiKey,
  type BlacklistEntry,
  type Tag,
  type ExportJob,
  type ActivityLogEntry,
  type Notification,
  type UserSettings,
  type BillingInfo,
  type AnalyticsData,
} from "@/lib/mock-data";
import { createContext, useContext, type ReactNode, useMemo, useCallback } from "react";

interface DataContextType {
  campaigns: Campaign[];
  setCampaigns: (v: Campaign[] | ((p: Campaign[]) => Campaign[])) => void;
  leads: Lead[];
  setLeads: (v: Lead[] | ((p: Lead[]) => Lead[])) => void;
  inboxMessages: InboxMessage[];
  setInboxMessages: (v: InboxMessage[] | ((p: InboxMessage[]) => InboxMessage[])) => void;
  aiTemplates: AITemplate[];
  setAITemplates: (v: AITemplate[] | ((p: AITemplate[]) => AITemplate[])) => void;
  voiceNotes: VoiceNote[];
  setVoiceNotes: (v: VoiceNote[] | ((p: VoiceNote[]) => VoiceNote[])) => void;
  linkedinAccounts: LinkedInAccount[];
  setLinkedinAccounts: (v: LinkedInAccount[] | ((p: LinkedInAccount[]) => LinkedInAccount[])) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (v: TeamMember[] | ((p: TeamMember[]) => TeamMember[])) => void;
  proxies: Proxy[];
  setProxies: (v: Proxy[] | ((p: Proxy[]) => Proxy[])) => void;
  integrations: Integration[];
  setIntegrations: (v: Integration[] | ((p: Integration[]) => Integration[])) => void;
  webhooks: WebhookConfig[];
  setWebhooks: (v: WebhookConfig[] | ((p: WebhookConfig[]) => WebhookConfig[])) => void;
  apiKeys: ApiKey[];
  setApiKeys: (v: ApiKey[] | ((p: ApiKey[]) => ApiKey[])) => void;
  blacklist: BlacklistEntry[];
  setBlacklist: (v: BlacklistEntry[] | ((p: BlacklistEntry[]) => BlacklistEntry[])) => void;
  tags: Tag[];
  setTags: (v: Tag[] | ((p: Tag[]) => Tag[])) => void;
  exports: ExportJob[];
  setExports: (v: ExportJob[] | ((p: ExportJob[]) => ExportJob[])) => void;
  activityLog: ActivityLogEntry[];
  setActivityLog: (v: ActivityLogEntry[] | ((p: ActivityLogEntry[]) => ActivityLogEntry[])) => void;
  notifications: Notification[];
  setNotifications: (v: Notification[] | ((p: Notification[]) => Notification[])) => void;
  settings: UserSettings;
  setSettings: (v: UserSettings | ((p: UserSettings) => UserSettings)) => void;
  billing: BillingInfo;
  setBilling: (v: BillingInfo | ((p: BillingInfo) => BillingInfo)) => void;
  analytics: AnalyticsData;
  setAnalytics: (v: AnalyticsData | ((p: AnalyticsData) => AnalyticsData)) => void;
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>(STORAGE_KEYS.campaigns, generateMockCampaigns());
  const [leads, setLeads] = useLocalStorage<Lead[]>(STORAGE_KEYS.leads, generateMockLeads());
  const [inboxMessages, setInboxMessages] = useLocalStorage<InboxMessage[]>(STORAGE_KEYS.inboxMessages, generateMockInboxMessages());
  const [aiTemplates, setAITemplates] = useLocalStorage<AITemplate[]>(STORAGE_KEYS.aiTemplates, generateMockAITemplates());
  const [voiceNotes, setVoiceNotes] = useLocalStorage<VoiceNote[]>(STORAGE_KEYS.voiceNotes, generateMockVoiceNotes());
  const [linkedinAccounts, setLinkedinAccounts] = useLocalStorage<LinkedInAccount[]>(STORAGE_KEYS.linkedinAccounts, generateMockLinkedInAccounts());
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>(STORAGE_KEYS.teamMembers, generateMockTeamMembers());
  const [proxies, setProxies] = useLocalStorage<Proxy[]>(STORAGE_KEYS.proxies, generateMockProxies());
  const [integrations, setIntegrations] = useLocalStorage<Integration[]>(STORAGE_KEYS.integrations, generateMockIntegrations());
  const [webhooks, setWebhooks] = useLocalStorage<WebhookConfig[]>(STORAGE_KEYS.webhooks, generateMockWebhooks());
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>(STORAGE_KEYS.apiKeys, generateMockApiKeys());
  const [blacklist, setBlacklist] = useLocalStorage<BlacklistEntry[]>(STORAGE_KEYS.blacklist, generateMockBlacklist());
  const [tags, setTags] = useLocalStorage<Tag[]>(STORAGE_KEYS.tags, generateMockTags());
  const [exports, setExports] = useLocalStorage<ExportJob[]>(STORAGE_KEYS.exports, generateMockExports());
  const [activityLog, setActivityLog] = useLocalStorage<ActivityLogEntry[]>(STORAGE_KEYS.activityLog, generateMockActivityLog());
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(STORAGE_KEYS.notifications, generateMockNotifications());
  const [settings, setSettings] = useLocalStorage<UserSettings>(STORAGE_KEYS.settings, generateMockSettings());
  const [billing, setBilling] = useLocalStorage<BillingInfo>(STORAGE_KEYS.billing, generateMockBilling());
  const [analytics, setAnalytics] = useLocalStorage<AnalyticsData>(STORAGE_KEYS.analytics, generateMockAnalytics());

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, [setNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const value = useMemo<DataContextType>(
    () => ({
      campaigns, setCampaigns,
      leads, setLeads,
      inboxMessages, setInboxMessages,
      aiTemplates, setAITemplates,
      voiceNotes, setVoiceNotes,
      linkedinAccounts, setLinkedinAccounts,
      teamMembers, setTeamMembers,
      proxies, setProxies,
      integrations, setIntegrations,
      webhooks, setWebhooks,
      apiKeys, setApiKeys,
      blacklist, setBlacklist,
      tags, setTags,
      exports, setExports,
      activityLog, setActivityLog,
      notifications, setNotifications,
      settings, setSettings,
      billing, setBilling,
      analytics, setAnalytics,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [campaigns, leads, inboxMessages, aiTemplates, voiceNotes, linkedinAccounts, teamMembers, proxies, integrations, webhooks, apiKeys, blacklist, tags, exports, activityLog, notifications, settings, billing, analytics, unreadCount, setCampaigns, setLeads, setInboxMessages, setAITemplates, setVoiceNotes, setLinkedinAccounts, setTeamMembers, setProxies, setIntegrations, setWebhooks, setApiKeys, setBlacklist, setTags, setExports, setActivityLog, setNotifications, setSettings, setBilling, setAnalytics, markNotificationRead, markAllNotificationsRead]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}

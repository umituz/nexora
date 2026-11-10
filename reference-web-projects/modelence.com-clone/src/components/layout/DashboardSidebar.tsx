import { Link, useLocation } from "react-router-dom";
import { DASHBOARD_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderOpen, Globe, Database, Table2, ListTree, ArrowUpDown,
  Users, Key, Shield, UserCheck, FileText, BarChart3, Route, Bell,
  Clock, Settings2, Lock, Variable, Rocket, KeyRound, UserPlus, Mail,
  Cog, CreditCard, Globe2, BellRing, User, Activity, Plug, HardDrive,
  File, Code, Search, X,
} from "lucide-react";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const sidebarGroups = [
  {
    label: "General",
    items: [
      { label: "Overview", href: DASHBOARD_NAV.overview, icon: LayoutDashboard },
      { label: "Projects", href: DASHBOARD_NAV.projects, icon: FolderOpen },
      { label: "Environments", href: DASHBOARD_NAV.environments, icon: Globe },
      { label: "Deployments", href: DASHBOARD_NAV.deployments, icon: Rocket },
    ],
  },
  {
    label: "Database",
    items: [
      { label: "Schema", href: DASHBOARD_NAV.database, icon: Database },
      { label: "Collections", href: DASHBOARD_NAV.collections, icon: Table2 },
      { label: "Indexes", href: DASHBOARD_NAV.indexes, icon: ListTree },
      { label: "Migrations", href: DASHBOARD_NAV.migrations, icon: ArrowUpDown },
      { label: "Queries", href: DASHBOARD_NAV.queries, icon: Search },
    ],
  },
  {
    label: "Authentication",
    items: [
      { label: "Users", href: DASHBOARD_NAV.authUsers, icon: Users },
      { label: "Sessions", href: DASHBOARD_NAV.authSessions, icon: Key },
      { label: "Roles", href: DASHBOARD_NAV.authRoles, icon: Shield },
      { label: "Providers", href: DASHBOARD_NAV.authProviders, icon: UserCheck },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Logs", href: DASHBOARD_NAV.logs, icon: FileText },
      { label: "Metrics", href: DASHBOARD_NAV.metrics, icon: BarChart3 },
      { label: "Traces", href: DASHBOARD_NAV.traces, icon: Route },
      { label: "Alerts", href: DASHBOARD_NAV.alerts, icon: Bell },
    ],
  },
  {
    label: "Automation",
    items: [
      { label: "Cron Jobs", href: DASHBOARD_NAV.cronJobs, icon: Clock },
      { label: "Functions", href: DASHBOARD_NAV.functions, icon: Code },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "App Config", href: DASHBOARD_NAV.appConfig, icon: Settings2 },
      { label: "Secrets", href: DASHBOARD_NAV.secrets, icon: Lock },
      { label: "Env Variables", href: DASHBOARD_NAV.envVars, icon: Variable },
    ],
  },
  {
    label: "Storage",
    items: [
      { label: "Buckets", href: DASHBOARD_NAV.storageBuckets, icon: HardDrive },
      { label: "Files", href: DASHBOARD_NAV.storageFiles, icon: File },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Members", href: DASHBOARD_NAV.teamMembers, icon: UserPlus },
      { label: "Invitations", href: DASHBOARD_NAV.teamInvitations, icon: Mail },
      { label: "API Keys", href: DASHBOARD_NAV.apiKeys, icon: KeyRound },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "General", href: DASHBOARD_NAV.settingsGeneral, icon: Cog },
      { label: "Billing", href: DASHBOARD_NAV.settingsBilling, icon: CreditCard },
      { label: "Domains", href: DASHBOARD_NAV.settingsDomains, icon: Globe2 },
      { label: "Notifications", href: DASHBOARD_NAV.settingsNotifications, icon: BellRing },
    ],
  },
  {
    label: "Other",
    items: [
      { label: "Profile", href: DASHBOARD_NAV.profile, icon: User },
      { label: "Activity Log", href: DASHBOARD_NAV.activityLog, icon: Activity },
      { label: "Integrations", href: DASHBOARD_NAV.integrations, icon: Plug },
    ],
  },
];

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  const content = (
    <div className="flex flex-col h-full w-60 bg-sidebar text-sidebar-foreground overflow-y-auto">
      <div className="lg:hidden flex items-center justify-end p-3">
        <button onClick={onClose} className="p-1 rounded hover:bg-sidebar-accent transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 pb-4 space-y-5">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-md transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block shrink-0 border-r border-sidebar-border">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative z-50 border-r border-sidebar-border shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

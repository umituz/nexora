import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Brain,
  Monitor,
  Clock,
  GitBranch,
  Terminal,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "sessions", label: "Sessions", icon: Activity },
  { id: "health", label: "System Health", icon: Monitor },
  { id: "feed", label: "Live Feed", icon: Terminal },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "cron", label: "Cron Jobs", icon: Clock },
  { id: "git", label: "Git Activity", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold text-foreground tracking-tight">OpenClaw</h1>
            <p className="text-[10px] text-muted-foreground font-mono">DASHBOARD MONITOR</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`sidebar-link w-full ${activeTab === item.id ? "sidebar-link-active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-4 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default DashboardSidebar;

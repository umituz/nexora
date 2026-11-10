import { Link, useLocation } from "react-router-dom";
import { DASHBOARD_NAV } from "@/lib/constants";
import {
  LayoutDashboard, Link as LinkIcon, Users, Key, Activity, FileText,
  Webhook, Shield, Database, RefreshCw, AlertTriangle, BarChart3,
  CreditCard, UserPlus, Settings, Puzzle, Globe, ClipboardList,
  Bell, HelpCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Link: LinkIcon, Users, Key, Activity, FileText,
  Webhook, Shield, Database, RefreshCw, AlertTriangle, BarChart3,
  CreditCard, UserPlus, Settings, Puzzle, Globe, ClipboardList,
  Bell, HelpCircle,
};

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-sm font-bold text-sidebar-primary-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-mint">
              <span className="text-xs font-bold text-mint-foreground">C</span>
            </div>
            CONDUCTOR
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-mint">
            <span className="text-xs font-bold text-mint-foreground">C</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {DASHBOARD_NAV.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}

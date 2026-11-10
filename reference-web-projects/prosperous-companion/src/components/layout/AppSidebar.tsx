import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_NAME, NAV_ITEMS, STORAGE_KEYS } from "@/constants/app";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Megaphone, Users, Mail, Sparkles, Mic,
  Linkedin, UsersRound, Shield, Plug, Webhook, Key,
  BarChart3, Ban, Tag, Download, ScrollText, Bell,
  Settings, CreditCard, HelpCircle, ChevronLeft, ChevronRight, Heart,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Megaphone, Users, Mail, Sparkles, Mic,
  Linkedin, UsersRound, Shield, Plug, Webhook, Key,
  BarChart3, Ban, Tag, Download, ScrollText, Bell,
  Settings, CreditCard, HelpCircle,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const renderSection = (title: string, items: readonly { label: string; path: string; icon: string }[]) => (
    <div className="mb-4">
      {!collapsed && (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          {title}
        </p>
      )}
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-sidebar-primary" />
          {!collapsed && <span className="text-lg font-bold text-sidebar-primary-foreground">{APP_NAME}</span>}
        </Link>
        <button
          onClick={onToggle}
          className="rounded-md p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {renderSection("Main", NAV_ITEMS.main)}
        {renderSection("Accounts", NAV_ITEMS.secondary)}
        {renderSection("Management", NAV_ITEMS.management)}
        {renderSection("Settings", NAV_ITEMS.settings)}
      </div>
    </aside>
  );
}

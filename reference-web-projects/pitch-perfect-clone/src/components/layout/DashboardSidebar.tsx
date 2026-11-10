import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Megaphone, Users, MessageSquare, FileText,
  GitBranch, BarChart3, Bot, CreditCard, Tag, UserX, Clock,
  Droplets, Phone, Puzzle, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Megaphone, Users, MessageSquare, FileText,
  GitBranch, BarChart3, Bot, CreditCard, Tag, UserX, Clock,
  Droplets, Phone, Puzzle, Settings,
};

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: "Megaphone" },
  { label: "Contacts", path: "/dashboard/contacts", icon: "Users" },
  { label: "Conversations", path: "/dashboard/conversations", icon: "MessageSquare" },
  { label: "Templates", path: "/dashboard/templates", icon: "FileText" },
  { label: "Workflows", path: "/dashboard/workflows", icon: "GitBranch" },
  { label: "Analytics", path: "/dashboard/analytics", icon: "BarChart3" },
  { label: "AI Copilot", path: "/dashboard/ai-copilot", icon: "Bot" },
  { label: "Credits", path: "/dashboard/credits", icon: "CreditCard" },
  { label: "Tags", path: "/dashboard/tags", icon: "Tag" },
  { label: "Opt-Outs", path: "/dashboard/opt-outs", icon: "UserX" },
  { label: "Scheduled", path: "/dashboard/scheduled", icon: "Clock" },
  { label: "Drip Campaigns", path: "/dashboard/drip-campaigns", icon: "Droplets" },
  { label: "Phone Numbers", path: "/dashboard/phone-numbers", icon: "Phone" },
  { label: "Integrations", path: "/dashboard/integrations", icon: "Puzzle" },
  { label: "Settings", path: "/dashboard/settings", icon: "Settings" },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <span className="text-sidebar-primary-foreground font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-sidebar-accent-foreground text-lg">{APP_NAME}</span>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon className="w-5 h-5 shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border shrink-0">
        <button
          onClick={onToggle}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onMobileClose}>
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute left-0 top-0 h-full w-64 animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

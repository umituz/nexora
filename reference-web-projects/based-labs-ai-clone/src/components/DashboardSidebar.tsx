import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Image, FolderOpen, Heart, Clock, Box, LayoutTemplate, Users, MessageSquare, Key, Coins, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/constants/app";

const SIDEBAR_ITEMS = [
  { label: "Generate", href: "/dashboard/generate", icon: Sparkles },
  { label: "My Creations", href: "/dashboard/creations", icon: Image },
  { label: "Collections", href: "/dashboard/collections", icon: FolderOpen },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "History", href: "/dashboard/history", icon: Clock },
  { label: "Models", href: "/dashboard/models", icon: Box },
  { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "Threads", href: "/dashboard/threads", icon: MessageSquare },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { label: "Credits", href: "/dashboard/credits", icon: Coins },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-sidebar-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            {APP_NAME}
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <Sparkles className="h-5 w-5 text-primary" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

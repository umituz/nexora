import { Link, useLocation } from "react-router-dom";
import { APP_NAME, NAV_ITEMS, ROUTES } from "@/constants/app";
import { useLibrary } from "@/hooks/useLibrary";
import {
  LayoutDashboard, Music, Search, Copy, Disc3, TrendingDown, TrendingUp,
  Trash2, Disc, Users, Tag, ListMusic, Heart, Plus, Clock, BarChart3,
  History, ScanLine, Upload, Download, Tags, Bell, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Music, Search, Copy, Disc3, TrendingDown, TrendingUp,
  Trash2, Disc, Users, Tag, ListMusic, Heart, Plus, Clock, BarChart3,
  History, ScanLine, Upload, Download, Tags, Bell,
};

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavClick?: () => void;
}

export function DashboardSidebar({ collapsed, onToggle, onNavClick }: DashboardSidebarProps) {
  const location = useLocation();
  const { notifications, deletionQueueIds, duplicates, splitAlbums } = useLibrary();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const queueCount = deletionQueueIds.length;
  const dupCount = duplicates.filter((d) => !d.resolved).length;
  const splitCount = splitAlbums.filter((s) => !s.unified).length;

  const badges: Record<string, number> = {
    [ROUTES.NOTIFICATIONS]: unreadCount,
    [ROUTES.DELETION_QUEUE]: queueCount,
    [ROUTES.DUPLICATES]: dupCount,
    [ROUTES.SPLIT_ALBUMS]: splitCount,
  };

  const sections = [
    { label: "Main", items: NAV_ITEMS.main },
    { label: "Tools", items: NAV_ITEMS.tools },
    { label: "Browse", items: NAV_ITEMS.browse },
    { label: "Activity", items: NAV_ITEMS.activity },
    { label: "Manage", items: NAV_ITEMS.manage },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient-hero font-serif">{APP_NAME}</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.icon] || Music;
              const isActive = location.pathname === item.path;
              const badge = badges[item.path] ?? 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={cn(
                    "flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors relative",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {badge > 0 && (
                    <span className={cn(
                      "rounded-full text-[10px] font-bold flex items-center justify-center min-w-5 h-5 px-1.5",
                      isActive ? "bg-primary-foreground text-primary" : "bg-destructive text-destructive-foreground",
                      collapsed && "absolute -right-0.5 -top-0.5"
                    )}>
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

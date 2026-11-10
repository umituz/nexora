import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, BarChart3, FileText, Clock, TrendingUp, Filter, Zap,
  Users, Target, ShieldBan, CreditCard, AlertTriangle, DollarSign, Receipt,
  Brain, FlaskConical, Lightbulb, Layout, Share2, MousePointerClick, Megaphone,
  Puzzle, Webhook, Key, Settings, UserCog, Wallet, Bell, ScrollText, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import { NAV_SECTIONS, APP_NAME } from "@/constants/app";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, BarChart3, FileText, Clock, TrendingUp, Filter, Zap,
  Users, Target, ShieldBan, CreditCard, AlertTriangle, DollarSign, Receipt,
  Brain, FlaskConical, Lightbulb, Layout, Share2, MousePointerClick, Megaphone,
  Puzzle, Webhook, Key, Settings, UserCog, Wallet, Bell, ScrollText,
};

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({ collapsed, mobileOpen, onCloseMobile }: Props) {
  const location = useLocation();

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary-foreground">1C</span>
        </div>
        {!collapsed && <span className="font-bold text-lg text-foreground">{APP_NAME}</span>}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "sidebar-item",
                      isActive && "sidebar-item-active",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border animate-slide-in">
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-4 p-1 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}

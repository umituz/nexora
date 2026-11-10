import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_ITEMS } from "@/constants/app";
import {
  LayoutDashboard, Bot, Rocket, MessageSquare, Brain, FileText, BookOpen,
  MessagesSquare, BarChart3, ScrollText, Clock, Webhook, Key, Plug,
  Users, CreditCard, Activity, Shield, HelpCircle, Settings,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Bot, Rocket, MessageSquare, Brain, FileText, BookOpen,
  MessagesSquare, BarChart3, ScrollText, Clock, Webhook, Key, Plug,
  Users, CreditCard, Activity, Shield, HelpCircle, Settings,
};

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <span className="text-primary text-lg">🦀</span>
          <span className="font-bold">{APP_NAME}</span>
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {NAV_ITEMS.dashboard.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

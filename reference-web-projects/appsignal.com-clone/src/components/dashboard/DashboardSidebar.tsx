import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { NAV_LINKS, APP_NAME } from "@/constants/app";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/constants/app";
import {
  LayoutDashboard, Bug, Gauge, Server, AlertTriangle, Activity,
  BarChart3, LayoutGrid, LineChart, FileText, Clock,
  CheckSquare, GitBranch, Rocket, Bell, Puzzle,
  Boxes, Users, Key, CreditCard, Globe, Settings,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Bug, Gauge, Server, AlertTriangle, Activity,
  BarChart3, LayoutGrid, LineChart, FileText, Clock,
  CheckSquare, GitBranch, Rocket, Bell, Puzzle,
  Boxes, Users, Key, CreditCard, Globe, Settings,
};

const sectionLabels: Record<string, string> = {
  main: "Monitoring",
  analytics: "Analytics",
  automation: "Automation",
  management: "Management",
};

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sections = useMemo(() => {
    return Object.entries(NAV_LINKS.dashboard).map(([key, links]) => ({
      key,
      label: sectionLabels[key] ?? key,
      links: links.map((link) => ({
        ...link,
        IconComponent: iconMap[link.icon],
      })),
    }));
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 font-bold text-sm">
            <span className="text-primary">⬡</span>
            <span>{APP_NAME}</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {sections.map((section) => (
          <div key={section.key}>
            {!collapsed && (
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.links.map((link) => {
                const Icon = link.IconComponent;
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                      title={collapsed ? link.label : undefined}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      {!collapsed && <span>{link.label}</span>}
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}

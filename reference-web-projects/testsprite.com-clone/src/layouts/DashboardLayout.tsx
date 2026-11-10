import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Play, FileText, Bug, BarChart3, Settings,
  FlaskConical, Monitor, GitBranch, CalendarClock, History, Globe, Variable,
  Webhook, ScrollText, Shield, HelpCircle, Cpu, ChevronLeft, ChevronRight,
  Bell, Moon, Sun, User, LogOut, Menu,
} from "lucide-react";
import { APP_NAME, DASHBOARD_LINKS } from "@/constants/app";
import { useAuth } from "@/hooks/useAuth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MOCK_NOTIFICATIONS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, href: DASHBOARD_LINKS.overview },
  { label: "Projects", icon: FolderKanban, href: DASHBOARD_LINKS.projects },
  { label: "Test Runs", icon: Play, href: DASHBOARD_LINKS.testRuns },
  { label: "Test Cases", icon: FileText, href: DASHBOARD_LINKS.testCases },
  { label: "Test Reports", icon: BarChart3, href: DASHBOARD_LINKS.testReports },
  { label: "API Testing", icon: FlaskConical, href: DASHBOARD_LINKS.apiTesting },
  { label: "UI Testing", icon: Monitor, href: DASHBOARD_LINKS.uiTesting },
  { label: "Analytics", icon: BarChart3, href: DASHBOARD_LINKS.analytics },
  { label: "CI/CD", icon: GitBranch, href: DASHBOARD_LINKS.cicd },
  { label: "Regression", icon: Shield, href: DASHBOARD_LINKS.regression },
  { label: "Scheduled", icon: CalendarClock, href: DASHBOARD_LINKS.scheduled },
  { label: "History", icon: History, href: DASHBOARD_LINKS.history },
  { label: "Environments", icon: Globe, href: DASHBOARD_LINKS.environments },
  { label: "Variables", icon: Variable, href: DASHBOARD_LINKS.variables },
  { label: "Webhooks", icon: Webhook, href: DASHBOARD_LINKS.webhooks },
  { label: "Coverage", icon: Shield, href: DASHBOARD_LINKS.coverage },
  { label: "Bug Reports", icon: Bug, href: DASHBOARD_LINKS.bugReports },
  { label: "MCP Config", icon: Cpu, href: DASHBOARD_LINKS.mcpConfig },
  { label: "Audit Log", icon: ScrollText, href: DASHBOARD_LINKS.auditLog },
  { label: "Help", icon: HelpCircle, href: DASHBOARD_LINKS.help },
  { label: "Settings", icon: Settings, href: DASHBOARD_LINKS.settings.general },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useLocalStorage("ts_sidebar_collapsed", false);
  const [darkMode, setDarkMode] = useLocalStorage("ts_dark_mode", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true });
  };

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const isActive = (href: string) => {
    if (href === DASHBOARD_LINKS.overview) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-4 border-b border-sidebar-border shrink-0">
        <span className="text-sidebar-primary font-heading font-bold text-lg">TS</span>
        {!collapsed && (
          <span className="font-heading font-bold text-sm text-sidebar-foreground">{APP_NAME}</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isActive(item.href)
                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="hidden lg:flex p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex bg-background">
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0 ${
            collapsed ? "w-16" : "w-60"
          }`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="w-64 bg-sidebar border-r border-sidebar-border h-full">
              <SidebarContent />
            </div>
            <div className="flex-1 bg-foreground/30" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-accent"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="font-heading text-sm font-semibold text-foreground truncate">
                {sidebarItems.find((i) => isActive(i.href))?.label ?? "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {MOCK_NOTIFICATIONS.slice(0, 4).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3">
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.message}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={DASHBOARD_LINKS.settings.notifications} className="text-center text-sm text-primary">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark mode */}
              <Button variant="ghost" size="icon" onClick={toggleDark}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name ?? "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={DASHBOARD_LINKS.settings.profile}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={DASHBOARD_LINKS.settings.billing}>Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={DASHBOARD_LINKS.settings.general}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

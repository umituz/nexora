import { Menu, Sun, Moon, Bell, User, LogOut, Settings, ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { mockNotifications } from "@/data/mockData";
import { APP_NAME } from "@/constants/app";

interface Props {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function AppHeader({ onToggleSidebar, onToggleMobileSidebar, sidebarCollapsed }: Props) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={onToggleMobileSidebar} className="md:hidden p-2 rounded-lg hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
        <button onClick={onToggleSidebar} className="hidden md:flex p-2 rounded-lg hover:bg-muted" title="Toggle sidebar">
          {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted" title="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 rounded-lg hover:bg-muted relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-bg" />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-sm">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {mockNotifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { navigate(n.actionUrl ?? "/"); setShowNotifs(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border/50 last:border-0"
                  >
                    <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { navigate("/notifications-settings"); setShowNotifs(false); }}
                className="w-full text-center py-2.5 text-xs text-primary hover:bg-muted/50 border-t border-border"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
            <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-10 w-48 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-muted-foreground">john@company.com</p>
              </div>
              <button
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 flex items-center gap-2"
              >
                <Settings className="h-3.5 w-3.5" /> Settings
              </button>
              <button
                onClick={() => { setShowProfile(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 flex items-center gap-2 text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

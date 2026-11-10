import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, User, LogOut, Moon, Sun, CreditCard } from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/constants/app";
import { MOCK_USER, MOCK_NOTIFICATIONS } from "@/data/mock-data";
import { formatCredits } from "@/utils/formatters";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/dashboard/credits" className="mr-2 flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors">
          <CreditCard className="h-3.5 w-3.5 text-primary" />
          {formatCredits(MOCK_USER.credits)}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="text-muted-foreground hover:text-foreground"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-card animate-scale-in">
              <h3 className="px-3 py-2 text-sm font-semibold">Notifications</h3>
              <div className="max-h-64 overflow-y-auto">
                {MOCK_NOTIFICATIONS.slice(0, 5).map((notif) => (
                  <div key={notif.id} className={`rounded-md px-3 py-2 text-sm hover:bg-muted ${!notif.read ? "bg-muted/50" : ""}`}>
                    <p className="font-medium text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors"
          >
            <img src={MOCK_USER.avatar} alt={MOCK_USER.displayName} className="h-8 w-8 rounded-full bg-muted" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-card animate-scale-in">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground">{MOCK_USER.displayName}</p>
                <p className="text-xs text-muted-foreground">@{MOCK_USER.username}</p>
              </div>
              <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link to="/dashboard/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <CreditCard className="h-4 w-4" /> Settings
              </Link>
              <button
                onClick={() => navigate("/")}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useLibrary } from "@/hooks/useLibrary";
import { mockData } from "@/data/mockData";
import { ROUTES, APP_NAME } from "@/constants/app";
import { Sun, Moon, Monitor, Bell, User, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { notifications } = useLibrary();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const themeIcon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;
  const ThemeIcon = themeIcon;

  return (
    <header className="sticky top-0 z-20 h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm text-muted-foreground font-medium lg:hidden">{APP_NAME}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <ThemeIcon size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun size={14} className="mr-2" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon size={14} className="mr-2" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor size={14} className="mr-2" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground relative transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <img
                src={mockData.user.avatar}
                alt="Profile"
                className="w-7 h-7 rounded-full bg-muted"
              />
              <span className="text-sm font-medium hidden sm:block">{mockData.user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to={ROUTES.PROFILE}><User size={14} className="mr-2" /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={ROUTES.SETTINGS}><Monitor size={14} className="mr-2" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTES.HOME}><LogOut size={14} className="mr-2" /> Log Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

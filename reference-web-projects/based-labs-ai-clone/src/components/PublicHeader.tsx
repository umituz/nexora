import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Bell, Sparkles } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { MOCK_USER } from "@/data/mock-data";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <Sparkles className="h-6 w-6 text-primary" />
            {APP_NAME}
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                  location.pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => navigate("/explore")}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => navigate("/dashboard/credits")}>
            <Bell className="h-4 w-4" />
          </Button>
          <Link to="/dashboard/generate">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 hidden sm:flex">
              Generate
            </Button>
          </Link>
          <Link to="/sign-in" className="hidden sm:block">
            <Button variant="ghost" className="text-muted-foreground">Sign In</Button>
          </Link>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/dashboard/generate" onClick={() => setMobileOpen(false)}>
              <Button className="bg-gradient-primary text-primary-foreground w-full mt-2">Generate</Button>
            </Link>
            <Link to="/sign-in" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full">Sign In</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

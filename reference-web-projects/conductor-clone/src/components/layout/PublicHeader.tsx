import { Link, useLocation } from "react-router-dom";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="hero-section sticky top-0 z-50 border-b border-border/10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-mint">
            <span className="text-sm font-bold">C</span>
          </div>
          {APP_NAME.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm transition-colors hover:text-white ${
                location.pathname === link.href ? "text-white font-medium" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link to="/sign-in">Sign in →</Link>
          </Button>
          <Button className="gradient-mint shadow-mint font-semibold" asChild>
            <Link to="/sign-up">Sign up →</Link>
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/10 md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/10 pt-4">
              <Button variant="ghost" className="justify-start text-white/80" asChild>
                <Link to="/sign-in" onClick={() => setMobileOpen(false)}>Sign in</Link>
              </Button>
              <Button className="gradient-mint" asChild>
                <Link to="/sign-up" onClick={() => setMobileOpen(false)}>Sign up</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

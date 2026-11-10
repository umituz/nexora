import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { APP_NAME, NAV_LINKS } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { PublicFooter } from "@/components/landing/PublicFooter";

const navItems = [
  { label: "Solutions", href: NAV_LINKS.solutions.mcp, hasDropdown: true },
  { label: "Pricing", href: NAV_LINKS.pricing },
  { label: "Docs", href: NAV_LINKS.docs },
  { label: "Blog", href: NAV_LINKS.blog },
  { label: "About", href: NAV_LINKS.about },
  { label: "Contact", href: NAV_LINKS.contact },
];

const solutionItems = [
  { label: "MCP Server", href: NAV_LINKS.solutions.mcp },
  { label: "Backend Testing", href: NAV_LINKS.solutions.backend },
  { label: "Frontend Testing", href: NAV_LINKS.solutions.frontend },
  { label: "Data Testing", href: NAV_LINKS.solutions.data },
  { label: "AI Agent/Model Testing", href: NAV_LINKS.solutions.aiAgent },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top banner */}
      <div className="gradient-primary text-primary-foreground text-center py-2 px-4 text-sm font-body">
        Exclusive Limited-Time FREE — Don&apos;t Miss Out!{" "}
        <Link to={NAV_LINKS.pricing} className="underline font-medium ml-1">
          Learn More →
        </Link>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-wide flex items-center justify-between h-16 px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
            <span className="text-gradient text-2xl">TS</span>
            {APP_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                      location.pathname.startsWith("/solutions")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label} ▾
                  </button>
                  {solutionsOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg py-2 min-w-[200px] z-50"
                      onMouseLeave={() => setSolutionsOpen(false)}
                    >
                      {solutionItems.map((si) => (
                        <Link
                          key={si.href}
                          to={si.href}
                          onClick={() => setSolutionsOpen(false)}
                          className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                        >
                          {si.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to={NAV_LINKS.signIn}>
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to={NAV_LINKS.signUp}>
              <Button size="sm" className="gradient-primary text-primary-foreground">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 gap-1">
              {solutionItems.map((si) => (
                <Link
                  key={si.href}
                  to={si.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md"
                >
                  {si.label}
                </Link>
              ))}
              {navItems
                .filter((n) => !n.hasDropdown)
                .map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md"
                  >
                    {item.label}
                  </Link>
                ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link to={NAV_LINKS.signIn} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to={NAV_LINKS.signUp} onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

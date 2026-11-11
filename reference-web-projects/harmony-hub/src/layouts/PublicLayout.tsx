import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { APP_NAME, NAV_ITEMS, COMPANY_NAME, SOCIAL_LINKS, STATS } from "@/constants/app";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary">
            Sign in
          </Link>
          <Link
            to="/pricing"
            className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start Free
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground">
              Sign in
            </Link>
            <Link to="/pricing" onClick={() => setMenuOpen(false)} className="rounded-lg bg-gradient-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
              Start Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">{COMPANY_NAME}</p>
            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
              <span>{STATS.brands} Brands</span>
              <span>{STATS.aiMessages} AI Messages</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Features</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/features" className="hover:text-foreground">WhatsApp AI</Link>
              <Link to="/features" className="hover:text-foreground">Instagram AI</Link>
              <Link to="/features" className="hover:text-foreground">AI Appointment Booking</Link>
              <Link to="/features" className="hover:text-foreground">White Label</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
              <Link to="/affiliates" className="hover:text-foreground">Affiliates</Link>
              <Link to="/about" className="hover:text-foreground">About</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
            </div>
            <div className="mt-4 flex gap-3">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm">LinkedIn</a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm">YouTube</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}, All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

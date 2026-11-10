import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { APP_NAME, SOCIAL_LINKS } from "@/constants/app";

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Generate", href: "/dashboard/generate" },
        { label: "Models", href: "/models" },
        { label: "Pricing", href: "/pricing" },
        { label: "API", href: "/api-docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Articles", href: "/articles" },
        { label: "Use Cases", href: "/use-cases" },
        { label: "Ideas", href: "/ideas" },
        { label: "Tutorials", href: "/tutorials" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Explore", href: "/explore" },
        { label: "Threads", href: "/threads" },
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Showcase", href: "/showcase" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              {APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Generate images, videos, and audio with the best AI models.
            </p>
            <div className="mt-4 flex gap-3">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Twitter</a>
              <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Discord</a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">YouTube</a>
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

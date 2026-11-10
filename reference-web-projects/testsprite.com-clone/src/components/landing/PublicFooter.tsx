import { Link } from "react-router-dom";
import { APP_NAME, APP_COPYRIGHT, NAV_LINKS, SOCIAL_LINKS } from "@/constants/app";

const footerSolutions = [
  { label: "MCP Server", href: NAV_LINKS.solutions.mcp },
  { label: "Backend Testing", href: NAV_LINKS.solutions.backend },
  { label: "Frontend Testing", href: NAV_LINKS.solutions.frontend },
  { label: "Data Testing", href: NAV_LINKS.solutions.data },
  { label: "AI Agent/Model Testing", href: NAV_LINKS.solutions.aiAgent },
];

const footerResources = [
  { label: "Docs", href: NAV_LINKS.docs },
  { label: "About", href: NAV_LINKS.about },
  { label: "Blog", href: NAV_LINKS.blog },
  { label: "Hackathon", href: NAV_LINKS.hackathon },
  { label: "Changelog", href: NAV_LINKS.changelog },
];

const footerLegal = [
  { label: "Terms & Conditions", href: NAV_LINKS.terms },
  { label: "Privacy Policy", href: NAV_LINKS.privacy },
];

export function PublicFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide px-4 lg:px-8 py-12 lg:py-16">
        {/* CTA */}
        <div className="text-center mb-12">
          <h3 className="text-xl font-heading mb-4">Stay Updated</h3>
          <a
            href={SOCIAL_LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-medium text-sm transition-transform hover:scale-105"
          >
            Join Discord
          </a>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg mb-4">
              <span className="text-primary">TS</span> {APP_NAME}
            </Link>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 opacity-70">Solutions</h4>
            <ul className="space-y-2">
              {footerSolutions.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 opacity-70">Resources</h4>
            <ul className="space-y-2">
              {footerResources.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-3 opacity-70">Legal</h4>
            <ul className="space-y-2">
              {footerLegal.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-center text-xs opacity-50">
          {APP_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}

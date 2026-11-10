import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";

const footerLinks = {
  Features: [
    { label: "Error Tracking", href: "/features" },
    { label: "Performance Monitoring", href: "/features" },
    { label: "Host Monitoring", href: "/features" },
    { label: "Anomaly Detection", href: "/features" },
    { label: "Uptime Monitoring", href: "/features" },
    { label: "Log Management", href: "/features" },
    { label: "Check-ins", href: "/features" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Security", href: "/security" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <span className="text-primary">⬡</span>
              <span>{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Application performance monitoring for modern development teams.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
            <Link to="/security" className="text-sm text-muted-foreground hover:text-primary">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

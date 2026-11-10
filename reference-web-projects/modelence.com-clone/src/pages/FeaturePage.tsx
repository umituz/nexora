import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Database, BarChart3, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";

const featureData: Record<string, { icon: typeof ShieldCheck; title: string; subtitle: string; points: string[] }> = {
  authentication: {
    icon: ShieldCheck,
    title: "Authentication & User Management",
    subtitle: "Complete auth system out of the box",
    points: [
      "Email and password authentication with secure hashing",
      "OAuth support for Google, GitHub, and Apple sign-in",
      "Session management with configurable expiration",
      "Role-based access control with custom permissions",
      "User management dashboard with search and filters",
      "Two-factor authentication support",
      "Password reset flows with email verification",
      "Rate limiting and brute-force protection",
    ],
  },
  database: {
    icon: Database,
    title: "Database Primitives",
    subtitle: "Type-safe database operations",
    points: [
      "Define schemas using TypeScript types",
      "Automatic connection pooling and management",
      "Built-in migration system with version tracking",
      "Index management for query optimization",
      "Type-safe queries and mutations",
      "Real-time data subscriptions",
      "Automatic backup and point-in-time recovery",
      "Data export and import utilities",
    ],
  },
  monitoring: {
    icon: BarChart3,
    title: "Monitoring & Observability",
    subtitle: "Full visibility into your application",
    points: [
      "Structured logging with automatic context injection",
      "Custom metrics with real-time dashboards",
      "Distributed tracing across services",
      "Alert rules with configurable thresholds",
      "Error tracking with stack trace analysis",
      "Performance monitoring and bottleneck detection",
      "Integration with external monitoring tools",
      "Historical data retention and analysis",
    ],
  },
  cloud: {
    icon: Cloud,
    title: "Managed Cloud",
    subtitle: "Zero-configuration deployment",
    points: [
      "One-command deployment to production",
      "Automatic SSL certificate provisioning",
      "Horizontal and vertical scaling",
      "Custom domain support with DNS management",
      "Environment-specific configuration management",
      "Secret management with encryption at rest",
      "Cron job scheduling with sub-second precision",
      "Multi-region deployment support",
    ],
  },
};

export default function FeaturePage() {
  const { feature } = useParams<{ feature: string }>();
  const data = feature ? featureData[feature] : null;

  if (!data) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Feature not found</h1>
        <Link to="/" className="text-primary text-sm mt-4 inline-block">← Back to Home</Link>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">{data.title}</h1>
          <p className="text-lg text-muted-foreground">{data.subtitle}</p>
        </div>

        <div className="space-y-4">
          {data.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground">{point}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link to={NAV_LINKS.signup}>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

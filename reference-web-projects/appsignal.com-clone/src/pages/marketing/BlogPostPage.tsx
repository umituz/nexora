import { useParams, Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";
import { ArrowLeft } from "lucide-react";

const blogContent: Record<string, { title: string; date: string; category: string; content: string[] }> = {
  "monitoring-best-practices": {
    title: "10 Best Practices for Application Monitoring",
    date: "March 5, 2026",
    category: "Guides",
    content: [
      "Application monitoring is essential for maintaining the reliability and performance of your software. Here are ten best practices every development team should follow.",
      "1. Monitor from the user's perspective — Set up synthetic monitoring to simulate real user interactions and catch issues before your users do.",
      "2. Set meaningful alerts — Too many alerts lead to alert fatigue. Focus on actionable alerts that require human intervention.",
      "3. Use anomaly detection — Instead of static thresholds, use anomaly detection to identify unusual patterns in your metrics.",
      "4. Track deployment markers — Correlate changes in performance and error rates with specific deployments to quickly identify regressions.",
      "5. Monitor your background jobs — Don't forget about background processes. Use check-ins to ensure scheduled jobs run on time.",
      "6. Centralize your logs — Collect all application logs in one place for easy searching and correlation with errors and performance issues.",
      "7. Set up uptime monitoring — Monitor your endpoints from multiple regions to detect outages quickly.",
      "8. Create custom dashboards — Build dashboards that show the metrics most relevant to your team and business.",
      "9. Review and iterate — Regularly review your monitoring setup and adjust thresholds and alerts based on what you learn.",
      "10. Automate responses — Use workflow automation to create tickets, send notifications, and trigger responses automatically.",
    ],
  },
};

const defaultContent = {
  title: "Blog Post",
  date: "2026",
  category: "General",
  content: [
    "This is a sample blog post. In a production application, this content would be fetched from a CMS or database.",
    "Stay tuned for more insights and updates from our team.",
  ],
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = (slug && blogContent[slug]) || { ...defaultContent, title: slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || defaultContent.title };

  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">{post.date} · {APP_NAME} Team</p>
        <div className="prose prose-sm max-w-none">
          {post.content.map((p, i) => (
            <p key={i} className="text-muted-foreground mb-4 leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

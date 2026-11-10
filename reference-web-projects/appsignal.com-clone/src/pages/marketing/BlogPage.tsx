import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";

const posts = [
  { slug: "monitoring-best-practices", title: "10 Best Practices for Application Monitoring", excerpt: "Learn how to set up effective monitoring that catches issues before your users do.", date: "March 5, 2026", category: "Guides", readTime: "8 min" },
  { slug: "ruby-performance-tips", title: "Ruby on Rails Performance Optimization Tips", excerpt: "Practical tips to speed up your Rails application and reduce response times.", date: "March 2, 2026", category: "Ruby", readTime: "12 min" },
  { slug: "error-tracking-guide", title: "The Complete Guide to Error Tracking", excerpt: "Everything you need to know about tracking, triaging, and fixing errors in production.", date: "February 28, 2026", category: "Guides", readTime: "15 min" },
  { slug: "nodejs-monitoring", title: "Monitoring Node.js Applications at Scale", excerpt: "How to monitor Node.js apps in production with practical examples.", date: "February 25, 2026", category: "Node.js", readTime: "10 min" },
  { slug: "anomaly-detection-intro", title: "Introduction to Anomaly Detection", excerpt: "How to set up anomaly detection alerts and reduce false positives.", date: "February 20, 2026", category: "Features", readTime: "6 min" },
  { slug: "log-management-tips", title: "Effective Log Management Strategies", excerpt: "Best practices for collecting, storing, and searching through application logs.", date: "February 18, 2026", category: "Guides", readTime: "9 min" },
  { slug: "elixir-phoenix-monitoring", title: "Monitoring Phoenix Applications with Ease", excerpt: "A deep dive into monitoring Elixir and Phoenix applications.", date: "February 15, 2026", category: "Elixir", readTime: "11 min" },
  { slug: "deploy-markers", title: "Using Deploy Markers to Track Changes", excerpt: "How deploy markers help you correlate code changes with performance impacts.", date: "February 12, 2026", category: "Features", readTime: "5 min" },
];

export default function BlogPage() {
  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Insights, guides, and updates from the {APP_NAME} team.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <span className="text-xs text-muted-foreground">· {post.readTime} read</span>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

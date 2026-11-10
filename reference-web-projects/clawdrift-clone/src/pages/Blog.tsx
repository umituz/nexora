import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";
import { formatDate } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
  { id: "1", title: "Introducing ClawDrift: Deploy AI Assistants in Under 1 Minute", excerpt: "We're excited to launch ClawDrift, the fastest way to deploy personal AI assistants on your favorite messaging platforms.", category: "Launch", date: "2026-02-15" },
  { id: "2", title: "How AI Assistants Are Transforming Customer Support", excerpt: "Discover how businesses are using AI-powered assistants to provide 24/7 customer support and reduce response times.", category: "AI", date: "2026-02-20" },
  { id: "3", title: "Best Practices for Building Effective AI Personas", excerpt: "Learn how to craft personas that make your AI assistants more helpful, consistent, and engaging.", category: "Guide", date: "2026-02-25" },
  { id: "4", title: "Telegram vs Discord vs WhatsApp: Which Platform for Your Bot?", excerpt: "A comprehensive comparison of messaging platforms for deploying AI assistants.", category: "Guide", date: "2026-03-01" },
  { id: "5", title: "OpenClaw v2.0: Multi-Model Support and More", excerpt: "OpenClaw now supports Claude, GPT-4o, and Gemini. Choose the best model for each use case.", category: "Update", date: "2026-03-05" },
  { id: "6", title: "Security Best Practices for AI Assistants", excerpt: "How we keep your data safe and what you can do to enhance the security of your deployed bots.", category: "Security", date: "2026-03-08" },
];

export default function BlogPage() {
  return (
    <div className="container max-w-4xl py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">{APP_NAME} Blog</h1>
        <p className="mt-2 text-muted-foreground">Insights, guides, and updates from the team</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
              </div>
              <CardTitle className="text-lg">
                <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

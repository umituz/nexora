import { useParams, Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";
import { formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const postsContent: Record<string, { title: string; category: string; date: string; content: string }> = {
  "1": {
    title: "Introducing ClawDrift: Deploy AI Assistants in Under 1 Minute",
    category: "Launch",
    date: "2026-02-15",
    content: `We're thrilled to announce the public beta of ${APP_NAME}, the fastest way to deploy personal AI assistants.\n\nTraditionally, setting up an AI assistant on a messaging platform required purchasing VMs, configuring SSH keys, installing dependencies, and debugging webhooks. This process could take hours — or days for non-technical users.\n\nWith ${APP_NAME}, you can deploy a fully functional AI assistant in under one minute. Simply choose your AI model (Claude, GPT-4o, or Gemini), select your platform (Telegram, Discord, or WhatsApp), and hit deploy.\n\nWe handle all the infrastructure, API keys, and webhook configuration automatically. Your assistant starts working immediately, 24/7.\n\n## What's included\n\n- **Multi-model support**: Choose from Claude 4, GPT-4o, Gemini Pro, and more\n- **Three platforms**: Deploy to Telegram, Discord, or WhatsApp\n- **Persistent memory**: Your assistant remembers context across conversations\n- **Custom personas**: Define how your assistant behaves and communicates\n- **Analytics**: Track messages, response times, and user satisfaction\n\nGet started today at clawdrift.com.`,
  },
  "2": {
    title: "How AI Assistants Are Transforming Customer Support",
    category: "AI",
    date: "2026-02-20",
    content: `Customer support is one of the most impactful use cases for AI assistants. Here's why businesses are adopting them.\n\n## 24/7 Availability\n\nAI assistants never sleep. They can handle customer inquiries around the clock, ensuring no message goes unanswered.\n\n## Instant Response Times\n\nWhile human agents might take minutes or hours to respond, AI assistants reply in seconds.\n\n## Consistent Quality\n\nEvery customer gets the same high-quality, accurate response. No bad days, no inconsistencies.\n\n## Cost Efficiency\n\nOne AI assistant can handle hundreds of simultaneous conversations, dramatically reducing support costs.`,
  },
  "3": {
    title: "Best Practices for Building Effective AI Personas",
    category: "Guide",
    date: "2026-02-25",
    content: `A well-crafted persona is the difference between a useful AI assistant and a great one.\n\n## Be Specific\n\nInstead of "be helpful," define exactly how your assistant should communicate. What's its tone? How formal should it be?\n\n## Define Boundaries\n\nClearly state what your assistant should and shouldn't do. This prevents unexpected behavior.\n\n## Include Examples\n\nProvide sample conversations that demonstrate ideal responses.\n\n## Iterate Based on Feedback\n\nMonitor conversations and refine your persona based on real interactions.`,
  },
  "4": {
    title: "Telegram vs Discord vs WhatsApp: Which Platform for Your Bot?",
    category: "Guide",
    date: "2026-03-01",
    content: `Each messaging platform has unique strengths for AI assistants.\n\n## Telegram\n- Best for: Individual users and small groups\n- Bot API is mature and well-documented\n- Supports rich media and inline keyboards\n\n## Discord\n- Best for: Communities and teams\n- Supports threaded conversations\n- Great for developer-focused use cases\n\n## WhatsApp\n- Best for: Business communication\n- Highest user base globally\n- End-to-end encryption\n\nThe best choice depends on where your users already are.`,
  },
  "5": {
    title: "OpenClaw v2.0: Multi-Model Support and More",
    category: "Update",
    date: "2026-03-05",
    content: `We're excited to release OpenClaw v2.0 with several major improvements.\n\n## Multi-Model Support\n\nYou can now choose from Claude 4, Claude 3.5, GPT-4o, GPT-4 Turbo, Gemini Pro, and Gemini Flash for each bot.\n\n## Improved Memory\n\nPersistent memory now works across platforms and sessions.\n\n## Knowledge Base\n\nUpload documents, URLs, and FAQs that your bot can reference during conversations.\n\n## Scheduled Tasks\n\nSet up recurring tasks like daily digests, weekly reports, and follow-up reminders.`,
  },
  "6": {
    title: "Security Best Practices for AI Assistants",
    category: "Security",
    date: "2026-03-08",
    content: `Security is paramount when deploying AI assistants. Here's how we keep your data safe.\n\n## Encryption\n\nAll data in transit and at rest is encrypted using industry-standard protocols.\n\n## API Key Management\n\nAPI keys are stored securely and can be rotated at any time.\n\n## Access Controls\n\nRole-based access control ensures team members only access what they need.\n\n## Audit Logging\n\nEvery action is logged for compliance and security monitoring.`,
  },
};

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = id ? postsContent[id] : undefined;

  if (!post) {
    return (
      <div className="container max-w-3xl py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild><Link to="/blog">Back to Blog</Link></Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-20">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
      </Button>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="text-sm text-muted-foreground">{formatDate(post.date)}</span>
      </div>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="space-y-4 text-muted-foreground">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-semibold text-foreground mt-6">{paragraph.replace("## ", "")}</h2>;
          }
          if (paragraph.startsWith("- ")) {
            return (
              <ul key={i} className="list-disc pl-6 space-y-1">
                {paragraph.split("\n").map((line, j) => (
                  <li key={j}>{line.replace("- ", "")}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{paragraph}</p>;
        })}
      </div>
    </div>
  );
}

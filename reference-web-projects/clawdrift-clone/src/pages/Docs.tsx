import { APP_NAME } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "Quick Start Guide", description: "Deploy your first AI assistant in under a minute." },
      { title: "Creating Your Account", description: "Sign up and set up your workspace." },
      { title: "Choosing a Model", description: "Compare Claude, GPT-4o, and Gemini for your use case." },
      { title: "Selecting a Platform", description: "Deploy to Telegram, Discord, or WhatsApp." },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Custom Personas", description: "Define how your AI assistant communicates." },
      { title: "Knowledge Base", description: "Add documents, URLs, and FAQs for your bot to reference." },
      { title: "Webhooks", description: "Set up event-driven integrations with your systems." },
      { title: "API Keys", description: "Manage API keys for programmatic access." },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Scheduled Tasks", description: "Automate recurring actions with cron-based scheduling." },
      { title: "Multi-Channel Deployment", description: "Deploy one bot across multiple platforms." },
      { title: "Team Collaboration", description: "Invite team members and manage roles." },
      { title: "Analytics & Reporting", description: "Track messages, response times, and satisfaction." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="container max-w-4xl py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">{APP_NAME} Documentation</h1>
        <p className="mt-2 text-muted-foreground">Everything you need to deploy and manage AI assistants</p>
      </div>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <Card key={item.title} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

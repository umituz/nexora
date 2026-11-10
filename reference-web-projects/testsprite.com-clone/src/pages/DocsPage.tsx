import { APP_NAME } from "@/constants/app";
import { ExternalLink } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    items: [
      { title: "Quick Start Guide", desc: "Get up and running with TestSprite in minutes." },
      { title: "Installation", desc: "Install the TestSprite CLI and configure your project." },
      { title: "Your First Test", desc: "Create and run your first AI-generated test." },
    ],
  },
  {
    title: "MCP Integration",
    items: [
      { title: "MCP Server Setup", desc: "Connect TestSprite to your IDE via MCP." },
      { title: "Cursor Integration", desc: "Configure TestSprite with Cursor IDE." },
      { title: "VS Code Integration", desc: "Set up TestSprite in Visual Studio Code." },
      { title: "Claude Code", desc: "Use TestSprite with Claude Code." },
    ],
  },
  {
    title: "Testing",
    items: [
      { title: "Frontend Testing", desc: "Generate and run UI tests automatically." },
      { title: "Backend API Testing", desc: "Test your REST and GraphQL APIs." },
      { title: "E2E Testing", desc: "End-to-end testing across your full stack." },
      { title: "Regression Testing", desc: "Prevent regressions with scheduled tests." },
    ],
  },
  {
    title: "CI/CD",
    items: [
      { title: "GitHub Actions", desc: "Integrate TestSprite into your GitHub workflow." },
      { title: "GitLab CI", desc: "Configure TestSprite with GitLab pipelines." },
      { title: "Jenkins", desc: "Add TestSprite to your Jenkins pipeline." },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "REST API", desc: "Full REST API documentation." },
      { title: "Webhooks", desc: "Configure webhook notifications." },
      { title: "SDK Reference", desc: "JavaScript/TypeScript SDK documentation." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Documentation</h1>
        <p className="text-muted-foreground mb-12">
          Everything you need to know about {APP_NAME}. Learn how to integrate, configure, and get the most out of your AI testing agent.
        </p>

        <div className="space-y-12">
          {docSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-heading font-bold mb-4 text-gradient">{section.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="glass-card p-5 cursor-pointer hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <ExternalLink size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

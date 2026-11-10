import { APP_NAME } from "@/constants/app";
import { Search, Book, Code, Zap, FileText, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const docSections = [
  { icon: Zap, title: "Getting Started", description: "Quick start guides for all supported languages.", links: ["Installation", "Configuration", "First Steps"] },
  { icon: Code, title: "Language Guides", description: "In-depth guides for Ruby, Elixir, Node.js, Python, and more.", links: ["Ruby", "Elixir", "Node.js", "Python", "JavaScript"] },
  { icon: Book, title: "Features", description: "Learn about all monitoring features and how to use them.", links: ["Error Tracking", "Performance", "Host Monitoring", "Anomaly Detection"] },
  { icon: FileText, title: "API Reference", description: "Complete API documentation for custom integrations.", links: ["REST API", "GraphQL", "Webhooks", "SDK Reference"] },
  { icon: Settings, title: "Configuration", description: "Advanced configuration options and best practices.", links: ["Environment Variables", "Filters", "Custom Metrics", "Sampling"] },
  { icon: Search, title: "Troubleshooting", description: "Common issues and their solutions.", links: ["Connection Issues", "Missing Data", "Performance Tips", "FAQ"] },
];

export default function DocsPage() {
  const [search, setSearch] = useState("");

  const filtered = docSections.filter((s) =>
    search === "" || s.title.toLowerCase().includes(search.toLowerCase()) || s.links.some((l) => l.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="py-20">
      <div className="container max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Everything you need to get started with {APP_NAME}.
        </p>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-12 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((section) => (
            <div key={section.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
              <section.icon className="h-8 w-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link to={`/docs/${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-primary hover:underline">
                      {link} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { BookOpen, MessageSquare, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Getting Started", articles: [
    { title: "How to create your first AI agent", desc: "Step-by-step guide to setting up your sales agent in 15 minutes." },
    { title: "Connecting your channels", desc: "Learn how to connect WhatsApp, Instagram, Messenger, and Web Chat." },
    { title: "Writing effective instructions", desc: "Tips for crafting AI instructions that convert leads into customers." },
  ]},
  { name: "AI Agent Setup", articles: [
    { title: "Customizing your agent's personality", desc: "How to make your AI agent match your brand voice." },
    { title: "Adding knowledge base articles", desc: "Teach your AI about your products, services, and FAQs." },
    { title: "Setting up appointment booking", desc: "Configure calendar integration for in-chat booking." },
  ]},
  { name: "Campaigns", articles: [
    { title: "Creating outbound campaigns", desc: "Send targeted messages to your contact lists." },
    { title: "Comment-to-DM automation", desc: "Set up automatic DM replies to Instagram/Facebook comments." },
    { title: "Follow-up campaigns", desc: "Re-engage leads who haven't responded." },
  ]},
  { name: "Billing & Account", articles: [
    { title: "Managing your subscription", desc: "Upgrade, downgrade, or cancel your plan." },
    { title: "Understanding credits", desc: "How credits work and how to manage usage." },
    { title: "White-label setup", desc: "How to white-label DM Champ for your agency." },
  ]},
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filtered = categories.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.articles.length > 0);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center font-heading text-3xl font-bold md:text-5xl">Help Guide</h1>
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {filtered.map((cat) => (
            <div key={cat.name} className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
                <BookOpen className="h-5 w-5 text-primary" />
                {cat.name}
              </h2>
              <div className="mt-4 space-y-3">
                {cat.articles.map((article) => (
                  <button key={article.title} className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-secondary">
                    <div>
                      <p className="text-sm font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

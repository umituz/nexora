import { mockKnowledgeArticles, type KnowledgeArticle } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export default function KnowledgeBasePage() {
  const [articles] = useLocalStorage<KnowledgeArticle[]>("dmchamp_kb", mockKnowledgeArticles);
  const [search, setSearch] = useState("");
  const filtered = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Knowledge Base</h1>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><span className="rounded bg-secondary px-2 py-0.5 text-xs">{a.category}</span></div>
            <h3 className="mt-2 font-heading font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.content}</p>
            <p className="mt-2 text-xs text-muted-foreground">Updated: {a.updatedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

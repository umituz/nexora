import { mockTemplates, type Template } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templates, setTemplates] = useLocalStorage<Template[]>("dmchamp_templates", mockTemplates);
  const [search, setSearch] = useState("");
  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold">Message Templates</h1></div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><h3 className="font-heading font-semibold">{t.name}</h3><span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t.category}</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{t.content}</p>
            <p className="mt-2 text-xs text-muted-foreground">Used {t.usageCount} times</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { MOCK_TEMPLATES } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { formatNumber } from "@/utils/formatters";

export default function TemplatesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Templates</h1>
      <p className="text-sm text-muted-foreground mt-1">Start with curated prompts and settings</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {MOCK_TEMPLATES.map((tpl) => (
          <Link key={tpl.id} to={`/dashboard/generate?prompt=${encodeURIComponent(tpl.prompt)}&model=${tpl.model}`} className="group">
            <div className="overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
              <div className="aspect-square overflow-hidden">
                <img src={tpl.imageUrl} alt={tpl.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-foreground">{tpl.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tpl.category} · {formatNumber(tpl.usageCount)} uses</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

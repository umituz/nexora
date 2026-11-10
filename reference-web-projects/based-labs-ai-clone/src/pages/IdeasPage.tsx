import { Link } from "react-router-dom";
import { MOCK_IDEAS } from "@/data/mock-data";
import { useState } from "react";

export default function IdeasPage() {
  const categories = [...new Set(MOCK_IDEAS.map((i) => i.category))];
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MOCK_IDEAS : MOCK_IDEAS.filter((i) => i.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">AI Ideas & Inspiration</h1>
      <p className="mt-2 text-center text-muted-foreground">Get inspired and start creating with curated prompts and ideas.</p>
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
        <button onClick={() => setFilter("all")} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{cat}</button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((idea) => (
          <Link key={idea.id} to={`/dashboard/generate?prompt=${encodeURIComponent(idea.prompt)}`} className="group">
            <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
              <div className="aspect-square overflow-hidden">
                <img src={idea.imageUrl} alt={idea.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-foreground">{idea.title}</h3>
                <p className="text-xs text-muted-foreground">{idea.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

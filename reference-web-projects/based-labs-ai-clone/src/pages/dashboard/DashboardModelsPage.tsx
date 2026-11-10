import { MOCK_MODELS } from "@/data/mock-data";
import { ModelCard } from "@/components/ModelCard";
import { useState } from "react";

export default function DashboardModelsPage() {
  const [filter, setFilter] = useState("all");
  const categories = ["all", "image", "video", "audio", "tool"];
  const filtered = filter === "all" ? MOCK_MODELS : MOCK_MODELS.filter((m) => m.category === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Models</h1>
      <p className="text-sm text-muted-foreground mt-1">Browse and select AI models</p>
      <div className="mt-4 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{cat === "all" ? "All" : cat}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((m) => (<ModelCard key={m.id} model={m} />))}
      </div>
    </div>
  );
}

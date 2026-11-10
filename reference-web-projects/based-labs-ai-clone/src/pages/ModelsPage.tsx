import { useState } from "react";
import { MOCK_MODELS } from "@/data/mock-data";
import { ModelCard } from "@/components/ModelCard";

export default function ModelsPage() {
  const [filter, setFilter] = useState<string>("all");
  const categories = ["all", "image", "video", "audio", "tool"];

  const filteredModels = filter === "all" ? MOCK_MODELS : MOCK_MODELS.filter((m) => m.category === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">AI Models</h1>
      <p className="mt-2 text-center text-muted-foreground">
        Choose from the best AI models for image, video, audio generation and more.
      </p>
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "all" ? "All Models" : cat}
          </button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredModels.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}

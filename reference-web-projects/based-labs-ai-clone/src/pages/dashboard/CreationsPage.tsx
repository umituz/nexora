import { MOCK_MEDIA } from "@/data/mock-data";
import { MediaCard } from "@/components/MediaCard";
import { useState } from "react";

export default function CreationsPage() {
  const [filter, setFilter] = useState("all");
  const media = MOCK_MEDIA.slice(0, 20);
  const filtered = filter === "all" ? media : media.filter((m) => m.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">My Creations</h1>
          <p className="text-sm text-muted-foreground">{media.length} items</p>
        </div>
        <div className="flex gap-2">
          {["all", "image", "video"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{f === "all" ? "All" : f + "s"}</button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((item) => (<MediaCard key={item.id} item={item} />))}
      </div>
    </div>
  );
}

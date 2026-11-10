import { MOCK_COLLECTIONS } from "@/data/mock-data";
import { Link } from "react-router-dom";
import { Plus, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CollectionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Collections</h1>
        <Button className="bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> New Collection</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_COLLECTIONS.map((col) => (
          <div key={col.id} className="overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="aspect-video overflow-hidden"><img src={col.coverUrl} alt={col.name} className="h-full w-full object-cover" loading="lazy" /></div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground">{col.name}</h3>
                {col.isPublic ? <Globe className="h-4 w-4 text-muted-foreground" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{col.itemCount} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

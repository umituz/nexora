import { mockCampaigns, type Campaign } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { calculateConversionRate } from "@/lib/calculations";

export default function CampaignsPage() {
  const [campaigns] = useLocalStorage<Campaign[]>("dmchamp_campaigns", mockCampaigns);
  const [search, setSearch] = useState("");
  const filtered = campaigns.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const statusColors: Record<string, string> = { draft: "bg-muted text-muted-foreground", active: "bg-success/10 text-success", paused: "bg-warning/10 text-warning", completed: "bg-info/10 text-info" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Campaigns</h1>
        <Link to="/dashboard/campaigns/create" className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> Create</Link>
      </div>
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => (
          <Link key={c.id} to={`/dashboard/campaigns/${c.id}`} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold">{c.name}</h3>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[c.status])}>{c.status}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{c.type} · {c.channel} · {c.agentName}</p>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div><p className="text-xs text-muted-foreground">Sent</p><p className="font-heading font-semibold">{c.sentCount}</p></div>
              <div><p className="text-xs text-muted-foreground">Opened</p><p className="font-heading font-semibold">{c.openedCount}</p></div>
              <div><p className="text-xs text-muted-foreground">Replied</p><p className="font-heading font-semibold">{c.repliedCount}</p></div>
              <div><p className="text-xs text-muted-foreground">Converted</p><p className="font-heading font-semibold">{c.convertedCount}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

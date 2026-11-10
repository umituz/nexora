import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Play, Pause, Eye } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { formatNumber, formatDate, calculateDeliveryRate, calculateReplyRate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Campaign } from "@/lib/types";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    getStorageItem(STORAGE_KEYS.CAMPAIGNS, MOCK_CAMPAIGNS)
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id: string) => {
    const updated = campaigns.map((c) =>
      c.id === id ? { ...c, status: (c.status === "active" ? "paused" : "active") as Campaign["status"] } : c
    );
    setCampaigns(updated);
    setStorageItem(STORAGE_KEYS.CAMPAIGNS, updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your SMS marketing campaigns</p>
        </div>
        <Button asChild><Link to="/dashboard/campaigns/create" className="gap-2"><Plus className="w-4 h-4" />New Campaign</Link></Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "active", "paused", "draft", "completed"].map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === "active" ? "bg-success/10 text-success" :
                      c.status === "completed" ? "bg-info/10 text-info" :
                      c.status === "paused" ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">{c.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Sent: <strong className="text-foreground">{formatNumber(c.sentCount)}</strong></span>
                    <span>Delivered: <strong className="text-foreground">{calculateDeliveryRate(c)}%</strong></span>
                    <span>Replies: <strong className="text-foreground">{formatNumber(c.repliedCount)}</strong></span>
                    <span>Reply Rate: <strong className="text-foreground">{calculateReplyRate(c)}%</strong></span>
                    <span>Created: {formatDate(c.createdAt)}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/dashboard/campaigns/${c.id}`} className="gap-2"><Eye className="w-4 h-4" />View Details</Link></DropdownMenuItem>
                    {(c.status === "active" || c.status === "paused") && (
                      <DropdownMenuItem onClick={() => toggleStatus(c.id)} className="gap-2">
                        {c.status === "active" ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />Resume</>}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No campaigns found</div>
        )}
      </div>
    </div>
  );
}

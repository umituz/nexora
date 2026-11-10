import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Play, Pause, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/calculations";
import { generateId } from "@/lib/calculations";

export default function CampaignsPage() {
  const { campaigns, setCampaigns } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : c
      )
    );
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = () => {
    const newCampaign = {
      id: generateId(),
      name: `New Campaign ${campaigns.length + 1}`,
      status: "draft" as const,
      linkedinAccountId: "acc-0",
      linkedinAccountName: "John Smith",
      leadsCount: 0,
      sentCount: 0,
      repliedCount: 0,
      acceptedCount: 0,
      dailyLimit: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sequenceSteps: [],
      tags: [],
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const statusColor: Record<string, string> = {
    draft: "bg-secondary text-muted-foreground",
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    completed: "bg-info/10 text-info",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your outreach campaigns</p>
        </div>
        <Button onClick={handleCreate}><Plus className="mr-2 h-4 w-4" /> New Campaign</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Link to={`/campaigns/${c.id}`} className="font-semibold hover:text-primary transition-colors truncate flex-1 mr-2">
                  {c.name}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded p-1 hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleStatus(c.id)}>
                      {c.status === "active" ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Activate</>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(c.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge className={`${statusColor[c.status]} border-0 mb-3`}>{c.status}</Badge>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-lg font-bold">{c.leadsCount}</p><p className="text-[11px] text-muted-foreground">Leads</p></div>
                <div><p className="text-lg font-bold">{c.sentCount}</p><p className="text-[11px] text-muted-foreground">Sent</p></div>
                <div><p className="text-lg font-bold">{c.repliedCount}</p><p className="text-[11px] text-muted-foreground">Replied</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.linkedinAccountName}</span>
                <span>{formatDate(c.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No campaigns found</div>
      )}
    </div>
  );
}

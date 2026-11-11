import { useState } from "react";
import { Link } from "react-router-dom";
import { mockAgents, type Agent } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Bot, Plus, Search, MoreVertical, Pause, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AgentsPage() {
  const [agents, setAgents] = useLocalStorage<Agent[]>("dmchamp_agents", mockAgents);
  const [search, setSearch] = useState("");

  const filtered = agents.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a)
    );
    toast.success("Agent status updated");
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    toast.success("Agent deleted");
  };

  const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    draft: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">AI Agents</h1>
          <p className="text-sm text-muted-foreground">{agents.length} agents total</p>
        </div>
        <Link to="/dashboard/agents/create" className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Create Agent
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Link to={`/dashboard/agents/${agent.id}`} className="font-heading font-semibold hover:text-primary">{agent.name}</Link>
                  <p className="text-xs text-muted-foreground">{agent.website}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded p-1 text-muted-foreground hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleStatus(agent.id)}>
                    {agent.status === "active" ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteAgent(agent.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[agent.status])}>{agent.status}</span>
              <div className="flex gap-1">
                {agent.channels.map((ch) => (
                  <span key={ch} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{ch}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
              <div><p className="text-xs text-muted-foreground">Chats</p><p className="font-heading text-sm font-semibold">{formatNumber(agent.totalConversations)}</p></div>
              <div><p className="text-xs text-muted-foreground">Conversions</p><p className="font-heading text-sm font-semibold">{formatNumber(agent.conversionsCount)}</p></div>
              <div><p className="text-xs text-muted-foreground">Revenue</p><p className="font-heading text-sm font-semibold">{formatCurrency(agent.revenue)}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/shared/PageHeader";
import { mockLogs } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function LogManagementPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const filtered = mockLogs.filter((l) =>
    (levelFilter === "all" || l.level === levelFilter) &&
    (search === "" || l.message.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Log Management" description="Search and filter application logs" />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-border bg-card pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex gap-1">
          {["all", "debug", "info", "warning", "error", "fatal"].map((l) => (
            <Button key={l} size="sm" variant={levelFilter === l ? "default" : "outline"} onClick={() => setLevelFilter(l)} className="capitalize text-xs">{l}</Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {filtered.map((log) => (
          <Link key={log.id} to={`/dashboard/logs/${log.id}`} className="flex items-start gap-3 px-4 py-3 border-b border-border hover:bg-accent/50 transition-colors">
            <StatusBadge status={log.level === "fatal" ? "critical" : log.level} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-mono truncate">{log.message}</p>
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                <span>{log.source}</span>
                <span>{log.hostname}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

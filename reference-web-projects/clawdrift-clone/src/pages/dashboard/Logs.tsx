import { useState, useMemo } from "react";
import { generateLogs, type LogEntry } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const levelColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  debug: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function LogsPage() {
  const allLogs = useMemo(() => generateLogs(100), []);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filtered = allLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.source.includes(search);
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logs ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 font-mono text-xs">
            {filtered.slice(0, 50).map((log) => (
              <div key={log.id} className="flex items-start gap-2 rounded p-2 hover:bg-accent/50">
                <span className="shrink-0 text-muted-foreground w-36">{formatDateTime(log.timestamp)}</span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${levelColors[log.level]}`}>
                  {log.level}
                </span>
                <span className="shrink-0 text-primary w-16">{log.source}</span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

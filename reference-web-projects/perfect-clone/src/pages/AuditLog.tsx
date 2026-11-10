import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { mockAuditLog } from "@/data/mockData";
import { Search } from "lucide-react";
import { useState } from "react";
import type { AuditLogEntry } from "@/types";

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const filtered = mockAuditLog.filter((e) => e.details.toLowerCase().includes(search.toLowerCase()) || e.userName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Audit Log" description="Track all actions performed in your account" />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" placeholder="Search audit log..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<AuditLogEntry>
          data={filtered}
          columns={[
            { header: "User", accessor: (e) => <span className="font-medium">{e.userName}</span> },
            { header: "Action", accessor: (e) => <span className="capitalize">{e.action}</span> },
            { header: "Resource", accessor: (e) => <span className="capitalize">{e.resource.replace(/_/g, " ")}</span> },
            { header: "Details", accessor: "details" },
            { header: "IP", accessor: (e) => <code className="text-xs font-mono text-muted-foreground">{e.ipAddress}</code> },
            { header: "Date", accessor: (e) => new Date(e.createdAt).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}

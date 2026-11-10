import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockCustomers } from "@/data/mockData";
import { formatCurrency } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import type { Customer } from "@/types";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockCustomers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers"
        description="Manage your customer base"
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="churned">Churned</option>
          <option value="cancelled">Cancelled</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Customer>
          data={filtered}
          columns={[
            { header: "Customer", accessor: (c) => (
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
            )},
            { header: "Plan", accessor: "plan" },
            { header: "Status", accessor: (c) => <StatusBadge status={c.status} /> },
            { header: "MRR", accessor: (c) => formatCurrency(c.mrr) },
            { header: "LTV", accessor: (c) => formatCurrency(c.ltv) },
            { header: "Source", accessor: "source" },
            { header: "Country", accessor: "country" },
          ]}
        />
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockTransactions } from "@/data/mockData";
import { formatCurrency } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "@/types";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockTransactions.filter((t) => {
    const matchesSearch = t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Transactions"
        description="View all payment transactions"
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="all">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="smart_charge">Smart Charge</option>
          <option value="refund">Refund</option>
          <option value="one_time">One-time</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Transaction>
          data={filtered}
          columns={[
            { header: "Customer", accessor: (t) => <span className="font-medium">{t.customerName}</span> },
            { header: "Amount", accessor: (t) => <span className="font-semibold">{formatCurrency(t.amount)}</span> },
            { header: "Status", accessor: (t) => <StatusBadge status={t.status} /> },
            { header: "Type", accessor: (t) => <span className="capitalize">{t.type.replace(/_/g, " ")}</span> },
            { header: "Description", accessor: "description" },
            { header: "Stripe ID", accessor: (t) => <code className="text-xs font-mono text-muted-foreground">{t.stripeId.slice(0, 16)}...</code> },
          ]}
        />
      </div>
    </div>
  );
}

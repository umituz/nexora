import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockSegments } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Segment } from "@/types";

export default function Segments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Segments"
        description="Customer segments for targeted actions"
        actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />New Segment</Button>}
      />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Segment>
          data={mockSegments}
          columns={[
            { header: "Segment", accessor: (s) => (
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            )},
            { header: "Customers", accessor: (s) => <span className="font-semibold">{s.customerCount}</span> },
            { header: "Criteria", accessor: (s) => <span className="text-xs text-muted-foreground">{s.criteria.length} rule(s)</span> },
            { header: "Created", accessor: (s) => new Date(s.createdAt).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockChartData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK, dateTickFormatter } from "@/utils/chartTheme";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports" description="Generate and export reports" actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export PDF</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ title: "Revenue Report", desc: "Monthly revenue breakdown" }, { title: "Conversion Report", desc: "Trial-to-paid analysis" }, { title: "Churn Report", desc: "Customer retention metrics" }].map((r) => (
          <div key={r.title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors cursor-pointer">
            <FileText className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold">{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Revenue Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
            <XAxis dataKey="date" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} tickFormatter={dateTickFormatter} />
            <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { generateUsageData } from "@/lib/mock-data";
import { formatCurrency, calculateUsagePercentage } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UsagePage() {
  const data = generateUsageData(30);
  const totalMessages = data.reduce((sum, d) => sum + d.messages, 0);
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Messages Used</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalMessages.toLocaleString()} / 10,000</p>
            <Progress value={calculateUsagePercentage(totalMessages, 10000)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tokens</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data.reduce((s, d) => s + d.tokens, 0).toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Estimated Cost</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(totalCost)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Daily Usage</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

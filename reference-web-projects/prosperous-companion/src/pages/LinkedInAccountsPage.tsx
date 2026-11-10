import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Settings, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";

const statusConfig: Record<string, { color: string; icon: typeof Wifi; label: string }> = {
  connected: { color: "bg-success/10 text-success", icon: Wifi, label: "Connected" },
  disconnected: { color: "bg-destructive/10 text-destructive", icon: WifiOff, label: "Disconnected" },
  warming_up: { color: "bg-warning/10 text-warning", icon: AlertTriangle, label: "Warming Up" },
  limited: { color: "bg-warning/10 text-warning", icon: AlertTriangle, label: "Limited" },
};

export default function LinkedInAccountsPage() {
  const { linkedinAccounts, setLinkedinAccounts } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    setLinkedinAccounts((prev) => [
      ...prev,
      {
        id: generateId(), name: form.name, email: form.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name.replace(/\s/g, "")}`,
        status: "warming_up", dailyLimit: 25, usedToday: 0,
        connectedAt: new Date().toISOString(), lastActiveAt: new Date().toISOString(),
        connectionCount: 0, pendingInvites: 0,
      },
    ]);
    setForm({ name: "", email: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LinkedIn Accounts</h1>
          <p className="text-muted-foreground">{linkedinAccounts.length} accounts connected</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Account</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add LinkedIn Account</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" /></div>
              <Button onClick={handleAdd} className="w-full">Connect Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {linkedinAccounts.map((acc) => {
          const cfg = statusConfig[acc.status];
          const usagePercent = acc.dailyLimit > 0 ? (acc.usedToday / acc.dailyLimit) * 100 : 0;
          return (
            <Card key={acc.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={acc.avatar} alt="" className="h-10 w-10 rounded-full bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.email}</p>
                  </div>
                  <Badge className={`${cfg.color} border-0 text-xs`}>{cfg.label}</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Daily Usage</span>
                      <span>{acc.usedToday}/{acc.dailyLimit}</span>
                    </div>
                    <Progress value={usagePercent} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground text-xs">Connections</span><p className="font-medium">{acc.connectionCount.toLocaleString()}</p></div>
                    <div><span className="text-muted-foreground text-xs">Pending</span><p className="font-medium">{acc.pendingInvites}</p></div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Proxy: {acc.proxyId ? "Active" : "None"}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(acc.connectedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

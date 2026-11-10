import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { generateId } from "@/lib/calculations";
import type { Proxy } from "@/lib/mock-data";

export default function ProxiesPage() {
  const { proxies, setProxies } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", host: "", port: "8080", country: "United States", type: "residential" as Proxy["type"] });

  const handleAdd = () => {
    if (!form.name || !form.host) return;
    setProxies((prev) => [
      ...prev,
      { id: generateId(), name: form.name, host: form.host, port: parseInt(form.port) || 8080, type: form.type, country: form.country, status: "active", createdAt: new Date().toISOString() },
    ]);
    setForm({ name: "", host: "", port: "8080", country: "United States", type: "residential" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proxy Management</h1>
          <p className="text-muted-foreground">Manage proxies for your LinkedIn accounts</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Proxy</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Proxy</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Host</Label><Input value={form.host} onChange={(e) => setForm((p) => ({ ...p, host: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Port</Label><Input value={form.port} onChange={(e) => setForm((p) => ({ ...p, port: e.target.value }))} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as Proxy["type"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="datacenter">Datacenter</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Add Proxy</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {proxies.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.host}:{p.port}</p>
                  </div>
                </div>
                <Badge className={`border-0 text-xs ${p.status === "active" ? "bg-success/10 text-success" : p.status === "error" ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>
                  {p.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="capitalize">{p.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{p.country}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assigned to</span><span>{p.linkedinAccountName || "Unassigned"}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-end">
                <button onClick={() => setProxies((prev) => prev.filter((x) => x.id !== p.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

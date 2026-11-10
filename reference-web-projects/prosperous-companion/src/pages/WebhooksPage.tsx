import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Webhook } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";

export default function WebhooksPage() {
  const { webhooks, setWebhooks } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", url: "" });

  const handleAdd = () => {
    if (!form.name || !form.url) return;
    setWebhooks((prev) => [...prev, { id: generateId(), ...form, events: ["message.received"], active: true, secret: "whsec_****", createdAt: new Date().toISOString(), failureCount: 0 }]);
    setForm({ name: "", url: "" }); setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Webhooks</h1><p className="text-muted-foreground">Receive real-time event notifications</p></div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Webhook</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Webhook</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>URL</Label><Input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://" /></div>
              <Button onClick={handleAdd} className="w-full">Create Webhook</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {webhooks.map((w) => (
          <Card key={w.id}><CardContent className="p-4 flex items-center gap-4">
            <Webhook className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{w.name}</p>
              <p className="text-xs text-muted-foreground truncate">{w.url}</p>
              <div className="flex gap-1 mt-1">{w.events.map((e) => <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>)}</div>
            </div>
            <div className="flex items-center gap-3">
              {w.failureCount > 0 && <span className="text-xs text-destructive">{w.failureCount} failures</span>}
              <Switch checked={w.active} onCheckedChange={(v) => setWebhooks((prev) => prev.map((x) => x.id === w.id ? { ...x, active: v } : x))} />
              <button onClick={() => setWebhooks((prev) => prev.filter((x) => x.id !== w.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

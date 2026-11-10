import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Trash2, Key } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";

export default function ApiKeysPage() {
  const { apiKeys, setApiKeys } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name) return;
    setApiKeys((prev) => [...prev, { id: generateId(), name, key: `pk_live_${Math.random().toString(36).slice(2, 30)}`, permissions: ["read", "write"], createdAt: new Date().toISOString(), active: true }]);
    setName(""); setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">API Keys</h1><p className="text-muted-foreground">Manage API access</p></div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Create Key</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create API Key</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <Button onClick={handleAdd} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {apiKeys.map((k) => (
          <Card key={k.id}><CardContent className="p-4 flex items-center gap-4">
            <Key className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{k.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{k.key.slice(0, 20)}...</p>
              <div className="flex gap-1 mt-1">{k.permissions.map((p) => <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigator.clipboard.writeText(k.key)} className="rounded p-1 hover:bg-secondary"><Copy className="h-4 w-4 text-muted-foreground" /></button>
              <Switch checked={k.active} onCheckedChange={(v) => setApiKeys((prev) => prev.map((x) => x.id === k.id ? { ...x, active: v } : x))} />
              <button onClick={() => setApiKeys((prev) => prev.filter((x) => x.id !== k.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

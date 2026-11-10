import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { generateId } from "@/lib/calculations";

const presetColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#6366f1"];

export default function TagsPage() {
  const { tags, setTags } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", color: "#8b5cf6" });

  const handleAdd = () => {
    if (!form.name) return;
    setTags((prev) => [...prev, { id: generateId(), name: form.name, color: form.color, count: 0, createdAt: new Date().toISOString() }]);
    setForm({ name: "", color: "#8b5cf6" }); setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Tags</h1><p className="text-muted-foreground">Organize leads and campaigns</p></div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Create Tag</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Tag</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Color</Label><div className="flex gap-2 mt-1">{presetColors.map((c) => (<button key={c} onClick={() => setForm((p) => ({ ...p, color: c }))} className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: c, borderColor: form.color === c ? "hsl(var(--foreground))" : "transparent" }} />))}</div></div>
              <Button onClick={handleAdd} className="w-full">Create Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {tags.map((t) => (
          <Card key={t.id}><CardContent className="p-4 flex items-center gap-3">
            <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
            <div className="flex-1 min-w-0"><p className="font-medium truncate">{t.name}</p><p className="text-xs text-muted-foreground">{t.count} items</p></div>
            <button onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

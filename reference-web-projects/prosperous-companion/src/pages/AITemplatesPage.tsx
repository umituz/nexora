import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Copy, Sparkles, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";
import type { AITemplate } from "@/lib/mock-data";

const categoryColors: Record<string, string> = {
  connection_request: "bg-info/10 text-info",
  follow_up: "bg-warning/10 text-warning",
  introduction: "bg-primary/10 text-primary",
  pitch: "bg-success/10 text-success",
  thank_you: "bg-secondary text-foreground",
};

export default function AITemplatesPage() {
  const { aiTemplates, setAITemplates } = useData();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "introduction" as AITemplate["category"], content: "" });

  const handleCreate = () => {
    if (!form.name || !form.content) return;
    const vars = (form.content.match(/\{\{(\w+)\}\}/g) || []).map((v) => v.replace(/\{\{|\}\}/g, ""));
    const template: AITemplate = {
      id: generateId(), ...form, variables: vars, usageCount: 0, replyRate: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setAITemplates((prev) => [template, ...prev]);
    setForm({ name: "", category: "introduction", content: "" });
    setShowCreate(false);
  };

  const handleUpdate = () => {
    if (!editingId || !form.name || !form.content) return;
    const vars = (form.content.match(/\{\{(\w+)\}\}/g) || []).map((v) => v.replace(/\{\{|\}\}/g, ""));
    setAITemplates((prev) => prev.map((t) => t.id === editingId ? { ...t, ...form, variables: vars, updatedAt: new Date().toISOString() } : t));
    setEditingId(null);
    setForm({ name: "", category: "introduction", content: "" });
  };

  const handleDelete = (id: string) => {
    setAITemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (t: AITemplate) => {
    setForm({ name: t.name, category: t.category, content: t.content });
    setEditingId(t.id);
    setShowCreate(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Templates</h1>
          <p className="text-muted-foreground">Create and manage AI-powered message templates</p>
        </div>
        <Dialog open={showCreate} onOpenChange={(o) => { setShowCreate(o); if (!o) { setEditingId(null); setForm({ name: "", category: "introduction", content: "" }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingId ? "Edit Template" : "Create Template"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as AITemplate["category"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connection_request">Connection Request</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="introduction">Introduction</SelectItem>
                    <SelectItem value="pitch">Pitch</SelectItem>
                    <SelectItem value="thank_you">Thank You</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={5} placeholder="Use {{firstName}}, {{company}}, etc. for variables" />
              </div>
              <Button onClick={editingId ? handleUpdate : handleCreate} className="w-full">{editingId ? "Update" : "Create"} Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aiTemplates.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <Badge className={`${categoryColors[t.category]} border-0 text-xs mt-1`}>{t.category.replace("_", " ")}</Badge>
                </div>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{t.content}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.variables.map((v) => (
                  <span key={v} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{`{{${v}}}`}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.usageCount} uses · {t.replyRate}% reply rate</span>
                <div className="flex gap-1">
                  <button onClick={() => navigator.clipboard.writeText(t.content)} className="rounded p-1 hover:bg-secondary"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => startEdit(t)} className="rounded p-1 hover:bg-secondary text-primary">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="rounded p-1 hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

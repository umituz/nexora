import { useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { generateId, formatNumber } from "@/lib/calculations";
import type { MessageTemplate } from "@/lib/types";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => getStorageItem(STORAGE_KEYS.TEMPLATES, MOCK_TEMPLATES));
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Sales", body: "" });

  const filtered = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.body) { toast.error("Name and body required"); return; }
    const tpl: MessageTemplate = { id: generateId(), name: form.name, category: form.category, body: form.body, variables: [], usageCount: 0, createdAt: new Date().toISOString() };
    const updated = [tpl, ...templates];
    setTemplates(updated);
    setStorageItem(STORAGE_KEYS.TEMPLATES, updated);
    setForm({ name: "", category: "Sales", body: "" });
    setAddOpen(false);
    toast.success("Template created!");
  };

  const handleDelete = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    setStorageItem(STORAGE_KEYS.TEMPLATES, updated);
    toast.success("Template deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Message Templates</h1><p className="text-sm text-muted-foreground">{templates.length} templates</p></div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />New Template</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Quote Follow-Up" /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm(p=>({...p,category:e.target.value}))} /></div>
              <div><Label>Message Body</Label><Textarea value={form.body} onChange={(e) => setForm(p=>({...p,body:e.target.value}))} rows={4} placeholder="Use {firstName} for variables" /></div>
              <Button onClick={handleAdd} className="w-full">Create Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search templates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div><p className="font-semibold text-foreground">{t.name}</p><span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.category}</span></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleDelete(t.id)} className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{t.body}</p>
              <p className="text-xs text-muted-foreground">Used {formatNumber(t.usageCount)} times</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

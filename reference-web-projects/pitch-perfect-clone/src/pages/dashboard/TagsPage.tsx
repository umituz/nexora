import { useState } from "react";
import { MOCK_TAGS } from "@/lib/mock-data";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { formatNumber, generateId } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { Tag } from "@/lib/types";
import { toast } from "sonner";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(() => getStorageItem(STORAGE_KEYS.TAGS, MOCK_TAGS));
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");

  const handleAdd = () => {
    if (!newName) return;
    const tag: Tag = { id: generateId(), name: newName, color: newColor, contactCount: 0 };
    const updated = [...tags, tag];
    setTags(updated); setStorageItem(STORAGE_KEYS.TAGS, updated);
    setNewName(""); setAddOpen(false); toast.success("Tag created!");
  };

  const handleDelete = (id: string) => {
    const updated = tags.filter(t => t.id !== id);
    setTags(updated); setStorageItem(STORAGE_KEYS.TAGS, updated); toast.success("Tag deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Tags</h1><p className="text-sm text-muted-foreground">Organize your contacts with tags</p></div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />New Tag</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Create Tag</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
              <div><Label>Color</Label><input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
              <Button onClick={handleAdd} className="w-full">Create Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((t) => (
          <Card key={t.id}><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
              <div><p className="font-medium text-foreground">{t.name}</p><p className="text-xs text-muted-foreground">{formatNumber(t.contactCount)} contacts</p></div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

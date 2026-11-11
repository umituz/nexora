import { mockTags, type TagItem } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TagsPage() {
  const [tags, setTags] = useLocalStorage<TagItem[]>("dmchamp_tags", mockTags);
  const [newTag, setNewTag] = useState("");
  const addTag = () => { if (!newTag.trim()) return; setTags([...tags, { id: `tg${Date.now()}`, name: newTag.toLowerCase().replace(/\s+/g, "-"), color: "#10B981", contactCount: 0 }]); setNewTag(""); toast.success("Tag added"); };
  const deleteTag = (id: string) => { setTags(tags.filter((t) => t.id !== id)); toast.success("Tag deleted"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Tags</h1>
      <div className="flex gap-2"><input type="text" placeholder="New tag name..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} className="max-w-xs rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /><button onClick={addTag} className="rounded-lg bg-gradient-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /></button></div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <div className="h-3 w-3 rounded-full" style={{backgroundColor: t.color}} />
            <span className="text-sm font-medium">{t.name}</span>
            <span className="text-xs text-muted-foreground">({t.contactCount})</span>
            <button onClick={() => deleteTag(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

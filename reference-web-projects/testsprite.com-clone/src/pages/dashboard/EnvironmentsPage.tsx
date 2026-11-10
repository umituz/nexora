import { useState } from "react";
import { MOCK_ENVIRONMENTS, type Environment } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getStatusBg, formatRelativeTime, generateId } from "@/utils/calculations";
import { Globe, Plus, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function EnvironmentsPage() {
  const [envs, setEnvs] = useLocalStorage<Environment[]>("ts_environments", MOCK_ENVIRONMENTS);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", url: "" });

  const create = () => {
    if (!draft.name.trim()) { toast.error("Name is required"); return; }
    const env: Environment = {
      id: `env-${generateId()}`,
      name: draft.name,
      url: draft.url || "https://example.com",
      status: "active",
      variables: 0,
      lastUsed: new Date().toISOString(),
    };
    setEnvs([env, ...envs]);
    setDraft({ name: "", url: "" });
    setOpen(false);
    toast.success("Environment created");
  };

  const remove = (id: string) => {
    setEnvs(envs.filter((e) => e.id !== id));
    toast.success("Environment removed");
  };

  const toggle = (id: string) => {
    setEnvs(envs.map((e) => e.id === id ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> New Environment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Environment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name (e.g., Production)" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Input placeholder="URL" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
              <Button onClick={create} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {envs.map((env) => (
          <div key={env.id} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Globe size={18} className="text-primary" />
              <h3 className="font-heading font-semibold text-sm flex-1">{env.name}</h3>
              <span className={`status-badge ${getStatusBg(env.status)}`}>{env.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 break-all">{env.url}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{env.variables} variables · Last used {formatRelativeTime(env.lastUsed)}</span>
              <div className="flex gap-2">
                <button onClick={() => toggle(env.id)} className="text-muted-foreground hover:text-foreground" title="Toggle"><Power size={14} /></button>
                <button onClick={() => remove(env.id)} className="text-destructive hover:opacity-80" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

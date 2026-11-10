import { useState } from "react";
import { MOCK_VARIABLES, MOCK_ENVIRONMENTS, type Variable } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId } from "@/utils/calculations";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function VariablesPage() {
  const [vars, setVars] = useLocalStorage<Variable[]>("ts_variables", MOCK_VARIABLES);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ key: "", value: "", environmentId: MOCK_ENVIRONMENTS[0].id, isSecret: false });

  const create = () => {
    if (!draft.key.trim()) { toast.error("Key is required"); return; }
    const env = MOCK_ENVIRONMENTS.find((e) => e.id === draft.environmentId);
    const v: Variable = {
      id: `var-${generateId()}`,
      key: draft.key,
      value: draft.value,
      environmentId: draft.environmentId,
      environmentName: env?.name ?? "Unknown",
      isSecret: draft.isSecret,
      updatedAt: new Date().toISOString(),
    };
    setVars([v, ...vars]);
    setDraft({ key: "", value: "", environmentId: MOCK_ENVIRONMENTS[0].id, isSecret: false });
    setOpen(false);
    toast.success("Variable created");
  };

  const remove = (id: string) => {
    setVars(vars.filter((v) => v.id !== id));
    toast.success("Variable removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> New Variable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Variable</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="KEY_NAME" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} />
              <Input placeholder="Value" value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} />
              <Select value={draft.environmentId} onValueChange={(v) => setDraft({ ...draft, environmentId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_ENVIRONMENTS.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={draft.isSecret} onCheckedChange={(c) => setDraft({ ...draft, isSecret: c === true })} />
                Mark as secret
              </label>
              <Button onClick={create} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {vars.map((v) => (
          <div key={v.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-heading font-medium truncate">{v.key}</div>
              <div className="text-xs text-muted-foreground">{v.environmentName}</div>
            </div>
            <div className="flex items-center gap-3">
              <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                {v.isSecret && !visible[v.id] ? "••••••••" : v.value || "—"}
              </code>
              {v.isSecret && (
                <button onClick={() => setVisible((p) => ({ ...p, [v.id]: !p[v.id] }))} className="text-muted-foreground hover:text-foreground">
                  {visible[v.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}
              <button onClick={() => remove(v.id)} className="text-destructive hover:opacity-80"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

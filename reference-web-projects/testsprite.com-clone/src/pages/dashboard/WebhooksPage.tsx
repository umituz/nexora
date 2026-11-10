import { useState } from "react";
import { MOCK_WEBHOOKS, type Webhook } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getStatusBg, formatRelativeTime, generateId } from "@/utils/calculations";
import { Plus, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const EVENT_OPTIONS = ["test.completed", "test.failed", "test.started", "bug.created", "deployment.success"];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useLocalStorage<Webhook[]>("ts_webhooks", MOCK_WEBHOOKS);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ name: string; url: string; events: string[] }>({ name: "", url: "", events: [] });

  const create = () => {
    if (!draft.name.trim() || !draft.url.trim()) { toast.error("Name and URL are required"); return; }
    const wh: Webhook = {
      id: `wh-${generateId()}`,
      name: draft.name,
      url: draft.url,
      events: draft.events.length ? draft.events : ["test.completed"],
      status: "active",
      lastTriggered: new Date().toISOString(),
      successRate: 100,
    };
    setWebhooks([wh, ...webhooks]);
    setDraft({ name: "", url: "", events: [] });
    setOpen(false);
    toast.success("Webhook created");
  };

  const remove = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
    toast.success("Webhook removed");
  };

  const toggle = (id: string) => {
    setWebhooks(webhooks.map((w) => w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w));
  };

  const toggleEvent = (e: string) => {
    setDraft((d) => ({ ...d, events: d.events.includes(e) ? d.events.filter((x) => x !== e) : [...d.events, e] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> New Webhook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Webhook</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Input placeholder="https://your-endpoint.com/webhook" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Events</p>
                <div className="flex flex-wrap gap-2">
                  {EVENT_OPTIONS.map((e) => (
                    <button key={e} type="button" onClick={() => toggleEvent(e)}
                      className={`text-xs px-2 py-1 rounded border ${draft.events.includes(e) ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={create} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {webhooks.map((wh) => (
          <div key={wh.id} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2 gap-2">
              <h3 className="font-heading font-semibold text-sm flex-1 truncate">{wh.name}</h3>
              <span className={`status-badge ${getStatusBg(wh.status)}`}>{wh.status}</span>
              <button onClick={() => toggle(wh.id)} className="text-muted-foreground hover:text-foreground"><Power size={14} /></button>
              <button onClick={() => remove(wh.id)} className="text-destructive hover:opacity-80"><Trash2 size={14} /></button>
            </div>
            <p className="text-xs text-muted-foreground mb-2 font-heading break-all">{wh.url}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {wh.events.map((e) => <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{e}</span>)}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Success rate: {wh.successRate}%</span>
              <span>Last triggered: {formatRelativeTime(wh.lastTriggered)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

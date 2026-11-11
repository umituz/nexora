import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { mockAgents, type Agent } from "@/data/mock-data";
import { CHANNELS } from "@/constants/app";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AgentCreatePage() {
  const navigate = useNavigate();
  const [, setAgents] = useLocalStorage<Agent[]>("dmchamp_agents", mockAgents);
  const [form, setForm] = useState({ name: "", website: "", greeting: "", instructions: "", personality: "", channels: [] as string[] });

  const toggleChannel = (ch: string) => {
    setForm((p) => ({
      ...p,
      channels: p.channels.includes(ch) ? p.channels.filter((c) => c !== ch) : [...p.channels, ch],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.website) { toast.error("Name and website are required"); return; }
    const newAgent: Agent = {
      id: `a${Date.now()}`,
      name: form.name,
      website: form.website,
      status: "draft",
      channels: form.channels,
      totalConversations: 0,
      conversionsCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString().split("T")[0],
      instructions: form.instructions,
      greeting: form.greeting,
      personality: form.personality,
    };
    setAgents((prev) => [...prev, newAgent]);
    toast.success("Agent created!");
    navigate("/dashboard/agents");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-heading text-2xl font-bold">Create AI Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Agent Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. FueGenix Sales Agent" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Website URL</label>
            <input type="url" required value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Greeting Message</label>
            <input type="text" value={form.greeting} onChange={(e) => setForm((p) => ({ ...p, greeting: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Hi! How can I help you?" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Instructions</label>
            <textarea rows={4} value={form.instructions} onChange={(e) => setForm((p) => ({ ...p, instructions: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Describe how the AI should behave..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Personality</label>
            <input type="text" value={form.personality} onChange={(e) => setForm((p) => ({ ...p, personality: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Professional, friendly, empathetic" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <label className="mb-3 block text-sm font-medium">Channels</label>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => toggleChannel(ch.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${form.channels.includes(ch.id) ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`}
              >
                {ch.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-gradient-primary py-2.5 font-medium text-primary-foreground hover:opacity-90">Create Agent</button>
      </form>
    </div>
  );
}

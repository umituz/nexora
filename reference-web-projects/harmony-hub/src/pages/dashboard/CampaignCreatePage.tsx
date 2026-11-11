import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { mockCampaigns, mockAgents, type Campaign, type Agent } from "@/data/mock-data";
import { CHANNELS } from "@/constants/app";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CampaignCreatePage() {
  const navigate = useNavigate();
  const [, setCampaigns] = useLocalStorage<Campaign[]>("dmchamp_campaigns", mockCampaigns);
  const [agents] = useLocalStorage<Agent[]>("dmchamp_agents", mockAgents);
  const [form, setForm] = useState({ name: "", type: "outgoing" as Campaign["type"], channel: "whatsapp", agentId: agents[0]?.id ?? "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error("Fill required fields"); return; }
    const agent = agents.find((a) => a.id === form.agentId);
    const newCampaign: Campaign = {
      id: `cp${Date.now()}`,
      name: form.name,
      type: form.type,
      channel: form.channel,
      agentId: form.agentId,
      agentName: agent?.name ?? "",
      status: "draft",
      sentCount: 0,
      openedCount: 0,
      repliedCount: 0,
      convertedCount: 0,
      scheduledAt: null,
      createdAt: new Date().toISOString().split("T")[0],
      message: form.message,
      targetTags: [],
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    toast.success("Campaign created!");
    navigate("/dashboard/campaigns");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-heading text-2xl font-bold">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Campaign Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Campaign["type"] }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="outgoing">Outgoing</option>
              <option value="incoming">Incoming</option>
              <option value="comment-to-dm">Comment-to-DM</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Channel</label>
            <select value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {CHANNELS.map((ch) => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Agent</label>
            <select value={form.agentId} onChange={(e) => setForm((p) => ({ ...p, agentId: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea rows={4} required value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-gradient-primary py-2.5 font-medium text-primary-foreground hover:opacity-90">Create Campaign</button>
      </form>
    </div>
  );
}

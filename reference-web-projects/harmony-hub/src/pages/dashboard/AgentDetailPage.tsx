import { useParams, useNavigate, Link } from "react-router-dom";
import { mockAgents, type Agent } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ArrowLeft, Bot, Globe, MessageSquare, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency, formatNumber, calculateConversionRate } from "@/lib/calculations";
import { useState } from "react";
import { toast } from "sonner";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agents, setAgents] = useLocalStorage<Agent[]>("dmchamp_agents", mockAgents);

  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Agent not found.{" "}
        <Link to="/dashboard/agents" className="text-primary">Go back</Link>
      </div>
    );
  }

  return <AgentDetailContent agent={agent} agents={agents} setAgents={setAgents} navigate={navigate} />;
}

function AgentDetailContent({
  agent,
  agents,
  setAgents,
  navigate,
}: {
  agent: Agent;
  agents: Agent[];
  setAgents: (value: Agent[] | ((val: Agent[]) => Agent[])) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: agent.name,
    greeting: agent.greeting,
    instructions: agent.instructions,
    personality: agent.personality,
  });

  const handleSave = () => {
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...form } : a)));
    setEditing(false);
    toast.success("Agent updated");
  };

  const convRate = calculateConversionRate(agent.conversionsCount, agent.totalConversations);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">{agent.name}</h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Globe className="h-3 w-3" /> {agent.website}
            </p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Conversations", value: formatNumber(agent.totalConversations), icon: MessageSquare },
          { label: "Conversions", value: formatNumber(agent.conversionsCount), icon: TrendingUp },
          { label: "Revenue", value: formatCurrency(agent.revenue), icon: DollarSign },
          { label: "Conv. Rate", value: `${convRate}%`, icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <s.icon className="h-3 w-3" />
              {s.label}
            </div>
            <p className="mt-1 font-heading text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      {editing ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Greeting</label>
            <input type="text" value={form.greeting} onChange={(e) => setForm((p) => ({ ...p, greeting: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Instructions</label>
            <textarea rows={4} value={form.instructions} onChange={(e) => setForm((p) => ({ ...p, instructions: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Personality</label>
            <input type="text" value={form.personality} onChange={(e) => setForm((p) => ({ ...p, personality: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={handleSave} className="rounded-lg bg-gradient-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Greeting</p>
            <p className="mt-1 text-sm">{agent.greeting}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Instructions</p>
            <p className="mt-1 text-sm">{agent.instructions}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Personality</p>
            <p className="mt-1 text-sm">{agent.personality}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Channels</p>
            <div className="mt-1 flex gap-1">
              {agent.channels.map((ch) => (
                <span key={ch} className="rounded bg-secondary px-2 py-0.5 text-xs">{ch}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

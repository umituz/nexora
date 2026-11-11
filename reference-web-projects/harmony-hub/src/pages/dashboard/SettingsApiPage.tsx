import { useState } from "react";
import { toast } from "sonner";

export default function SettingsApiPage() {
  const [apiKey] = useState("dmchamp_sk_live_xxxxxxxxxxxxxxxxxxxxx");
  const [webhookUrl, setWebhookUrl] = useState("");
  const copy = () => { navigator.clipboard.writeText(apiKey); toast.success("Copied!"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">API & Webhooks</h1>
      <div className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div><label className="mb-1 block text-sm font-medium">API Key</label><div className="flex gap-2"><input type="text" readOnly value={apiKey} className="flex-1 rounded-lg border border-input bg-secondary px-4 py-2.5 text-sm font-mono" /><button onClick={copy} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Copy</button></div></div>
        <div><label className="mb-1 block text-sm font-medium">Webhook URL</label><input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/webhook" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <button onClick={() => toast.success("Webhook saved")} className="rounded-lg bg-gradient-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Save</button>
      </div>
    </div>
  );
}

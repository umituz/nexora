import { APP_NAME } from "@/constants/app";
import { Palette } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WhiteLabelPage() {
  const [form, setForm] = useState({ brandName: "", primaryColor: "#10B981", logo: "", domain: "" });
  const save = () => { toast.success("White label settings saved"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">White Label</h1>
      <p className="text-sm text-muted-foreground">Customize {APP_NAME} with your own branding for clients.</p>
      <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div><label className="mb-1 block text-sm font-medium">Brand Name</label><input type="text" value={form.brandName} onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your Brand" /></div>
        <div><label className="mb-1 block text-sm font-medium">Primary Color</label><input type="color" value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} className="h-10 w-20 rounded border border-input" /></div>
        <div><label className="mb-1 block text-sm font-medium">Custom Domain</label><input type="text" value={form.domain} onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="app.yourdomain.com" /></div>
        <button onClick={save} className="w-full rounded-lg bg-gradient-primary py-2.5 font-medium text-primary-foreground hover:opacity-90">Save Settings</button>
      </div>
    </div>
  );
}

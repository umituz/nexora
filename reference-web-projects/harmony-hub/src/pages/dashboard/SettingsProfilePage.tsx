import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", company: user?.company ?? "" });
  const save = () => { updateProfile(form); toast.success("Profile updated"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Profile</h1>
      <div className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">{form.name.split(" ").map((n) => n[0]).join("")}</div></div>
        <div><label className="mb-1 block text-sm font-medium">Name</label><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="mb-1 block text-sm font-medium">Email</label><input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="mb-1 block text-sm font-medium">Company</label><input type="text" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <button onClick={save} className="rounded-lg bg-gradient-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90">Save</button>
      </div>
    </div>
  );
}

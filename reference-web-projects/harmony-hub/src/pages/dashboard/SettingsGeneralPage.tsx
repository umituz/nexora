import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsGeneralPage() {
  const { user } = useAuth();
  const [tz, setTz] = useState(user?.timezone ?? "Europe/Amsterdam");
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">General Settings</h1>
      <div className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div><label className="mb-1 block text-sm font-medium">Timezone</label><select value={tz} onChange={(e) => { setTz(e.target.value); toast.success("Saved"); }} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option>Europe/Amsterdam</option><option>America/New_York</option><option>Asia/Tokyo</option><option>UTC</option></select></div>
        <div><label className="mb-1 block text-sm font-medium">Language</label><select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option>English</option><option>Dutch</option><option>Turkish</option></select></div>
      </div>
    </div>
  );
}

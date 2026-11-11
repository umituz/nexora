import { useState } from "react";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { UserSettings } from "@/data/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockData.settings);
  const { toast } = useToast();

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your preferences" />
      <div className="max-w-2xl space-y-6">
        {([
          { key: "autoScan" as const, label: "Auto Scan", desc: "Automatically scan library on launch" },
          { key: "showPlayCounts" as const, label: "Show Play Counts", desc: "Display play counts in song lists" },
          { key: "confirmDeletions" as const, label: "Confirm Deletions", desc: "Ask before deleting songs" },
          { key: "notificationsEnabled" as const, label: "Notifications", desc: "Receive scan and activity notifications" },
        ]).map((item) => (
          <div key={item.key} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <button
              onClick={() => update(item.key, !settings[item.key])}
              className={`w-11 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}

        <div className="glass-card p-4">
          <p className="text-sm font-medium text-foreground mb-2">Scan Interval</p>
          <select
            value={settings.scanInterval}
            onChange={(e) => update("scanInterval", e.target.value as UserSettings["scanInterval"])}
            className="text-sm bg-secondary text-foreground border border-border rounded-md px-3 py-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="glass-card p-4">
          <p className="text-sm font-medium text-foreground mb-2">Duplicate Sensitivity</p>
          <select
            value={settings.duplicateSensitivity}
            onChange={(e) => update("duplicateSensitivity", e.target.value as UserSettings["duplicateSensitivity"])}
            className="text-sm bg-secondary text-foreground border border-border rounded-md px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}

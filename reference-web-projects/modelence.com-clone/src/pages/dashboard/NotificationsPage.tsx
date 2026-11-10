import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockNotificationSettings, type NotificationSetting } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(() => storage.get("notificationSettings", mockNotificationSettings));

  const toggle = (id: string, channel: "email" | "inApp" | "slack") => {
    const updated = settings.map((s) => s.id === id ? { ...s, [channel]: !s[channel] } : s);
    setSettings(updated);
    storage.set("notificationSettings", updated);
  };

  const saveAll = () => {
    storage.set("notificationSettings", settings);
    toast.success("Notification preferences saved");
  };

  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader title="Notifications" description="Notification preferences" actions={<Button size="sm" onClick={saveAll}>Save Changes</Button>} />
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-secondary/50"><th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Email</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">In-App</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Slack</th></tr></thead>
          <tbody className="divide-y divide-border">
            {settings.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3"><p className="font-medium text-foreground">{n.type}</p><p className="text-xs text-muted-foreground">{n.description}</p></td>
                <td className="px-4 py-3 text-center"><Switch checked={n.email} onCheckedChange={() => toggle(n.id, "email")} /></td>
                <td className="px-4 py-3 text-center"><Switch checked={n.inApp} onCheckedChange={() => toggle(n.id, "inApp")} /></td>
                <td className="px-4 py-3 text-center"><Switch checked={n.slack} onCheckedChange={() => toggle(n.id, "slack")} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

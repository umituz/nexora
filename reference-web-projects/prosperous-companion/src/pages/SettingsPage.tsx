import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { settings, setSettings } = useData();
  const handleSave = () => { toast.success("Settings saved successfully"); };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account settings</p></div>
      <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={settings.name} onChange={(e) => setSettings((p) => ({ ...p, name: e.target.value }))} /></div>
          <div><Label>Email</Label><Input value={settings.email} onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Timezone</Label><Select value={settings.timezone} onValueChange={(v) => setSettings((p) => ({ ...p, timezone: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="America/New_York">Eastern Time</SelectItem><SelectItem value="America/Chicago">Central Time</SelectItem><SelectItem value="America/Denver">Mountain Time</SelectItem><SelectItem value="America/Los_Angeles">Pacific Time</SelectItem><SelectItem value="Europe/London">London</SelectItem><SelectItem value="Europe/Berlin">Berlin</SelectItem></SelectContent></Select></div>
          <div><Label>Language</Label><Select value={settings.language} onValueChange={(v) => setSettings((p) => ({ ...p, language: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem><SelectItem value="es">Spanish</SelectItem></SelectContent></Select></div>
        </div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="space-y-4">
        {[
          { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive email notifications" },
          { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser push notifications" },
          { key: "weeklyReport" as const, label: "Weekly Report", desc: "Receive weekly summary" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            <Switch checked={settings[item.key]} onCheckedChange={(v) => setSettings((p) => ({ ...p, [item.key]: v }))} />
          </div>
        ))}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Security</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
          <Switch checked={settings.twoFactorEnabled} onCheckedChange={(v) => setSettings((p) => ({ ...p, twoFactorEnabled: v }))} />
        </div>
        <Button variant="outline">Change Password</Button>
      </CardContent></Card>
      <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
    </div>
  );
}

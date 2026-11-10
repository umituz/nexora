import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { mockSettings } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(mockSettings);

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Dark Mode</Label>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(["email", "push", "slack"] as const).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">{key} Notifications</Label>
              <Switch checked={settings.notifications[key]} onCheckedChange={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, [key]: v } })} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Two-Factor Authentication</Label>
            <Switch checked={settings.twoFactor} onCheckedChange={(v) => setSettings({ ...settings, twoFactor: v })} />
          </div>
          <Button variant="outline" onClick={() => toast.info("Password change — mock")}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}

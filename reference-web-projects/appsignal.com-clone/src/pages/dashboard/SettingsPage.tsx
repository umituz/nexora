import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants/app";
import { mockCurrentUser } from "@/lib/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/constants/app";
import { toast } from "sonner";
import { useState } from "react";

interface AppSettings {
  notifications: { email: boolean; slack: boolean; browser: boolean };
  timezone: string;
  dataRetention: string;
  twoFactor: boolean;
}

const defaultSettings: AppSettings = {
  notifications: { email: true, slack: true, browser: false },
  timezone: "UTC",
  dataRetention: "30 days",
  twoFactor: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  const [profile, setProfile] = useState({ name: mockCurrentUser.name, email: mockCurrentUser.email });

  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and application settings" />

      <div className="space-y-6 max-w-3xl">
        {/* Profile */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Profile</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <Button size="sm" onClick={handleSave}>Save Profile</Button>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {(["email", "slack", "browser"] as const).map((channel) => (
              <label key={channel} className="flex items-center justify-between">
                <span className="text-sm capitalize">{channel} notifications</span>
                <button
                  onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, [channel]: !settings.notifications[channel] } })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings.notifications[channel] ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${settings.notifications[channel] ? "translate-x-5" : ""}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* General */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">General</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Timezone</label>
              <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                <option value="UTC">UTC</option>
                <option value="US/Eastern">US/Eastern</option>
                <option value="US/Pacific">US/Pacific</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Data Retention</label>
              <select value={settings.dataRetention} onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                <option value="7 days">7 days</option>
                <option value="30 days">30 days</option>
                <option value="90 days">90 days</option>
                <option value="365 days">365 days</option>
              </select>
            </div>
          </div>
          <Button size="sm" onClick={handleSave}>Save Settings</Button>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Security</h3>
          <label className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-medium">Two-Factor Authentication</span>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => { setSettings({ ...settings, twoFactor: !settings.twoFactor }); toast.success(settings.twoFactor ? "2FA disabled" : "2FA enabled"); }}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.twoFactor ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${settings.twoFactor ? "translate-x-5" : ""}`} />
            </button>
          </label>
          <Button size="sm" variant="outline" onClick={() => toast.success("Password reset email sent")}>Change Password</Button>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-destructive/30 bg-card p-6">
          <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Once you delete your organization, there is no going back.</p>
          <Button size="sm" variant="destructive" onClick={() => toast.error("This action is not available in demo mode")}>Delete Organization</Button>
        </div>
      </div>
    </div>
  );
}

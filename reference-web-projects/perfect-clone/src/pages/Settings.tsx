import { PageHeader } from "@/components/dashboard/PageHeader";
import { APP_NAME, APP_VERSION, APP_SUPPORT_EMAIL } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";
import type { UserPreferences } from "@/types";

const defaultPrefs: UserPreferences = { theme: "dark", currency: "USD", timezone: "UTC", emailNotifications: true, slackNotifications: true, weeklyReport: true, language: "en" };

export default function SettingsPage() {
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, defaultPrefs);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="General Settings" description="Manage your account preferences" />
      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl space-y-6">
        <div>
          <label className="text-sm font-medium">Currency</label>
          <select value={prefs.currency} onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
            <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Timezone</label>
          <select value={prefs.timezone} onChange={(e) => setPrefs((p) => ({ ...p, timezone: e.target.value }))} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
            <option value="UTC">UTC</option><option value="US/Eastern">US/Eastern</option><option value="US/Pacific">US/Pacific</option><option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Language</label>
          <select value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
            <option value="en">English</option><option value="tr">Türkçe</option><option value="de">Deutsch</option>
          </select>
        </div>
        <Button className="gradient-bg">Save Settings</Button>
        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          <p>{APP_NAME} v{APP_VERSION} · {APP_SUPPORT_EMAIL}</p>
        </div>
      </div>
    </div>
  );
}

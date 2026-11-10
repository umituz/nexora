import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";
import { Button } from "@/components/ui/button";

interface NotifSettings {
  emailTrialStarted: boolean;
  emailTrialConverted: boolean;
  emailPaymentFailed: boolean;
  emailChargeback: boolean;
  slackTrialStarted: boolean;
  slackTrialConverted: boolean;
  slackPaymentFailed: boolean;
  slackChargeback: boolean;
  weeklyDigest: boolean;
  monthlyReport: boolean;
}

const defaults: NotifSettings = { emailTrialStarted: true, emailTrialConverted: true, emailPaymentFailed: true, emailChargeback: true, slackTrialStarted: false, slackTrialConverted: true, slackPaymentFailed: true, slackChargeback: true, weeklyDigest: true, monthlyReport: true };

export default function NotificationsSettings() {
  const [settings, setSettings] = useLocalStorage<NotifSettings>(STORAGE_KEYS.NOTIFICATIONS_READ, defaults);

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm">{label}</span>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors ${checked ? "gradient-bg" : "bg-muted"}`}>
        <div className="w-5 h-5 rounded-full bg-card shadow" style={{ transform: `translateX(${checked ? 22 : 2}px)` }} />
      </button>
    </div>
  );

  const update = (key: keyof NotifSettings) => () => setSettings((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Notification Settings" description="Configure how you receive notifications" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Email Notifications</h3>
          <Toggle label="Trial Started" checked={settings.emailTrialStarted} onChange={update("emailTrialStarted")} />
          <Toggle label="Trial Converted" checked={settings.emailTrialConverted} onChange={update("emailTrialConverted")} />
          <Toggle label="Payment Failed" checked={settings.emailPaymentFailed} onChange={update("emailPaymentFailed")} />
          <Toggle label="Chargeback Filed" checked={settings.emailChargeback} onChange={update("emailChargeback")} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Slack Notifications</h3>
          <Toggle label="Trial Started" checked={settings.slackTrialStarted} onChange={update("slackTrialStarted")} />
          <Toggle label="Trial Converted" checked={settings.slackTrialConverted} onChange={update("slackTrialConverted")} />
          <Toggle label="Payment Failed" checked={settings.slackPaymentFailed} onChange={update("slackPaymentFailed")} />
          <Toggle label="Chargeback Filed" checked={settings.slackChargeback} onChange={update("slackChargeback")} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Reports</h3>
          <Toggle label="Weekly Digest" checked={settings.weeklyDigest} onChange={update("weeklyDigest")} />
          <Toggle label="Monthly Report" checked={settings.monthlyReport} onChange={update("monthlyReport")} />
        </div>
      </div>
      <Button className="gradient-bg">Save Notification Settings</Button>
    </div>
  );
}

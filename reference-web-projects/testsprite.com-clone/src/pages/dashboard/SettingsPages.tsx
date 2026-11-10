import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link, Outlet, useLocation } from "react-router-dom";
import { DASHBOARD_LINKS } from "@/constants/app";
import { MOCK_TEAM_MEMBERS, MOCK_API_KEYS } from "@/data/mock";
import { getStatusBg } from "@/utils/calculations";

const settingsTabs = [
  { label: "General", href: DASHBOARD_LINKS.settings.general },
  { label: "Profile", href: DASHBOARD_LINKS.settings.profile },
  { label: "Billing", href: DASHBOARD_LINKS.settings.billing },
  { label: "Team", href: DASHBOARD_LINKS.settings.team },
  { label: "Integrations", href: DASHBOARD_LINKS.settings.integrations },
  { label: "Notifications", href: DASHBOARD_LINKS.settings.notifications },
  { label: "API Keys", href: DASHBOARD_LINKS.settings.apiKeys },
];

export function SettingsLayout() {
  const location = useLocation();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {settingsTabs.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === t.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export function SettingsGeneral() {
  return (
    <div className="glass-card p-5 max-w-lg">
      <h3 className="font-heading font-semibold text-sm mb-4">General Settings</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Default Project</label>
          <Input defaultValue="Acme Corp Website" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Timezone</label>
          <Input defaultValue="America/Los_Angeles" />
        </div>
        <Button size="sm" onClick={() => toast.success("Settings saved")} className="gradient-primary text-primary-foreground">Save</Button>
      </div>
    </div>
  );
}

export function SettingsProfile() {
  const { user } = useAuth();
  return (
    <div className="glass-card p-5 max-w-lg">
      <h3 className="font-heading font-semibold text-sm mb-4">Profile</h3>
      <div className="space-y-3">
        <div><label className="text-xs text-muted-foreground">Name</label><Input defaultValue={user?.name ?? ""} /></div>
        <div><label className="text-xs text-muted-foreground">Email</label><Input defaultValue={user?.email ?? ""} /></div>
        <Button size="sm" onClick={() => toast.success("Profile updated")} className="gradient-primary text-primary-foreground">Save</Button>
      </div>
    </div>
  );
}

export function SettingsBilling() {
  return (
    <div className="space-y-4 max-w-lg">
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-2">Current Plan</h3>
        <div className="text-2xl font-heading font-bold text-gradient">Standard</div>
        <p className="text-sm text-muted-foreground">$69/month · 1600 credits</p>
      </div>
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-2">Usage This Month</h3>
        <p className="text-sm text-muted-foreground">847 / 1600 credits used</p>
      </div>
    </div>
  );
}

export function SettingsTeam() {
  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-sm mb-4">Team Members</h3>
      <div className="space-y-3">
        {MOCK_TEAM_MEMBERS.map((m) => (
          <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading text-xs font-bold">
                {m.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
              </div>
            </div>
            <span className="status-badge bg-primary/10 text-primary">{m.role}</span>
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" className="mt-4" onClick={() => toast.success("Invite sent")}>Invite Member</Button>
    </div>
  );
}

export function SettingsIntegrations() {
  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-sm mb-4">Integrations</h3>
      <div className="space-y-3">
        {["GitHub", "Slack", "Jira", "Linear", "PagerDuty"].map((name) => (
          <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm">{name}</span>
            <Button size="sm" variant="outline" onClick={() => toast.success(name + " connected")}>Connect</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsNotifications() {
  return (
    <div className="glass-card p-5 max-w-lg">
      <h3 className="font-heading font-semibold text-sm mb-4">Notification Preferences</h3>
      <div className="space-y-3">
        {["Test completed", "Test failed", "New bug report", "Weekly summary"].map((n) => (
          <label key={n} className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer">
            <span className="text-sm">{n}</span>
            <input type="checkbox" defaultChecked className="accent-primary" />
          </label>
        ))}
      </div>
    </div>
  );
}

export function SettingsApiKeys() {
  return (
    <div className="space-y-3">
      {MOCK_API_KEYS.map((key) => (
        <div key={key.id} className="glass-card p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{key.name}</h3>
            <code className="text-xs text-muted-foreground">{key.key.slice(0, 20)}...</code>
          </div>
          <span className={`status-badge ${getStatusBg(key.status === "revoked" ? "inactive" : "active")}`}>{key.status}</span>
        </div>
      ))}
    </div>
  );
}

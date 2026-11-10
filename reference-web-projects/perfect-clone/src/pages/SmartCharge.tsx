import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockDashboardStats } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/utils/calculations";
import { Zap, CreditCard, ShieldCheck, Clock } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";
import { Button } from "@/components/ui/button";

interface SmartChargeSettings {
  enabled: boolean;
  holdAmount: "full" | "custom" | "minimum";
  customAmount: number;
  holdDays: number;
  autoRelease: boolean;
  notifyCustomer: boolean;
}

const defaults: SmartChargeSettings = {
  enabled: true,
  holdAmount: "full",
  customAmount: 1,
  holdDays: 7,
  autoRelease: true,
  notifyCustomer: true,
};

export default function SmartCharge() {
  const [settings, setSettings] = useLocalStorage<SmartChargeSettings>(STORAGE_KEYS.SMART_CHARGE_SETTINGS, defaults);
  const { conversion } = mockDashboardStats;

  const updateSetting = <K extends keyof SmartChargeSettings>(key: K, value: SmartChargeSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Smart Charge" description="Configure intelligent payment capture for trials" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Success Rate" value={formatPercent(conversion.smartChargeSuccessRate)} change={2.1} icon={<Zap className="h-5 w-5" />} />
        <StatCard title="Revenue Captured" value={formatCurrency(conversion.revenueFromConversions)} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard title="0% Failed Payments" value="0" description="After trial ends" icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard title="Hold Period" value={`${settings.holdDays} days`} icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-6">Smart Charge Configuration</h3>
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Smart Charge</p>
              <p className="text-sm text-muted-foreground">Apply pending charge at trial signup</p>
            </div>
            <button
              onClick={() => updateSetting("enabled", !settings.enabled)}
              className={`w-11 h-6 rounded-full transition-colors ${settings.enabled ? "gradient-bg" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-card shadow transition-transform ${settings.enabled ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ transform: `translateX(${settings.enabled ? 22 : 2}px)` }} />
            </button>
          </div>

          <div>
            <p className="font-medium mb-2">Hold Amount</p>
            <div className="grid grid-cols-3 gap-2">
              {(["full", "custom", "minimum"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateSetting("holdAmount", opt)}
                  className={`p-3 rounded-lg border text-sm capitalize transition-colors ${settings.holdAmount === opt ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  {opt === "full" ? "Full Price" : opt === "minimum" ? "$1 Minimum" : "Custom"}
                </button>
              ))}
            </div>
          </div>

          {settings.holdAmount === "custom" && (
            <div>
              <label className="text-sm font-medium">Custom Amount ($)</label>
              <input
                type="number"
                value={settings.customAmount}
                onChange={(e) => updateSetting("customAmount", Number(e.target.value))}
                className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Hold Period (days)</label>
            <input
              type="range"
              min={1}
              max={7}
              value={settings.holdDays}
              onChange={(e) => updateSetting("holdDays", Number(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 day</span>
              <span>{settings.holdDays} days</span>
              <span>7 days</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-release on cancellation</p>
              <p className="text-sm text-muted-foreground">Release held amount if user cancels during trial</p>
            </div>
            <button
              onClick={() => updateSetting("autoRelease", !settings.autoRelease)}
              className={`w-11 h-6 rounded-full transition-colors ${settings.autoRelease ? "gradient-bg" : "bg-muted"}`}
            >
              <div className="w-5 h-5 rounded-full bg-card shadow" style={{ transform: `translateX(${settings.autoRelease ? 22 : 2}px)` }} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notify Customer</p>
              <p className="text-sm text-muted-foreground">Send email notification about pending charge</p>
            </div>
            <button
              onClick={() => updateSetting("notifyCustomer", !settings.notifyCustomer)}
              className={`w-11 h-6 rounded-full transition-colors ${settings.notifyCustomer ? "gradient-bg" : "bg-muted"}`}
            >
              <div className="w-5 h-5 rounded-full bg-card shadow" style={{ transform: `translateX(${settings.notifyCustomer ? 22 : 2}px)` }} />
            </button>
          </div>

          <Button className="gradient-bg">Save Configuration</Button>
        </div>
      </div>
    </div>
  );
}

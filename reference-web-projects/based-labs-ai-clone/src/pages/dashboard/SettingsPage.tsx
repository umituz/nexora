import { MOCK_USER } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { forwardRef, useState } from "react";

const SettingsPage = forwardRef<HTMLDivElement>(function SettingsPage(_props, ref) {
  const [settings, setSettings] = useState({
    defaultModel: "flux",
    defaultQuality: "hd",
    autoSave: true,
    showNSFW: false,
    emailNotifications: true,
    language: "en",
    defaultVisibility: "public",
  });

  const update = (key: string, value: unknown) => setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div ref={ref} className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display font-semibold mb-4">Generation Defaults</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Default Model</label>
              <select value={settings.defaultModel} onChange={(e) => update("defaultModel", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="flux">FLUX</option>
                <option value="nano-banana">Nano Banana</option>
                <option value="imagen-4">Imagen 4</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Default Quality</label>
              <div className="mt-1 flex gap-2">
                {["standard", "hd"].map((q) => (
                  <button key={q} onClick={() => update("defaultQuality", q)} className={`rounded-lg px-4 py-2 text-sm capitalize ${settings.defaultQuality === q ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{q}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Default Visibility</label>
              <div className="mt-1 flex gap-2">
                {["public", "private"].map((v) => (
                  <button key={v} onClick={() => update("defaultVisibility", v)} className={`rounded-lg px-4 py-2 text-sm capitalize ${settings.defaultVisibility === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            {[
              { key: "autoSave", label: "Auto-save generations" },
              { key: "emailNotifications", label: "Email notifications" },
              { key: "showNSFW", label: "Show NSFW content" },
            ].map(({ key, label }) => {
              const isOn = Boolean(settings[key as keyof typeof settings]);
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <button
                    onClick={() => update(key, !isOn)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${isOn ? "bg-primary" : "bg-muted"}`}
                    role="switch"
                    aria-checked={isOn}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${isOn ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-destructive/50 bg-card p-6">
          <h2 className="font-display font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
});

export default SettingsPage;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="mt-1 text-sm text-muted-foreground">Manage your account settings.</p></div>
      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Organization</h3>
          <div className="mt-4 space-y-4">
            <div><Label>Organization Name</Label><Input defaultValue={APP_NAME} className="mt-1" /></div>
            <div><Label>Organization ID</Label><Input defaultValue="org_conductor_prod" disabled className="mt-1 font-mono" /></div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Profile</h3>
          <div className="mt-4 space-y-4">
            <div><Label>Name</Label><Input defaultValue="Alex Chen" className="mt-1" /></div>
            <div><Label>Email</Label><Input defaultValue="alex@conductor.is" className="mt-1" /></div>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-card p-6">
          <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
          <p className="mt-2 text-sm text-muted-foreground">Delete your organization and all associated data.</p>
          <Button variant="destructive" className="mt-4">Delete Organization</Button>
        </div>
      </div>
    </div>
  );
}

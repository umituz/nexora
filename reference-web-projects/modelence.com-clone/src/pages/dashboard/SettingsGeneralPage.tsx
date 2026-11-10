import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function SettingsGeneralPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="General Settings" description="Project-wide settings" />
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-2"><Label>Project Name</Label><Input defaultValue={APP_NAME} /></div>
        <div className="space-y-2"><Label>Project Slug</Label><Input defaultValue="modelence" disabled /></div>
        <div className="space-y-2"><Label>Default Region</Label><Input defaultValue="us-east-1" /></div>
        <Button>Save Changes</Button>
      </div>
      <div className="mt-8 bg-card border border-destructive/30 rounded-lg p-6">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">Permanently delete this project and all its data.</p>
        <Button variant="destructive">Delete Project</Button>
      </div>
    </div>
  );
}

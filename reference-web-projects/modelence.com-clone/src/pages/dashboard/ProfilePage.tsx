import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockUserProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? mockUserProfile.name);
  const [email] = useState(user?.email ?? mockUserProfile.email);

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Profile" description="Manage your account" />
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Input value={mockUserProfile.timezone} disabled />
        </div>
        <div className="flex items-center justify-between">
          <div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Receive email notifications</p></div>
          <Switch checked={mockUserProfile.notifications} />
        </div>
        <div className="flex items-center justify-between">
          <div><Label>Two-Factor Authentication</Label><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
          <Switch checked={mockUserProfile.twoFactor} />
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

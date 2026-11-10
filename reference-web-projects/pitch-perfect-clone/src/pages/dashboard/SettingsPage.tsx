import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_TEAM_MEMBERS, MOCK_API_KEYS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1><p className="text-sm text-muted-foreground">Manage your account and preferences</p></div>
      <Tabs defaultValue="profile">
        <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="team">Team</TabsTrigger><TabsTrigger value="billing">Billing</TabsTrigger><TabsTrigger value="api">API Keys</TabsTrigger><TabsTrigger value="10dlc">10DLC</TabsTrigger></TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card><CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
              <div><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
            </div>
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <Card><CardHeader><CardTitle>Team Members</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              {MOCK_TEAM_MEMBERS.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div><p className="font-medium text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary capitalize">{m.role}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${m.status==="active"?"bg-success/10 text-success":"bg-warning/10 text-warning"}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <Card><CardHeader><CardTitle>Billing</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Current Plan</span><span className="font-semibold text-foreground">Pro — $99/month</span></div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Next Billing Date</span><span className="font-medium text-foreground">Jan 15, 2025</span></div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Payment Method</span><span className="font-medium text-foreground">•••• 4242</span></div>
              <Button variant="outline">Manage Billing</Button>
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <Card><CardHeader><CardTitle>API Keys</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              {MOCK_API_KEYS.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div><p className="font-medium text-foreground">{k.name}</p><p className="text-xs text-muted-foreground font-mono">{k.key}</p></div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Copied!")}>Copy</Button>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="10dlc" className="mt-4">
          <Card><CardHeader><CardTitle>10DLC Registration</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="p-4 bg-success/10 rounded-lg"><p className="text-sm font-medium text-success">✓ Your 10DLC registration is approved</p><p className="text-xs text-muted-foreground mt-1">Brand and campaign verified. Daily limit: 10,000 messages.</p></div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Brand Status</span><span className="text-sm font-medium text-success">Approved</span></div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Campaign Status</span><span className="text-sm font-medium text-success">Active</span></div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg"><span className="text-sm text-muted-foreground">Trust Score</span><span className="text-sm font-medium text-foreground">High</span></div>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

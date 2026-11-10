import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";
import { mockCustomers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, ShieldBan, Trash2 } from "lucide-react";
import { generateId } from "@/utils/calculations";
import { useState } from "react";

interface BlockedUser {
  id: string;
  email: string;
  reason: string;
  blockedAt: string;
}

const defaultBlocked: BlockedUser[] = [
  { id: "bu_1", email: "fraud@test.com", reason: "Known serial disputer", blockedAt: new Date().toISOString() },
  { id: "bu_2", email: "scammer@example.com", reason: "Multiple chargebacks", blockedAt: new Date().toISOString() },
  { id: "bu_3", email: "abuse@fake.com", reason: "Fraudulent activity", blockedAt: new Date().toISOString() },
];

export default function BlockedUsers() {
  const [blocked, setBlocked] = useLocalStorage<BlockedUser[]>(STORAGE_KEYS.BLOCKED_USERS, defaultBlocked);
  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState("");

  const addBlocked = () => {
    if (!newEmail.trim()) return;
    setBlocked((prev) => [...prev, { id: generateId(), email: newEmail.trim(), reason: newReason.trim() || "Manual block", blockedAt: new Date().toISOString() }]);
    setNewEmail("");
    setNewReason("");
  };

  const removeBlocked = (id: string) => {
    setBlocked((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Blocked Users" description="Block known disputers and fraudulent users at signup" />

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Add Blocked User</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="email" placeholder="Email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          <input type="text" placeholder="Reason" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm" />
          <Button onClick={addBlocked} size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />Block</Button>
        </div>
      </div>

      <div className="space-y-2">
        {blocked.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <ShieldBan className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{b.email}</p>
              <p className="text-sm text-muted-foreground">{b.reason}</p>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">{new Date(b.blockedAt).toLocaleDateString()}</p>
            <Button variant="ghost" size="icon" onClick={() => removeBlocked(b.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {blocked.length === 0 && <p className="text-center text-muted-foreground py-8">No blocked users</p>}
      </div>
    </div>
  );
}

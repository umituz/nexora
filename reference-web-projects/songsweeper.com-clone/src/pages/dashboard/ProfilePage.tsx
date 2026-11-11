import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { formatDate, formatRelativeDate } from "@/lib/calculations";
import { User, Mail, Calendar, Clock } from "lucide-react";

export default function ProfilePage() {
  const user = mockData.user;
  return (
    <div>
      <PageHeader title="Profile" />
      <div className="max-w-2xl">
        <div className="glass-card p-6 flex items-center gap-4 mb-6">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-muted" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Member Since" value={formatDate(user.memberSince)} icon={<Calendar size={18} />} gradient="bg-primary" />
          <StatCard label="Last Scan" value={formatRelativeDate(user.lastScan)} icon={<Clock size={18} />} gradient="feature-gradient-least-played" />
          <StatCard label="Library Status" value={user.libraryConnected ? "Connected" : "Not Connected"} />
          <StatCard label="Email" value={user.email} icon={<Mail size={18} />} gradient="feature-gradient-split-albums" />
        </div>
      </div>
    </div>
  );
}

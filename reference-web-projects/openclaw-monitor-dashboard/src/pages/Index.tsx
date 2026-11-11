import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import OverviewPanel from "@/components/OverviewPanel";
import SystemHealthPanel from "@/components/SystemHealthPanel";
import SessionsPanel from "@/components/SessionsPanel";
import LiveFeedPanel from "@/components/LiveFeedPanel";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import CronPanel from "@/components/CronPanel";
import GitPanel from "@/components/GitPanel";
import MemoryPanel from "@/components/MemoryPanel";
import SettingsPanel from "@/components/SettingsPanel";

const panels: Record<string, React.ReactNode> = {
  overview: (
    <div className="space-y-6">
      <OverviewPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthPanel />
        <div className="space-y-6">
          <ActivityHeatmap />
        </div>
      </div>
    </div>
  ),
  sessions: <SessionsPanel />,
  health: <SystemHealthPanel />,
  feed: <LiveFeedPanel />,
  memory: <MemoryPanel />,
  cron: <CronPanel />,
  git: <GitPanel />,
  settings: <SettingsPanel />,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-60 p-6 lg:p-8 transition-all duration-300">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              OpenClaw Dashboard Monitor
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              Ajan aktivitelerini ve sistem kaynaklarını izleyin
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-success">Bağlı</span>
          </div>
        </header>
        {panels[activeTab]}
      </main>
    </div>
  );
};

export default Index;

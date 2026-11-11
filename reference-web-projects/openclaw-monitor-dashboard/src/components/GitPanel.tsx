import { mockGitCommits } from "@/data/mockData";
import { GitBranch, GitCommit } from "lucide-react";

const GitPanel = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2">
      <GitBranch className="w-5 h-5 text-primary" />
      <h2 className="text-lg font-semibold">Git Aktivitesi</h2>
    </div>

    <div className="space-y-2">
      {mockGitCommits.map((c) => (
        <div key={c.hash} className="glass-card p-4 flex items-start gap-3">
          <GitCommit className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm">{c.message}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-mono text-primary/70">{c.hash}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{c.repo}</span>
              <span className="text-[10px] text-muted-foreground">{c.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GitPanel;

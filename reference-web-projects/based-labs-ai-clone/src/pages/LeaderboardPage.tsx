import { MOCK_LEADERBOARD } from "@/data/mock-data";
import { formatNumber } from "@/utils/formatters";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Leaderboard</h1>
      <p className="mt-2 text-center text-muted-foreground">Top creators this month</p>
      <div className="mt-10 space-y-3">
        {MOCK_LEADERBOARD.map((entry) => (
          <div key={entry.userId} className={`flex items-center gap-4 rounded-xl border bg-card p-4 ${entry.rank <= 3 ? "border-primary/50" : "border-border"}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${entry.rank === 1 ? "bg-warning/20 text-warning" : entry.rank === 2 ? "bg-muted text-muted-foreground" : entry.rank === 3 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
              {entry.rank <= 3 ? <Trophy className="h-5 w-5" /> : `#${entry.rank}`}
            </div>
            <img src={entry.avatar} alt={entry.username} className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{entry.username}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(entry.totalGenerations)} generations · {formatNumber(entry.totalLikes)} likes</p>
            </div>
            <span className="font-display text-lg font-bold text-primary">{formatNumber(entry.score)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

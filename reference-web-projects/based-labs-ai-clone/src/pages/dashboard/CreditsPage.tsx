import { MOCK_USER, MOCK_TRANSACTIONS } from "@/data/mock-data";
import { formatCredits, formatDate, formatRelativeTime } from "@/utils/formatters";
import { CreditCard, TrendingDown, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CreditsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Credits</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{formatCredits(MOCK_USER.credits)}</p>
          <Link to="/pricing"><Button className="mt-4 bg-gradient-primary text-primary-foreground w-full">Buy Credits</Button></Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">430</p>
          <p className="text-xs text-muted-foreground mt-1">credits this month</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary capitalize">{MOCK_USER.plan}</p>
          <p className="text-xs text-muted-foreground mt-1">5% bonus on purchases</p>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold mt-10 mb-4">Transaction History</h2>
      <div className="space-y-2">
        {MOCK_TRANSACTIONS.slice(0, 15).map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === "purchase" ? "bg-success/10 text-success" : tx.type === "bonus" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {tx.type === "purchase" && <TrendingUp className="h-4 w-4" />}
              {tx.type === "usage" && <TrendingDown className="h-4 w-4" />}
              {tx.type === "bonus" && <Gift className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.createdAt)}</p>
            </div>
            <span className={`text-sm font-mono font-medium ${tx.type === "usage" ? "text-destructive" : "text-success"}`}>
              {tx.type === "usage" ? "-" : "+"}{tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

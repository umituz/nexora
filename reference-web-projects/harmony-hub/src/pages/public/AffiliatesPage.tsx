import { DollarSign, Users, TrendingUp, Gift, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: DollarSign, title: "30% Recurring Commission", desc: "Earn 30% on every referral's monthly subscription. As long as they pay, you earn." },
  { icon: Users, title: "No Limits", desc: "Refer as many clients as you want. No caps on earnings." },
  { icon: TrendingUp, title: "90-Day Cookie", desc: "90-day attribution window. Even if they sign up weeks later, you still get credit." },
  { icon: Gift, title: "Free to Join", desc: "No fees, no minimums. Just share your link and start earning." },
  { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track clicks, signups, and commissions in real-time." },
  { icon: Zap, title: "Monthly Payouts", desc: "Get paid monthly via bank transfer or PayPal." },
];

export default function AffiliatesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Affiliate Program</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold md:text-5xl">
          Earn 30% Recurring Commission
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Recommend DM Champ. Earn every month. Simple as that.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-6">
              <b.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/register" className="inline-flex rounded-lg bg-gradient-primary px-8 py-3 font-semibold text-primary-foreground shadow-glow hover:opacity-90">
            Join Affiliate Program
          </Link>
        </div>
      </div>
    </div>
  );
}

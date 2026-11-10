import { APP_NAME } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const positions = [
  { title: "Senior Backend Engineer", dept: "Engineering", location: "Remote (EU)", type: "Full-time" },
  { title: "Frontend Engineer", dept: "Engineering", location: "Amsterdam, NL", type: "Full-time" },
  { title: "DevRel Engineer", dept: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Technical Writer", dept: "Product", location: "Remote", type: "Part-time" },
  { title: "Customer Success Engineer", dept: "Support", location: "Amsterdam, NL", type: "Full-time" },
  { title: "Product Designer", dept: "Design", location: "Remote (EU)", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join {APP_NAME}</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Help us build the best application monitoring tool for developers worldwide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Remote-first", desc: "Work from anywhere in the world" },
            { label: "Competitive salary", desc: "Plus equity and benefits" },
            { label: "Learning budget", desc: "Annual budget for conferences and courses" },
          ].map((perk) => (
            <div key={perk.label} className="rounded-xl border border-border bg-card p-5 text-center">
              <h3 className="font-semibold mb-1">{perk.label}</h3>
              <p className="text-sm text-muted-foreground">{perk.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        <div className="space-y-3">
          {positions.map((pos) => (
            <div key={pos.title} className="rounded-lg border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{pos.title}</h3>
                <p className="text-sm text-muted-foreground">{pos.dept} · {pos.location} · {pos.type}</p>
              </div>
              <Button size="sm" variant="outline">Apply</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";

const openings = [
  { id: 1, title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { id: 2, title: "Platform Engineer", team: "Infrastructure", location: "San Francisco, CA", type: "Full-time" },
  { id: 3, title: "Developer Advocate", team: "Developer Relations", location: "Remote", type: "Full-time" },
  { id: 4, title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
  { id: 5, title: "Technical Writer", team: "Developer Relations", location: "Remote", type: "Contract" },
  { id: 6, title: "Site Reliability Engineer", team: "Infrastructure", location: "San Francisco, CA", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Careers at {APP_NAME}</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Join us in building the future of application development. We&apos;re a small, 
          fast-moving team backed by Y Combinator.
        </p>

        <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
        <div className="space-y-3">
          {openings.map((job) => (
            <div key={job.id} className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/30 transition-colors">
              <div>
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.team}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

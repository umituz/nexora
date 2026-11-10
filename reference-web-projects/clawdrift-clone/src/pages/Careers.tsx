import { APP_NAME } from "@/constants/app";

export default function CareersPage() {
  const positions = [
    { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Backend Engineer (Go/Python)", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "AI/ML Engineer", team: "AI", location: "Remote", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time" },
    { title: "Developer Advocate", team: "Marketing", location: "Remote", type: "Full-time" },
  ];

  return (
    <div className="container max-w-3xl py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Join {APP_NAME}</h1>
        <p className="mt-2 text-muted-foreground">Help us build the future of AI assistants</p>
      </div>
      <div className="space-y-4">
        {positions.map((pos) => (
          <div key={pos.title} className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
            <div>
              <h3 className="font-medium">{pos.title}</h3>
              <p className="text-sm text-muted-foreground">{pos.team} · {pos.location} · {pos.type}</p>
            </div>
            <span className="text-sm text-primary">Apply →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

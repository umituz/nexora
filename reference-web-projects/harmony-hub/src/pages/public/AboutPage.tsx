import { APP_NAME, COMPANY_NAME, COMPANY_COUNTRY } from "@/constants/app";

const team = [
  { name: "Sohaib Ahmad", role: "Co-Founder", bio: "Marketing agency veteran who built the original AI that took FueGenix from $5M to $10M." },
  { name: "Koert Klaren", role: "Co-Founder", bio: "Serial entrepreneur with deep venture experience and business development expertise." },
  { name: "Wouter Kock", role: "Co-Founder", bio: "Business strategist focused on scaling SaaS products across European markets." },
  { name: "Marlou Breve", role: "Head of Support", bio: "Customer success specialist ensuring every user gets maximum value from the platform." },
  { name: "Zidan Rapiyani", role: "Lead Developer", bio: "Full-stack engineer building the AI infrastructure that powers thousands of conversations." },
  { name: "Naufal Sulaiman", role: "Head of Design", bio: "UX designer crafting intuitive interfaces that make AI accessible to everyone." },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center font-heading text-3xl font-bold md:text-5xl">About {APP_NAME}</h1>
        <div className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground">
          <p>Our founder ran a marketing agency. One client, FueGenix, kept losing leads in their DMs. He built an internal AI to handle their sales conversations. It took them from $5M to $10M in one year.</p>
          <p className="mt-4">Now that same AI is white-labeled and ready for you to resell.</p>
        </div>

        <h2 className="mt-20 text-center font-heading text-2xl font-bold">We're Business Builders, Just Like You</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-4 font-heading font-semibold">{member.name}</h3>
              <p className="text-sm text-primary">{member.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>{COMPANY_NAME} · {COMPANY_COUNTRY}</p>
        </div>
      </div>
    </div>
  );
}

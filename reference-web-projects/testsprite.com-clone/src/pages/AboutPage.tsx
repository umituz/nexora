import { APP_NAME } from "@/constants/app";

const teamMembers = [
  { name: "Yunhao Jiao", role: "CEO & Co-founder" },
  { name: "Zhiyuan Li", role: "CTO & Co-founder" },
  { name: "David Chen", role: "VP of Engineering" },
  { name: "Sarah Kim", role: "Head of Product" },
  { name: "James Wang", role: "Lead ML Engineer" },
  { name: "Emily Zhang", role: "Head of Design" },
  { name: "Michael Liu", role: "Senior Engineer" },
  { name: "Anna Torres", role: "Developer Relations" },
];

const openPositions = [
  { title: "Software Engineer - Full Stack", location: "Seattle, WA", dept: "Engineering" },
  { title: "Marketing Assistant (Full-time/Intern)", location: "Seattle, WA", dept: "Marketing" },
  { title: "Customer Support Specialist", location: "Seattle, WA", dept: "Marketing" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="section-padding grid-bg">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            We&apos;re Making Software Testing Easier.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn more about who we are and what drives us.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <h2 className="text-2xl font-heading font-bold mb-4">What We Do</h2>
          <p className="text-muted-foreground mb-8">
            {APP_NAME} delivers the capabilities of a dedicated software test engineer, automating testing for both
            back-end and front-end systems. It&apos;s ideal for smaller developer and DevOps teams, or developers
            seeking self-serve QA and code validation.
          </p>

          <h2 className="text-2xl font-heading font-bold mb-4">Why We Do What We Do</h2>
          <p className="text-muted-foreground mb-8">
            We believe that autonomous, AI-powered software testing represents a transformative point for coding,
            and will drive significant improvements in software quality, accelerate time-to-market, and boost
            developer productivity. Our mission is to enhance software quality, developer productivity, and security
            for coders.
          </p>
        </div>
      </section>

      <section className="section-padding bg-accent/30">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((m) => (
              <div key={m.name} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-heading font-bold mb-3">
                  {m.name.charAt(0)}
                </div>
                <h3 className="font-heading font-semibold text-sm">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((p) => (
              <div key={p.title} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-primary font-heading font-medium">{p.dept}</span>
                  <h3 className="font-heading font-semibold text-sm">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.location}</p>
                </div>
                <span className="text-primary text-sm font-medium cursor-pointer hover:underline">Learn More →</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { APP_NAME, APP_COMPANY, APP_LOCATION } from "@/lib/constants";

const team = [
  { name: "Alex Chen", role: "Co-Founder & CEO", bio: "Previously built data infrastructure at Stripe. Passionate about developer experience." },
  { name: "Sarah Kim", role: "Co-Founder & CTO", bio: "Former tech lead at Plaid. Expert in financial data integrations and API design." },
  { name: "James Wilson", role: "Head of Engineering", bio: "10+ years building scalable distributed systems. Former principal engineer at Twilio." },
  { name: "Emily Zhang", role: "Product Manager", bio: "Former PM at Shopify. Focused on making complex integrations simple and delightful." },
];

const values = [
  { title: "Obsessive Quality", description: "We agonize over edge cases and test exhaustively. Every API response, every error message, every documentation page." },
  { title: "Developer First", description: "We build for developers. Our APIs, SDKs, and documentation are crafted with the developer experience as the primary goal." },
  { title: "Radical Transparency", description: "We're transparent about our pricing, our limitations, and our roadmap. No hidden fees, no surprises." },
  { title: "Customer Success", description: "Our customers' success is our success. We provide dedicated support and proactively help solve integration challenges." },
];

export default function CompanyPage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-4xl">
        <h1 className="text-center text-4xl font-bold text-white">
          {APP_NAME} is <span className="text-mint">ending the plight</span> of data integration for vertical SaaS.
        </h1>
        <div className="mx-auto mt-8 max-w-2xl space-y-6 text-white/60">
          <p>
            {APP_NAME} is building a meticulously crafted, uncompromising developer experience for legacy integrations, starting with QuickBooks Desktop.
          </p>
          <p>
            The degree of rigor and thoroughness in edge cases, testing, layered error handling, and validation is a unique need for integrating data from non-Tech verticals.
          </p>
        </div>

        {/* Master Plan */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white">Master Plan</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["Phase One: Dominate the QuickBooks Desktop API niche.", "Phase Two: Expand to adjacent legacy financial systems.", "Phase Three: Become the universal integration layer for vertical SaaS."].map((phase, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <p className="text-sm leading-relaxed text-white/60">{phase}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold text-mint">{v.title}</h3>
                <p className="mt-2 text-sm text-white/60">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-20" id="team">
          <h2 className="text-2xl font-bold text-white">Our Team</h2>
          <p className="mt-2 text-white/50">Built in {APP_LOCATION}.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint/10 text-lg font-bold text-mint">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-mint">{member.role}</p>
                <p className="mt-2 text-sm text-white/50">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-white/30">
          © {new Date().getFullYear()} {APP_COMPANY}
        </div>
      </div>
    </div>
  );
}

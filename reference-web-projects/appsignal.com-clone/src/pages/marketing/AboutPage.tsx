import { APP_NAME } from "@/constants/app";
import { motion } from "framer-motion";
import { Users, Globe, Code, Heart } from "lucide-react";

const stats = [
  { label: "Developers", value: "10,000+", icon: Users },
  { label: "Countries", value: "90+", icon: Globe },
  { label: "Languages Supported", value: "6+", icon: Code },
  { label: "Uptime SLA", value: "99.999%", icon: Heart },
];

const team = [
  { name: "Alex Morgan", role: "CEO & Co-founder" },
  { name: "Jordan Lee", role: "CTO & Co-founder" },
  { name: "Sam Rivera", role: "VP of Engineering" },
  { name: "Taylor Kim", role: "Head of Product" },
  { name: "Casey Wright", role: "Head of Support" },
  { name: "Morgan Chen", role: "Lead Designer" },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About {APP_NAME}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're building the best application performance monitoring tool for developers who care about their craft.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {APP_NAME} was founded with a simple belief: developers deserve monitoring tools that are powerful yet easy to use. Too many teams struggle with complex, expensive monitoring solutions that create more noise than insight.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We built {APP_NAME} to be different. Our lightweight agent, built with Rust, integrates seamlessly with your application. Our intuitive dashboards surface the insights that matter. And our dev-to-dev support team is always ready to help.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-border bg-card p-5 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

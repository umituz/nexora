import { Check, Shield, Lock, Eye, Server, FileCheck } from "lucide-react";

const securityFeatures = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256." },
  { icon: Shield, title: "SOC 2 Type II", description: "Conductor is SOC 2 Type II compliant, ensuring the highest standards of security, availability, and confidentiality." },
  { icon: Eye, title: "Zero Data Storage", description: "Conductor never stores your QuickBooks data. Data flows directly between your application and QuickBooks Desktop." },
  { icon: Server, title: "Infrastructure Security", description: "Our infrastructure runs on AWS with multi-region redundancy, automated backups, and 99.99% uptime SLA." },
  { icon: FileCheck, title: "Regular Audits", description: "We undergo regular third-party security audits and penetration testing to identify and address vulnerabilities." },
  { icon: Check, title: "Access Controls", description: "Role-based access controls, API key rotation, IP allowlisting, and comprehensive audit logging." },
];

export default function SecurityPage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-4xl">
        <h1 className="text-center text-4xl font-bold text-white">
          Security at <span className="text-mint">Conductor</span>
        </h1>
        <p className="mt-4 text-center text-white/50">
          We take security seriously. Your data protection is our top priority.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {securityFeatures.map((f) => (
            <div key={f.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <f.icon className="mb-4 h-8 w-8 text-mint" />
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

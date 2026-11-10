import { APP_NAME } from "@/constants/app";
import { Shield, Lock, Eye, Server, FileCheck, Users } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Security</h1>
        <p className="text-lg text-muted-foreground mb-12">{APP_NAME} takes the security of your data seriously.</p>
        <div className="space-y-8">
          {[
            { icon: Shield, title: "SOC 2 Type II Compliant", desc: "We undergo regular audits to ensure our security controls meet the highest standards." },
            { icon: Lock, title: "Encryption at Rest & in Transit", desc: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit." },
            { icon: Eye, title: "GDPR Compliant", desc: "We comply with GDPR and all applicable data protection regulations." },
            { icon: Server, title: "Infrastructure Security", desc: "Our infrastructure runs on SOC 2 certified cloud providers with strict access controls." },
            { icon: FileCheck, title: "Regular Penetration Testing", desc: "We conduct regular third-party penetration tests to identify and address vulnerabilities." },
            { icon: Users, title: "SAML SSO", desc: "Enterprise customers can use SAML SSO for secure team authentication." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <item.icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h2 className="font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

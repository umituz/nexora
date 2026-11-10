const trustedBy = ["Google", "Meta", "OpenAI", "Anthropic", "Stripe", "Vercel"];

export function TrustedBySection() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
        Trusted by teams at
      </p>
      <div className="flex items-center justify-center gap-12 flex-wrap">
        {trustedBy.map((company) => (
          <span key={company} className="text-lg font-semibold text-muted-foreground/60">
            {company}
          </span>
        ))}
      </div>
    </section>
  );
}

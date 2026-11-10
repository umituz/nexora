import { TESTIMONIALS } from "@/lib/constants";

export default function LovePage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-4xl">
        <h1 className="text-center text-4xl font-bold text-white">Wall of <span className="text-mint">Love</span></h1>
        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="mb-6 break-inside-avoid rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-sm italic leading-relaxed text-white/70">"{t.quote}"</p>
              <div className="mt-4">
                <p className="text-sm font-medium text-white">{t.author}</p>
                <p className="text-xs text-white/40">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

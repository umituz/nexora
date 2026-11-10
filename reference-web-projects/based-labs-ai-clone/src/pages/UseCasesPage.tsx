import { Link } from "react-router-dom";
import { MOCK_USE_CASES } from "@/data/mock-data";

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Use Cases</h1>
      <p className="mt-2 text-center text-muted-foreground">Discover how creators and businesses use AI generation.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_USE_CASES.map((uc) => (
          <Link key={uc.id} to={`/use-cases/${uc.slug}`} className="group">
            <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
              <div className="aspect-video overflow-hidden">
                <img src={uc.imageUrl} alt={uc.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{uc.category}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{uc.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

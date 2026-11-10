import { Link } from "react-router-dom";
import { MOCK_ARTICLES } from "@/data/mock-data";

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Resources</h1>
      <p className="mt-2 text-center text-muted-foreground">Tutorials, guides, and documentation to help you get the most out of AI generation.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/articles" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">Articles</h3>
          <p className="mt-2 text-sm text-muted-foreground">Latest news and insights about AI generation.</p>
        </Link>
        <Link to="/tutorials" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">Tutorials</h3>
          <p className="mt-2 text-sm text-muted-foreground">Step-by-step guides for every skill level.</p>
        </Link>
        <Link to="/api-docs" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">API Docs</h3>
          <p className="mt-2 text-sm text-muted-foreground">Developer documentation for API integration.</p>
        </Link>
        <Link to="/use-cases" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">Use Cases</h3>
          <p className="mt-2 text-sm text-muted-foreground">See how others use AI generation.</p>
        </Link>
        <Link to="/ideas" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">Ideas</h3>
          <p className="mt-2 text-sm text-muted-foreground">Curated prompts and inspiration.</p>
        </Link>
        <Link to="/threads" className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
          <h3 className="font-display text-lg font-semibold">Community</h3>
          <p className="mt-2 text-sm text-muted-foreground">Join discussions with fellow creators.</p>
        </Link>
      </div>
    </div>
  );
}

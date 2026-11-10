import { Link } from "react-router-dom";
import { MOCK_ARTICLES } from "@/data/mock-data";
import { formatDate } from "@/utils/formatters";

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">Articles</h1>
      <p className="mt-2 text-center text-muted-foreground">Latest news, tutorials, and insights about AI generation.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_ARTICLES.map((article) => (
          <Link key={article.id} to={`/articles/${article.slug}`} className="group">
            <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
              <div className="aspect-video overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>·</span>
                  <span>{article.readTime} min read</span>
                </div>
                <h3 className="mt-2 font-display font-semibold text-foreground line-clamp-2">{article.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

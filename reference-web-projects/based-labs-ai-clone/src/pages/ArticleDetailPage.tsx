import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_ARTICLES } from "@/data/mock-data";
import { formatDate } from "@/utils/formatters";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Article not found.</p></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Articles
      </Link>
      <img src={article.imageUrl} alt={article.title} className="w-full rounded-xl aspect-video object-cover" />
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <img src={article.authorAvatar} alt={article.author} className="h-10 w-10 rounded-full" />
          <div>
            <p className="text-sm font-medium">{article.author}</p>
            <p className="text-xs text-muted-foreground">{formatDate(article.publishedAt)} · {article.readTime} min read</p>
          </div>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">{article.title}</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>{article.excerpt}</p>
          <p>The landscape of AI-generated content is evolving rapidly. New models are being released every month, each pushing the boundaries of what's possible with artificial intelligence.</p>
          <p>In this article, we explore the latest developments and what they mean for creators, businesses, and the broader creative industry.</p>
          <h2 className="font-display text-xl font-semibold text-foreground pt-4">The Current State</h2>
          <p>AI generation has come a long way from simple text-to-image models. Today, we have sophisticated systems capable of generating photorealistic images, cinematic videos, and even music from text descriptions.</p>
          <h2 className="font-display text-xl font-semibold text-foreground pt-4">What's Next</h2>
          <p>The future holds even more exciting possibilities. With multimodal models and improved consistency, creators will have unprecedented tools at their disposal.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

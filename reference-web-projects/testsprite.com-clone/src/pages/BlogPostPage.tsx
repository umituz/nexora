import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_BLOG_POSTS } from "@/data/mock";
import { formatDate } from "@/utils/calculations";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="section-padding text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <article className="container-narrow">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
        <span className="text-xs text-primary font-heading font-medium">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
          {post.content.split(". ").map((sentence, i) => (
            <p key={i} className="mb-4">{sentence.trim()}{sentence.endsWith(".") ? "" : "."}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { mockBlogPosts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
        <Link to="/blog" className="text-primary text-sm mt-4 inline-block">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded-md text-muted-foreground capitalize">{tag}</span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readTime} min read</span>
        </div>
        <div className="mt-10 prose prose-sm max-w-none text-foreground">
          <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            This is a detailed article about {post.title.toLowerCase()}. In production, this would contain the full blog post content with rich formatting, code examples, and images.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The content covers best practices, implementation details, and real-world examples to help developers build better applications with our platform.
          </p>
        </div>
      </div>
    </div>
  );
}

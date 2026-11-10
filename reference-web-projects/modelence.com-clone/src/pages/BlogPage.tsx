import { Link } from "react-router-dom";
import { mockBlogPosts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground text-center mb-4">Blog</h1>
        <p className="text-center text-muted-foreground mb-12">Latest updates, tutorials, and insights</p>

        <div className="space-y-8">
          {mockBlogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded-md text-muted-foreground capitalize">{tag}</span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>{post.readTime} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

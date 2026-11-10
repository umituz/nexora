import { Link } from "react-router-dom";
import { MOCK_BLOG_POSTS } from "@/data/mock";
import { formatDate } from "@/utils/calculations";

export default function BlogPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">Latest news, tutorials, and updates from the team.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="glass-card overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="h-48 gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
                {post.category}
              </div>
              <div className="p-5">
                <span className="text-xs text-primary font-heading font-medium">{post.category}</span>
                <h3 className="font-heading font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

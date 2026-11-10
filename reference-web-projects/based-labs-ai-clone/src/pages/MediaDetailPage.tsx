import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Heart, Share2 } from "lucide-react";
import { MOCK_MEDIA } from "@/data/mock-data";
import { formatRelativeTime, formatNumber } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MediaDetailPage() {
  const { mediaId } = useParams<{ mediaId: string }>();
  const item = MOCK_MEDIA.find((m) => m.id === mediaId);
  const [liked, setLiked] = useState(false);

  if (!item) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Media not found.</p></div>;
  }

  const relatedMedia = MOCK_MEDIA.filter((m) => m.id !== item.id && m.modelId === item.modelId).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <img src={item.url} alt={item.prompt} className="w-full object-contain max-h-[600px]" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={item.userAvatar} alt={item.username} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-medium text-foreground">{item.username}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Prompt</h3>
            <p className="text-sm text-foreground">{item.prompt}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">{item.model}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-foreground">{item.width}x{item.height}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground capitalize">{item.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Credits</span><span className="text-foreground">{item.creditCost}</span></div>
              {item.duration && <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">{item.duration}s</span></div>}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">👍 {item.reactions.likes}</span>
            <span className="text-sm">❤️ {item.reactions.hearts}</span>
            <span className="text-sm">😂 {item.reactions.laughs}</span>
            <span className="text-sm">😢 {item.reactions.sad}</span>
            <span className="ml-auto text-xs text-muted-foreground">{formatNumber(item.views)} views</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setLiked(!liked)}>
              <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} /> {liked ? "Liked" : "Like"}
            </Button>
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>

          <Link to={`/dashboard/generate?prompt=${encodeURIComponent(item.prompt)}&model=${item.modelId}`} className="block mt-3">
            <Button className="w-full bg-gradient-primary text-primary-foreground">Remix this creation</Button>
          </Link>
        </div>
      </div>

      {relatedMedia.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold mb-6">More from this model</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {relatedMedia.map((m) => (
              <Link key={m.id} to={`/media/${m.id}`} className="overflow-hidden rounded-lg border border-border hover:border-primary/50">
                <img src={m.thumbnailUrl} alt={m.prompt} className="aspect-square w-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

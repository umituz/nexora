import { useParams, Link } from "react-router-dom";
import { MOCK_MODELS, MOCK_MEDIA } from "@/data/mock-data";
import { formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/MediaCard";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const model = MOCK_MODELS.find((m) => m.id === modelId);

  if (!model) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Model not found.</p>
      </div>
    );
  }

  const modelMedia = MOCK_MEDIA.filter((m) => m.modelId === model.id).slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/models" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Models
      </Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-border">
            <img src={model.imageUrl} alt={model.name} className="w-full aspect-[3/2] object-cover" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">{model.name}</h1>
            {model.isNew && <Badge className="bg-primary text-primary-foreground">New</Badge>}
            {model.isPro && <Badge className="bg-gradient-primary text-primary-foreground">Pro</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">by {model.provider}</p>
          <p className="mt-4 text-muted-foreground">{model.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-bold text-foreground">{formatNumber(model.generations)}</p>
              <p className="text-sm text-muted-foreground">Generations</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-bold text-foreground">{model.creditCost}</p>
              <p className="text-sm text-muted-foreground">Credits {model.creditUnit}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-bold text-foreground">{model.category}</p>
              <p className="text-sm text-muted-foreground">Type</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {model.capabilities.map((cap) => (
                <Badge key={cap} variant="secondary" className="bg-muted text-muted-foreground">{cap}</Badge>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Link to={`/dashboard/generate?model=${model.id}`}>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Sparkles className="mr-2 h-4 w-4" /> Generate with {model.name}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {modelMedia.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold mb-6">Created with {model.name}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {modelMedia.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { forwardRef } from "react";
import type { AIModel } from "@/types";
import { formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface ModelCardProps {
  model: AIModel;
}

export const ModelCard = forwardRef<HTMLAnchorElement, ModelCardProps>(
  function ModelCard({ model }, ref) {
    return (
      <Link ref={ref} to={`/models/${model.id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-card">
          <div className="relative aspect-[3/2] overflow-hidden">
            <img
              src={model.imageUrl}
              alt={model.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {model.isNew && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">New</Badge>}
              {model.isPro && <Badge className="bg-gradient-primary text-primary-foreground text-[10px] px-1.5 py-0.5">Pro</Badge>}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-display font-semibold text-sm text-foreground">{model.name}</h3>
            <p className="text-xs text-muted-foreground">{formatNumber(model.generations)} generations</p>
          </div>
        </div>
      </Link>
    );
  }
);

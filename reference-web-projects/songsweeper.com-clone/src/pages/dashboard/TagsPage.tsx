import { Link } from "react-router-dom";
import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";

export default function TagsPage() {
  return (
    <div>
      <PageHeader title="Tags" description="Organize your songs with custom tags" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockData.tags.map((tag) => (
          <Link
            key={tag.name}
            to={`/dashboard/tags/${encodeURIComponent(tag.name)}`}
            className="glass-card p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform"
          >
            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
            <div>
              <p className="text-sm font-medium text-foreground capitalize">{tag.name}</p>
              <p className="text-xs text-muted-foreground">{tag.songCount} songs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

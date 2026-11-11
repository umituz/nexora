import { useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { calculateSplitAlbumStats } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Disc3, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SplitAlbumsPage() {
  const { splitAlbums, unifySplitAlbum, unifyAllSplitAlbums } = useLibrary();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const unresolved = splitAlbums.filter((g) => !g.unified);
  const stats = calculateSplitAlbumStats(unresolved);

  const handleUnify = (id: string) => {
    unifySplitAlbum(id);
    toast({ title: "Album Unified", description: "The album fragments have been merged." });
  };

  const handleUnifyAll = () => {
    const count = unresolved.length;
    unifyAllSplitAlbums();
    toast({ title: "All Unified", description: `${count} albums unified.` });
  };

  return (
    <div>
      <PageHeader title="Split Albums" description="Unify songs scattered across separate album releases.">
        {unresolved.length > 0 && (
          <Button size="sm" onClick={handleUnifyAll}>Unify All ({unresolved.length})</Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Split Albums" value={stats.totalGroups} icon={<Disc3 size={18} />} gradient="feature-gradient-split-albums" />
        <StatCard label="Total Fragments" value={stats.totalFragments} />
      </div>

      <div className="space-y-2">
        {splitAlbums.map((group) => (
          <div key={group.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === group.id ? null : group.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{group.albumName}</p>
                <p className="text-xs text-muted-foreground">{group.artist} · {group.fragments.length} editions</p>
              </div>
              <div className="flex items-center gap-2">
                {group.unified && <span className="text-xs text-feature-split-albums font-medium flex items-center gap-1"><Check size={12} /> Unified</span>}
                {expandedId === group.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </button>

            {expandedId === group.id && (
              <div className="px-4 pb-4 border-t border-border pt-3 space-y-4">
                {group.fragments.map((frag) => (
                  <div key={frag.id}>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{frag.edition}</p>
                    {frag.songs.map((song) => (
                      <div key={song.id} className="flex items-center gap-3 py-1 text-sm">
                        <span className="text-xs text-muted-foreground w-6">{song.trackNumber}</span>
                        <p className="flex-1 truncate text-foreground">{song.title}</p>
                      </div>
                    ))}
                  </div>
                ))}
                {!group.unified && (
                  <Button size="sm" onClick={() => handleUnify(group.id)}>Unify Album</Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

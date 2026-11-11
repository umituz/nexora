import { useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { calculateDuplicateStats, formatFileSize } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DuplicatesPage() {
  const { duplicates, mergeDuplicate, mergeAllDuplicates } = useLibrary();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const unresolved = duplicates.filter((g) => !g.resolved);
  const stats = calculateDuplicateStats(unresolved);

  const handleMerge = (groupId: string) => {
    mergeDuplicate(groupId);
    toast({ title: "Duplicates Merged", description: "The duplicate has been resolved." });
  };

  const handleMergeAll = () => {
    const count = unresolved.length;
    mergeAllDuplicates();
    toast({ title: "All Merged", description: `${count} duplicate groups resolved.` });
  };

  return (
    <div>
      <PageHeader title="Duplicates" description="Find and merge duplicate songs across your library.">
        {unresolved.length > 0 && (
          <Button size="sm" onClick={handleMergeAll}>Merge All ({unresolved.length})</Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard label="Duplicate Groups" value={stats.totalGroups} icon={<Copy size={18} />} gradient="feature-gradient-duplicates" />
        <StatCard label="Extra Copies" value={stats.totalDuplicates} />
        <StatCard label="Space to Save" value={formatFileSize(stats.spaceSaved)} />
      </div>

      <div className="space-y-2">
        {duplicates.map((group) => (
          <div key={group.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === group.id ? null : group.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={group.songs[0].albumArt} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" loading="lazy" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{group.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{group.artist} · {group.songs.length} copies</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {group.resolved && <span className="text-xs text-feature-split-albums font-medium flex items-center gap-1"><Check size={12} /> Resolved</span>}
                {expandedId === group.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </button>

            {expandedId === group.id && (
              <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                {group.songs.map((song) => (
                  <div key={song.id} className="flex items-center gap-3 text-sm">
                    <img src={song.albumArt} alt="" className="w-8 h-8 rounded object-cover" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-foreground">{song.album}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(song.fileSize)} · {song.playCount} plays</p>
                    </div>
                  </div>
                ))}
                {!group.resolved && (
                  <Button size="sm" className="mt-2" onClick={() => handleMerge(group.id)}>
                    Keep Best & Merge
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

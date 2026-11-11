import { useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { formatRelativeDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { ScanLine, CheckCircle, Loader2, XCircle, Copy, Disc3, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScanResult } from "@/data/types";
import { mockData } from "@/data/mockData";
import { getItem, setItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";

const SCAN_TYPES: { type: ScanResult["type"]; label: string; icon: React.ElementType }[] = [
  { type: "duplicates", label: "Duplicates", icon: Copy },
  { type: "split-albums", label: "Split Albums", icon: Disc3 },
  { type: "least-played", label: "Least Played", icon: TrendingDown },
];

const STATUS_ICONS = {
  completed: <CheckCircle size={16} className="text-feature-split-albums" />,
  "in-progress": <Loader2 size={16} className="text-feature-most-played animate-spin" />,
  failed: <XCircle size={16} className="text-destructive" />,
};

export default function ScanPage() {
  const { duplicates, splitAlbums, songs, pushNotification } = useLibrary();
  const [scanning, setScanning] = useState<ScanResult["type"] | null>(null);
  const [results, setResults] = useState<ScanResult[]>(() =>
    getItem<ScanResult[]>(STORAGE_KEYS.SCAN_HISTORY, mockData.scanResults)
  );
  const { toast } = useToast();

  const handleScan = (type: ScanResult["type"]) => {
    setScanning(type);
    setTimeout(() => {
      let itemsFound = 0;
      if (type === "duplicates") itemsFound = duplicates.filter((d) => !d.resolved).length;
      else if (type === "split-albums") itemsFound = splitAlbums.filter((s) => !s.unified).length;
      else if (type === "least-played") itemsFound = songs.filter((s) => s.playCount <= 5).length;
      else itemsFound = songs.filter((s) => s.playCount >= 50).length;

      const newResult: ScanResult = {
        id: `scan-${Date.now()}`,
        type,
        timestamp: new Date().toISOString(),
        itemsFound,
        status: "completed",
      };
      const next = [newResult, ...results];
      setResults(next);
      setItem(STORAGE_KEYS.SCAN_HISTORY, next);
      setScanning(null);
      pushNotification({
        title: "Scan Complete",
        message: `${type.replace("-", " ")} scan found ${itemsFound} items.`,
        type: "success",
      });
      toast({ title: "Scan Complete", description: `Found ${itemsFound} items.` });
    }, 1800);
  };

  return (
    <div>
      <PageHeader title="Library Scan" description="Scan your library for issues" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Scans" value={results.length} icon={<ScanLine size={18} />} gradient="bg-primary" />
        <StatCard label="Issues Found" value={results.reduce((a, r) => a + r.itemsFound, 0)} />
        <StatCard label="Completed" value={results.filter((r) => r.status === "completed").length} />
        <StatCard label="Last Scan" value={results.length > 0 ? formatRelativeDate(results[0].timestamp) : "Never"} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {SCAN_TYPES.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            disabled={scanning !== null}
            onClick={() => handleScan(type)}
          >
            {scanning === type ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
            <span className="text-xs font-medium">{scanning === type ? "Scanning..." : `Scan ${label}`}</span>
          </Button>
        ))}
      </div>

      <div className="glass-card divide-y divide-border">
        {results.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {STATUS_ICONS[r.status]}
              <div>
                <p className="text-sm font-medium capitalize text-foreground">{r.type.replace("-", " ")} Scan</p>
                <p className="text-xs text-muted-foreground">{formatRelativeDate(r.timestamp)}</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{r.itemsFound} items</span>
          </div>
        ))}
      </div>
    </div>
  );
}

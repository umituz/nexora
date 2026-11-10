import { MOCK_USER, MOCK_MEDIA } from "@/data/mock-data";
import { formatNumber } from "@/utils/formatters";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const userMedia = MOCK_MEDIA.slice(0, 12);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-start gap-6">
        <img src={MOCK_USER.avatar} alt={MOCK_USER.displayName} className="h-24 w-24 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold">{MOCK_USER.displayName}</h1>
            <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>
          </div>
          <p className="text-sm text-muted-foreground">@{MOCK_USER.username}</p>
          <p className="mt-2 text-sm text-muted-foreground">{MOCK_USER.bio}</p>
          <div className="mt-3 flex gap-6 text-sm">
            <span><strong className="text-foreground">{formatNumber(MOCK_USER.totalGenerations)}</strong> <span className="text-muted-foreground">generations</span></span>
            <span><strong className="text-foreground">{formatNumber(MOCK_USER.followers)}</strong> <span className="text-muted-foreground">followers</span></span>
            <span><strong className="text-foreground">{formatNumber(MOCK_USER.following)}</strong> <span className="text-muted-foreground">following</span></span>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-4">Creations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {userMedia.map((item) => (<MediaCard key={item.id} item={item} />))}
        </div>
      </div>
    </div>
  );
}

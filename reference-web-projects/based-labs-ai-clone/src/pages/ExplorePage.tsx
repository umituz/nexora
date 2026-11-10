import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { MOCK_MEDIA } from "@/data/mock-data";
import { POPULAR_SEARCHES, MEDIA_CATEGORIES } from "@/constants/app";
import { MediaCard } from "@/components/MediaCard";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const activeTab = searchParams.get("type") || "all";

  const filteredMedia = MOCK_MEDIA.filter((item) => {
    if (activeTab === "image" && item.type !== "image") return false;
    if (activeTab === "video" && item.type !== "video") return false;
    if (searchQuery && !item.prompt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-center">AI Generated Content</h1>
      <p className="mt-2 text-center text-muted-foreground">
        Browse 400+ AI artworks created with FLUX, Kling, Nano, Z-Image, and more
      </p>

      {/* Tabs */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {["all", "image", "video"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSearchParams(tab === "all" ? {} : { type: tab })}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "All" : tab === "image" ? "Images" : "Videos"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mx-auto mt-6 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-input bg-muted/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredMedia.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <p>No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

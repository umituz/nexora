export const APP_NAME = "SongSweeper";
export const APP_TAGLINE = "Your music library is messier than you think.";
export const APP_DESCRIPTION =
  "Merge duplicates. Unify albums. Delete old songs — so your library reflects who you are today, not who you were 10 years ago.";
export const APP_VERSION = "1.0.0";
export const APP_AUTHOR = "SongSweeper Team";

export const STORAGE_KEYS = {
  THEME: "songsweeper-theme",
  USER: "songsweeper-user",
  LIBRARY: "songsweeper-library",
  DELETION_QUEUE: "songsweeper-deletion-queue",
  SCAN_HISTORY: "songsweeper-scan-history",
  FAVORITES: "songsweeper-favorites",
  SETTINGS: "songsweeper-settings",
  NOTIFICATIONS: "songsweeper-notifications",
  ACTION_HISTORY: "songsweeper-action-history",
  TAGS: "songsweeper-tags",
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DUPLICATES: "/dashboard/duplicates",
  DUPLICATE_DETAIL: "/dashboard/duplicates/:id",
  SPLIT_ALBUMS: "/dashboard/split-albums",
  SPLIT_ALBUM_DETAIL: "/dashboard/split-albums/:id",
  LEAST_PLAYED: "/dashboard/least-played",
  MOST_PLAYED: "/dashboard/most-played",
  DELETION_QUEUE: "/dashboard/deletion-queue",
  LIBRARY: "/dashboard/library",
  ALBUMS: "/dashboard/albums",
  ALBUM_DETAIL: "/dashboard/albums/:id",
  ARTISTS: "/dashboard/artists",
  ARTIST_DETAIL: "/dashboard/artists/:id",
  PLAYLISTS: "/dashboard/playlists",
  PLAYLIST_DETAIL: "/dashboard/playlists/:id",
  GENRES: "/dashboard/genres",
  GENRE_DETAIL: "/dashboard/genres/:genre",
  RECENTLY_ADDED: "/dashboard/recently-added",
  RECENTLY_PLAYED: "/dashboard/recently-played",
  FAVORITES: "/dashboard/favorites",
  SEARCH: "/dashboard/search",
  STATISTICS: "/dashboard/statistics",
  HISTORY: "/dashboard/history",
  SCAN: "/dashboard/scan",
  SCAN_RESULTS: "/dashboard/scan-results",
  SETTINGS: "/dashboard/settings",
  PROFILE: "/dashboard/profile",
  NOTIFICATIONS: "/dashboard/notifications",
  EXPORT: "/dashboard/export",
  IMPORT: "/dashboard/import",
  TAGS: "/dashboard/tags",
  TAG_DETAIL: "/dashboard/tags/:tag",
  SONG_DETAIL: "/dashboard/songs/:id",
  PRIVACY: "/privacy",
  SUPPORT: "/support",
  ABOUT: "/about",
} as const;

export const FEATURES = [
  {
    key: "duplicates",
    title: "Duplicates",
    description: "Find and merge duplicate songs across albums, editions, and singles.",
    icon: "Copy",
    color: "from-blue-500 to-cyan-400",
    route: ROUTES.DUPLICATES,
  },
  {
    key: "split-albums",
    title: "Split Albums",
    description: "Unify songs scattered across separate releases into one album.",
    icon: "Disc3",
    color: "from-emerald-500 to-green-400",
    route: ROUTES.SPLIT_ALBUMS,
  },
  {
    key: "least-played",
    title: "Least Played",
    description: "Surface tracks you no longer listen to and clear the clutter.",
    icon: "TrendingDown",
    color: "from-orange-500 to-amber-400",
    route: ROUTES.LEAST_PLAYED,
  },
  {
    key: "most-played",
    title: "Most Played",
    description: "Highlight your most-played songs to favorite them.",
    icon: "TrendingUp",
    color: "from-yellow-500 to-amber-300",
    route: ROUTES.MOST_PLAYED,
  },
  {
    key: "deletion-queue",
    title: "Deletion Queue",
    description: "Review and confirm songs marked for removal from your library.",
    icon: "Trash2",
    color: "from-red-500 to-rose-400",
    route: ROUTES.DELETION_QUEUE,
  },
] as const;

export const NAV_ITEMS = {
  main: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
    { label: "Library", path: ROUTES.LIBRARY, icon: "Music" },
    { label: "Search", path: ROUTES.SEARCH, icon: "Search" },
  ],
  tools: [
    { label: "Duplicates", path: ROUTES.DUPLICATES, icon: "Copy" },
    { label: "Split Albums", path: ROUTES.SPLIT_ALBUMS, icon: "Disc3" },
    { label: "Least Played", path: ROUTES.LEAST_PLAYED, icon: "TrendingDown" },
    { label: "Most Played", path: ROUTES.MOST_PLAYED, icon: "TrendingUp" },
    { label: "Deletion Queue", path: ROUTES.DELETION_QUEUE, icon: "Trash2" },
  ],
  browse: [
    { label: "Albums", path: ROUTES.ALBUMS, icon: "Disc" },
    { label: "Artists", path: ROUTES.ARTISTS, icon: "Users" },
    { label: "Genres", path: ROUTES.GENRES, icon: "Tag" },
    { label: "Playlists", path: ROUTES.PLAYLISTS, icon: "ListMusic" },
    { label: "Favorites", path: ROUTES.FAVORITES, icon: "Heart" },
  ],
  activity: [
    { label: "Recently Added", path: ROUTES.RECENTLY_ADDED, icon: "Plus" },
    { label: "Recently Played", path: ROUTES.RECENTLY_PLAYED, icon: "Clock" },
    { label: "Statistics", path: ROUTES.STATISTICS, icon: "BarChart3" },
    { label: "History", path: ROUTES.HISTORY, icon: "History" },
    { label: "Scan", path: ROUTES.SCAN, icon: "ScanLine" },
  ],
  manage: [
    { label: "Import", path: ROUTES.IMPORT, icon: "Upload" },
    { label: "Export", path: ROUTES.EXPORT, icon: "Download" },
    { label: "Tags", path: ROUTES.TAGS, icon: "Tags" },
    { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: "Bell" },
  ],
} as const;

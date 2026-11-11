export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  genre: string;
  duration: number; // seconds
  playCount: number;
  dateAdded: string;
  lastPlayed: string;
  isFavorite: boolean;
  fileSize: number; // bytes
  trackNumber: number;
  year: number;
  albumArt: string;
  tags: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  genre: string;
  songCount: number;
  albumArt: string;
  totalDuration: number;
}

export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  songCount: number;
  totalPlays: number;
  avatar: string;
  genres: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  coverArt: string;
  songIds: string[];
}

export interface DuplicateGroup {
  id: string;
  title: string;
  artist: string;
  songs: Song[];
  resolved: boolean;
}

export interface SplitAlbumGroup {
  id: string;
  albumName: string;
  artist: string;
  fragments: {
    id: string;
    edition: string;
    songs: Song[];
  }[];
  unified: boolean;
}

export interface ScanResult {
  id: string;
  type: "duplicates" | "split-albums" | "least-played" | "most-played";
  timestamp: string;
  itemsFound: number;
  status: "completed" | "in-progress" | "failed";
}

export interface ActionHistoryItem {
  id: string;
  action: "merge" | "delete" | "unify" | "favorite" | "unfavorite" | "tag" | "untag" | "import" | "export";
  description: string;
  timestamp: string;
  itemCount: number;
  undoable: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  libraryConnected: boolean;
  lastScan: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  autoScan: boolean;
  scanInterval: "daily" | "weekly" | "monthly";
  showPlayCounts: boolean;
  confirmDeletions: boolean;
  notificationsEnabled: boolean;
  duplicateSensitivity: "low" | "medium" | "high";
  language: string;
}

export interface TagItem {
  name: string;
  color: string;
  songCount: number;
}

export interface GenreStats {
  genre: string;
  songCount: number;
  totalPlays: number;
  avgPlayCount: number;
  totalDuration: number;
}

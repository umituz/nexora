import type {
  Song, Album, Artist, Playlist, DuplicateGroup, SplitAlbumGroup,
  ScanResult, ActionHistoryItem, Notification, UserProfile, UserSettings, TagItem
} from "./types";

const ALBUM_ARTS = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1446057032654-9d8885f5e3a3?w=200&h=200&fit=crop",
];

const ARTISTS_DATA = [
  "Arctic Monkeys", "Tame Impala", "Radiohead", "The Weeknd", "Daft Punk",
  "Billie Eilish", "Kendrick Lamar", "Pink Floyd", "Fleetwood Mac", "Mac DeMarco",
  "Tyler The Creator", "Frank Ocean", "Lana Del Rey", "The Strokes", "Gorillaz",
  "Bon Iver", "Childish Gambino", "SZA", "The 1975", "Beach House",
];

const ALBUMS_DATA = [
  "AM", "Currents", "OK Computer", "After Hours", "Random Access Memories",
  "Happier Than Ever", "To Pimp a Butterfly", "Dark Side of the Moon", "Rumours", "Salad Days",
  "IGOR", "Blonde", "Norman Rockwell", "Is This It", "Demon Days",
  "For Emma Forever Ago", "Awaken My Love", "Ctrl", "Notes on a Conditional Form", "Depression Cherry",
  "Tranquility Base", "Lonerism", "In Rainbows", "Starboy", "Discovery",
  "When We All Fall Asleep", "DAMN", "The Wall", "Tango in the Night", "This Old Dog",
];

const GENRES = ["Rock", "Electronic", "Hip-Hop", "Pop", "R&B", "Alternative", "Indie", "Jazz", "Classical", "Folk"];

const SONG_TITLES = [
  "Do I Wanna Know?", "Let It Happen", "Paranoid Android", "Blinding Lights", "Get Lucky",
  "Bad Guy", "Humble", "Comfortably Numb", "Dreams", "Chamber of Reflection",
  "Earfquake", "Nights", "Venice Bitch", "Last Nite", "Feel Good Inc",
  "Skinny Love", "Redbone", "Love Galore", "Somebody Else", "Space Song",
  "Star Treatment", "The Less I Know", "Reckoner", "Starboy", "One More Time",
  "Therefore I Am", "DNA", "Another Brick", "Everywhere", "Freaking Out",
  "Why'd You Only Call", "New Person", "Karma Police", "Save Your Tears", "Around the World",
  "Ocean Eyes", "Swimming Pools", "Money", "The Chain", "Watching Him Fade",
  "Fluorescent Adolescent", "Elephant", "Exit Music", "In Your Eyes", "Instant Crush",
  "Everything I Wanted", "Alright", "Hey You", "Little Lies", "Still Together",
  "505", "Eventually", "Fake Plastic Trees", "Die for You", "Digital Love",
  "Lovely", "King Kunta", "Wish You Were Here", "Go Your Own Way", "My Kind of Woman",
  "R U Mine?", "Breathe Deeper", "No Surprises", "Heartless", "Something About Us",
  "Bury a Friend", "Money Trees", "Time", "Sara", "On the Level",
  "Brianstorm", "Borderline", "Lucky", "After Hours", "Veridis Quo",
  "I Love You", "Element", "Echoes", "Gold Dust Woman", "Passing Out Pieces",
  "Mardy Bum", "Lost in Yesterday", "Airbag", "Faith", "Voyager",
  "Xanny", "Fear", "Brain Damage", "Gypsy", "No Other Heart",
];

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function deterministicPlayCount(i: number): number {
  // Guarantee a good distribution: some 0, some low, some mid, some high
  if (i < 5) return 0; // 5 never-played songs
  if (i < 15) return (i % 4) + 1; // 10 songs with 1-4 plays
  if (i < 30) return 5 + (i % 15); // 15 songs with 5-19 plays
  if (i < 55) return 20 + ((i * 7) % 30); // 25 songs with 20-49 plays
  if (i < 75) return 50 + ((i * 13) % 80); // 20 songs with 50-129 plays
  return 130 + ((i * 17) % 70); // rest with 130-199 plays
}

function generateSongs(): Song[] {
  return SONG_TITLES.map((title, i) => {
    const artistIdx = i % ARTISTS_DATA.length;
    const albumIdx = i % ALBUMS_DATA.length;
    return {
      id: `song-${i + 1}`,
      title,
      artist: ARTISTS_DATA[artistIdx],
      artistId: `artist-${artistIdx + 1}`,
      album: ALBUMS_DATA[albumIdx],
      albumId: `album-${albumIdx + 1}`,
      genre: GENRES[i % GENRES.length],
      duration: 180 + ((i * 31) % 180),
      playCount: deterministicPlayCount(i),
      dateAdded: randomDate(new Date(2018, 0, 1), new Date(2026, 2, 1)),
      lastPlayed: randomDate(new Date(2024, 0, 1), new Date(2026, 2, 8)),
      isFavorite: i % 3 === 0,
      fileSize: 3_000_000 + ((i * 137) % 12_000_000),
      trackNumber: (i % 12) + 1,
      year: 2010 + (i % 16),
      albumArt: ALBUM_ARTS[i % ALBUM_ARTS.length],
      tags: Math.random() > 0.6 ? [["chill", "workout", "focus", "party", "drive"][Math.floor(Math.random() * 5)]] : [],
    };
  });
}

function generateAlbums(): Album[] {
  return ALBUMS_DATA.map((title, i) => ({
    id: `album-${i + 1}`,
    title,
    artist: ARTISTS_DATA[i % ARTISTS_DATA.length],
    artistId: `artist-${(i % ARTISTS_DATA.length) + 1}`,
    year: 2010 + Math.floor(Math.random() * 16),
    genre: GENRES[i % GENRES.length],
    songCount: 8 + Math.floor(Math.random() * 8),
    albumArt: ALBUM_ARTS[i % ALBUM_ARTS.length],
    totalDuration: 2400 + Math.floor(Math.random() * 2400),
  }));
}

function generateArtists(): Artist[] {
  return ARTISTS_DATA.map((name, i) => ({
    id: `artist-${i + 1}`,
    name,
    albumCount: 2 + (i % 6),
    songCount: 10 + ((i * 3) % 30),
    totalPlays: 500 + ((i * 257) % 5000),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=c4a882`,
    genres: [GENRES[i % GENRES.length], GENRES[(i + 3) % GENRES.length]],
  }));
}

function generatePlaylists(songs: Song[]): Playlist[] {
  const names = [
    "Morning Vibes", "Late Night Drive", "Workout Pump", "Focus Zone", "Throwback Hits",
    "Chill Weekend", "Party Starter", "Road Trip", "Study Session", "Rainy Day",
  ];
  return names.map((name, i) => {
    const count = 10 + Math.floor(Math.random() * 25);
    const songIds = songs.slice(i * 3, i * 3 + count).map((s) => s.id);
    return {
      id: `playlist-${i + 1}`,
      name,
      description: `A curated collection for your ${name.toLowerCase()} moments.`,
      songCount: songIds.length,
      totalDuration: songIds.length * 220,
      createdAt: randomDate(new Date(2023, 0, 1), new Date(2025, 6, 1)),
      updatedAt: randomDate(new Date(2025, 6, 1), new Date(2026, 2, 1)),
      coverArt: ALBUM_ARTS[i % ALBUM_ARTS.length],
      songIds,
    };
  });
}

function generateDuplicates(songs: Song[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  for (let i = 0; i < 15; i++) {
    const baseSong = songs[i * 4];
    if (!baseSong) break;
    const dupSong: Song = {
      ...baseSong,
      id: `dup-${baseSong.id}`,
      album: baseSong.album + " (Deluxe)",
      albumId: baseSong.albumId + "-deluxe",
      fileSize: baseSong.fileSize + 500_000,
    };
    groups.push({
      id: `dup-group-${i + 1}`,
      title: baseSong.title,
      artist: baseSong.artist,
      songs: [baseSong, dupSong],
      resolved: i > 10,
    });
  }
  return groups;
}

function generateSplitAlbums(): SplitAlbumGroup[] {
  const groups: SplitAlbumGroup[] = [];
  for (let i = 0; i < 10; i++) {
    const albumName = ALBUMS_DATA[i];
    const artist = ARTISTS_DATA[i % ARTISTS_DATA.length];
    groups.push({
      id: `split-${i + 1}`,
      albumName,
      artist,
      fragments: [
        {
          id: `frag-${i}-1`,
          edition: "Standard Edition",
          songs: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, j) => ({
            id: `split-song-${i}-1-${j}`,
            title: `${albumName} Track ${j + 1}`,
            artist,
            artistId: `artist-${(i % ARTISTS_DATA.length) + 1}`,
            album: albumName,
            albumId: `album-${i + 1}`,
            genre: GENRES[i % GENRES.length],
            duration: 200 + Math.floor(Math.random() * 120),
            playCount: Math.floor(Math.random() * 80),
            dateAdded: randomDate(new Date(2020, 0, 1), new Date(2025, 0, 1)),
            lastPlayed: randomDate(new Date(2024, 0, 1), new Date(2026, 2, 1)),
            isFavorite: false,
            fileSize: 4_000_000 + Math.floor(Math.random() * 6_000_000),
            trackNumber: j + 1,
            year: 2015 + i,
            albumArt: ALBUM_ARTS[i % ALBUM_ARTS.length],
            tags: [],
          })),
        },
        {
          id: `frag-${i}-2`,
          edition: "Deluxe Edition",
          songs: Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, j) => ({
            id: `split-song-${i}-2-${j}`,
            title: `${albumName} Bonus ${j + 1}`,
            artist,
            artistId: `artist-${(i % ARTISTS_DATA.length) + 1}`,
            album: `${albumName} (Deluxe)`,
            albumId: `album-${i + 1}-deluxe`,
            genre: GENRES[i % GENRES.length],
            duration: 200 + Math.floor(Math.random() * 120),
            playCount: Math.floor(Math.random() * 30),
            dateAdded: randomDate(new Date(2020, 0, 1), new Date(2025, 0, 1)),
            lastPlayed: randomDate(new Date(2024, 0, 1), new Date(2026, 2, 1)),
            isFavorite: false,
            fileSize: 4_000_000 + Math.floor(Math.random() * 6_000_000),
            trackNumber: j + 6,
            year: 2015 + i,
            albumArt: ALBUM_ARTS[i % ALBUM_ARTS.length],
            tags: [],
          })),
        },
      ],
      unified: i > 7,
    });
  }
  return groups;
}

function generateScanResults(): ScanResult[] {
  return [
    { id: "scan-1", type: "duplicates", timestamp: "2026-03-08T10:00:00Z", itemsFound: 73, status: "completed" },
    { id: "scan-2", type: "split-albums", timestamp: "2026-03-08T10:05:00Z", itemsFound: 28, status: "completed" },
    { id: "scan-3", type: "least-played", timestamp: "2026-03-07T08:00:00Z", itemsFound: 145, status: "completed" },
    { id: "scan-4", type: "most-played", timestamp: "2026-03-07T08:05:00Z", itemsFound: 32, status: "completed" },
    { id: "scan-5", type: "duplicates", timestamp: "2026-03-01T12:00:00Z", itemsFound: 89, status: "completed" },
  ];
}

function generateActionHistory(): ActionHistoryItem[] {
  return [
    { id: "ah-1", action: "merge", description: "Merged 5 duplicate songs", timestamp: "2026-03-08T09:00:00Z", itemCount: 5, undoable: true },
    { id: "ah-2", action: "delete", description: "Removed 12 songs from library", timestamp: "2026-03-07T14:30:00Z", itemCount: 12, undoable: true },
    { id: "ah-3", action: "unify", description: "Unified 3 split albums", timestamp: "2026-03-06T11:00:00Z", itemCount: 3, undoable: true },
    { id: "ah-4", action: "favorite", description: "Favorited 8 most-played songs", timestamp: "2026-03-05T16:00:00Z", itemCount: 8, undoable: true },
    { id: "ah-5", action: "tag", description: "Tagged 15 songs as 'workout'", timestamp: "2026-03-04T10:00:00Z", itemCount: 15, undoable: true },
    { id: "ah-6", action: "import", description: "Imported playlist from file", timestamp: "2026-03-03T09:00:00Z", itemCount: 1, undoable: false },
    { id: "ah-7", action: "export", description: "Exported library as CSV", timestamp: "2026-03-02T13:00:00Z", itemCount: 1, undoable: false },
    { id: "ah-8", action: "merge", description: "Merged 3 duplicate songs", timestamp: "2026-03-01T10:00:00Z", itemCount: 3, undoable: true },
    { id: "ah-9", action: "delete", description: "Removed 7 least-played songs", timestamp: "2026-02-28T15:00:00Z", itemCount: 7, undoable: true },
    { id: "ah-10", action: "unfavorite", description: "Unfavorited 2 songs", timestamp: "2026-02-27T12:00:00Z", itemCount: 2, undoable: true },
  ];
}

function generateNotifications(): Notification[] {
  return [
    { id: "n-1", title: "Scan Complete", message: "Found 73 duplicate songs in your library.", type: "success", timestamp: "2026-03-08T10:05:00Z", read: false },
    { id: "n-2", title: "New Duplicates", message: "15 new duplicate songs detected since last scan.", type: "info", timestamp: "2026-03-07T09:00:00Z", read: false },
    { id: "n-3", title: "Merge Successful", message: "5 duplicate groups have been merged.", type: "success", timestamp: "2026-03-06T14:00:00Z", read: true },
    { id: "n-4", title: "Split Albums Found", message: "28 albums can be unified.", type: "warning", timestamp: "2026-03-05T11:00:00Z", read: true },
    { id: "n-5", title: "Weekly Report", message: "You cleaned up 23 songs this week.", type: "info", timestamp: "2026-03-04T08:00:00Z", read: true },
  ];
}

const MOCK_SONGS = generateSongs();

export const mockData = {
  songs: MOCK_SONGS,
  albums: generateAlbums(),
  artists: generateArtists(),
  playlists: generatePlaylists(MOCK_SONGS),
  duplicates: generateDuplicates(MOCK_SONGS),
  splitAlbums: generateSplitAlbums(),
  scanResults: generateScanResults(),
  actionHistory: generateActionHistory(),
  notifications: generateNotifications(),
  user: {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    memberSince: "2024-01-15",
    libraryConnected: true,
    lastScan: "2026-03-08T10:00:00Z",
  } as UserProfile,
  settings: {
    theme: "light",
    autoScan: true,
    scanInterval: "weekly",
    showPlayCounts: true,
    confirmDeletions: true,
    notificationsEnabled: true,
    duplicateSensitivity: "medium",
    language: "en",
  } as UserSettings,
  tags: [
    { name: "chill", color: "#60a5fa", songCount: 24 },
    { name: "workout", color: "#f97316", songCount: 18 },
    { name: "focus", color: "#a78bfa", songCount: 15 },
    { name: "party", color: "#f43f5e", songCount: 12 },
    { name: "drive", color: "#22c55e", songCount: 20 },
    { name: "sleep", color: "#6366f1", songCount: 8 },
    { name: "cooking", color: "#eab308", songCount: 6 },
    { name: "nostalgia", color: "#ec4899", songCount: 14 },
  ] as TagItem[],
};

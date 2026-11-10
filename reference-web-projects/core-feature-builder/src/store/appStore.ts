import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentFormat, Platform } from "@/lib/data";

export type PostStatus = "draft" | "scheduled" | "published";

export interface Post {
  id: string;
  title: string;
  format: ContentFormat;
  topic: string;
  script: string;
  avatarId: number | null;
  caption: string;
  captionStyleId: number;
  musicId: number;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt: string | null; // ISO date
  publishedAt: string | null;
  views: number;
  likes: number;
  createdAt: string;
  thumbnail: string;
  remixOfId?: number;
}

export interface BrandKit {
  website: string;
  brandName: string;
  oneLiner: string;
  description: string;
  audience: string;
  ageRange: string;
  painPoints: string[];
  tones: string[];
  colors: { name: string; value: string }[];
}

interface AppState {
  posts: Post[];
  likedIdeas: number[];
  skippedIdeas: number[];
  favoriteAvatars: number[];
  favoriteTrending: number[];
  brand: BrandKit;
  // actions
  addPost: (post: Omit<Post, "id" | "createdAt" | "views" | "likes">) => string;
  updatePost: (id: string, patch: Partial<Post>) => void;
  deletePost: (id: string) => void;
  schedulePost: (id: string, isoDate: string, platforms: Platform[]) => void;
  publishPost: (id: string) => void;
  toggleLikedIdea: (id: number) => void;
  addSkippedIdea: (id: number) => void;
  resetBlitz: () => void;
  toggleFavoriteAvatar: (id: number) => void;
  toggleFavoriteTrending: (id: number) => void;
  updateBrand: (patch: Partial<BrandKit>) => void;
}

const THUMBS = ["🚀", "💡", "🔥", "✨", "💎", "🎯", "⚡", "🌟", "🎬", "📱"];

const defaultBrand: BrandKit = {
  website: "usefastlane.ai",
  brandName: "Fastlane",
  oneLiner: "AI-powered marketing on autopilot for SaaS founders.",
  description:
    "Fastlane creates trending short-form video content for your business automatically. Stop wasting hours on TikToks and Reels — generate, schedule, and publish in seconds.",
  audience: "Indie SaaS founders & solopreneurs",
  ageRange: "22-40",
  painPoints: ["No time for content", "Bad at video editing", "Not creative enough", "Posting inconsistently"],
  tones: ["Bold", "Friendly"],
  colors: [
    { name: "Primary", value: "#F25C2D" },
    { name: "Accent", value: "#FFE5DC" },
    { name: "Dark", value: "#1A1A1A" },
    { name: "Light", value: "#FAFAFA" },
  ],
};

const seedPosts: Post[] = [
  {
    id: "seed-1",
    title: "How I built my SaaS in 7 days",
    format: "hook-demo",
    topic: "Building a SaaS quickly",
    script: "Most people overthink building. Here's how I shipped in a week.",
    avatarId: 2,
    caption: "How I built my SaaS in 7 days",
    captionStyleId: 1,
    musicId: 1,
    platforms: ["TikTok"],
    status: "published",
    scheduledAt: null,
    publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    views: 23400,
    likes: 1820,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    thumbnail: "🚀",
  },
  {
    id: "seed-2",
    title: "Stop doing this mistake",
    format: "wall-of-text",
    topic: "Common founder mistakes",
    script: "The #1 thing killing your growth right now.",
    avatarId: null,
    caption: "Stop doing this mistake",
    captionStyleId: 2,
    musicId: 2,
    platforms: ["Reels"],
    status: "published",
    scheduledAt: null,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 15100,
    likes: 980,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    thumbnail: "🔥",
  },
  {
    id: "seed-3",
    title: "AI tools you need in 2026",
    format: "slideshow",
    topic: "Best AI tools for founders",
    script: "Slide 1: Cursor\nSlide 2: Lovable\nSlide 3: Fastlane",
    avatarId: 3,
    caption: "AI tools you need in 2026",
    captionStyleId: 3,
    musicId: 3,
    platforms: ["Shorts"],
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    publishedAt: null,
    views: 0,
    likes: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: "🤖",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      posts: seedPosts,
      likedIdeas: [],
      skippedIdeas: [],
      favoriteAvatars: [1, 5],
      favoriteTrending: [],
      brand: defaultBrand,

      addPost: (post) => {
        const id = `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newPost: Post = {
          ...post,
          id,
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          thumbnail: post.thumbnail || THUMBS[Math.floor(Math.random() * THUMBS.length)],
        };
        set((s) => ({ posts: [newPost, ...s.posts] }));
        return id;
      },

      updatePost: (id, patch) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deletePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),

      schedulePost: (id, isoDate, platforms) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id
              ? { ...p, status: "scheduled" as PostStatus, scheduledAt: isoDate, platforms }
              : p
          ),
        })),

      publishPost: (id) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: "published" as PostStatus,
                  publishedAt: new Date().toISOString(),
                  views: Math.floor(Math.random() * 5000) + 500,
                  likes: Math.floor(Math.random() * 300) + 30,
                }
              : p
          ),
        })),

      toggleLikedIdea: (id) =>
        set((s) => ({
          likedIdeas: s.likedIdeas.includes(id)
            ? s.likedIdeas.filter((x) => x !== id)
            : [...s.likedIdeas, id],
        })),

      addSkippedIdea: (id) =>
        set((s) => ({
          skippedIdeas: s.skippedIdeas.includes(id) ? s.skippedIdeas : [...s.skippedIdeas, id],
        })),

      resetBlitz: () => set({ likedIdeas: [], skippedIdeas: [] }),

      toggleFavoriteAvatar: (id) =>
        set((s) => ({
          favoriteAvatars: s.favoriteAvatars.includes(id)
            ? s.favoriteAvatars.filter((x) => x !== id)
            : [...s.favoriteAvatars, id],
        })),

      toggleFavoriteTrending: (id) =>
        set((s) => ({
          favoriteTrending: s.favoriteTrending.includes(id)
            ? s.favoriteTrending.filter((x) => x !== id)
            : [...s.favoriteTrending, id],
        })),

      updateBrand: (patch) => set((s) => ({ brand: { ...s.brand, ...patch } })),
    }),
    { name: "fastlane-app-store" }
  )
);

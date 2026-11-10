export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  credits: number;
  plan: "free" | "starter" | "creator" | "pro" | "studio";
  createdAt: string;
  totalGenerations: number;
  followers: number;
  following: number;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  modelId: string;
  width: number;
  height: number;
  duration?: number;
  createdAt: string;
  userId: string;
  username: string;
  userAvatar: string;
  reactions: Reactions;
  views: number;
  isPublic: boolean;
  tags: string[];
  creditCost: number;
}

export interface Reactions {
  likes: number;
  hearts: number;
  laughs: number;
  sad: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  category: "image" | "video" | "audio" | "tool";
  provider: string;
  imageUrl: string;
  creditCost: number;
  creditUnit: string;
  generations: number;
  isNew: boolean;
  isPro: boolean;
  capabilities: string[];
  maxResolution?: string;
  speeds: string[];
}

export interface Idea {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  prompt: string;
  authorName: string;
  authorAvatar: string;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  slug: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: number;
  views: number;
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  itemCount: number;
  items: string[];
  createdAt: string;
  isPublic: boolean;
}

export interface GenerationSettings {
  prompt: string;
  negativePrompt: string;
  model: string;
  width: number;
  height: number;
  steps: number;
  guidanceScale: number;
  seed: number | null;
  numberOfImages: number;
  style?: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
  isActive: boolean;
}

export interface HistoryEntry {
  id: string;
  action: string;
  prompt: string;
  model: string;
  creditCost: number;
  status: "completed" | "failed" | "processing";
  createdAt: string;
  resultId?: string;
  resultUrl?: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UserSettings {
  defaultModel: string;
  defaultQuality: "standard" | "hd";
  autoSave: boolean;
  showNSFW: boolean;
  emailNotifications: boolean;
  language: string;
  defaultVisibility: "public" | "private";
}

export interface CreditTransaction {
  id: string;
  type: "purchase" | "usage" | "bonus" | "refund";
  amount: number;
  description: string;
  createdAt: string;
  balanceAfter: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  imageUrl: string;
  model: string;
  settings: Partial<GenerationSettings>;
  usageCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  totalGenerations: number;
  totalLikes: number;
  score: number;
}

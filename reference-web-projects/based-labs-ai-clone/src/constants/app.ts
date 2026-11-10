export const APP_NAME = "BasedLabs";
export const APP_TAGLINE = "Your Creative Super Weapon";
export const APP_DESCRIPTION = "Generate images, videos, and audio with the best AI models. One platform. Endless possibilities.";
export const APP_URL = "https://basedlabs.ai";

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/BasedLabsAI",
  discord: "https://discord.gg/basedlabs",
  github: "https://github.com/basedlabs",
  youtube: "https://youtube.com/@basedlabs",
} as const;

export const CREDIT_COSTS = {
  image: {
    flux_pro_ultra: 6,
    nano_banana_pro: 9,
    imagen_4: 4,
    ideogram_v2: 8,
    recraft_v3: 4,
    grok_imagine: 5,
    z_image_turbo: 2,
  },
  video: {
    veo_31: 24,
    luma_ray_2: 6,
    kling_26_pro: 9,
    seedance_15: 5,
    wan_26: 6,
  },
  tools: {
    gpt_image_edit: 4,
    flux_2_edit: 1,
    hd_upscale: 3,
    creative_upscale: 1,
    bg_removal: 1,
    face_swap: 2,
  },
  audio: {
    music_generation: 1,
    voice_transform: 3,
    hd_voice_transform: 4,
  },
} as const;

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Great for trying things out",
    price: 10,
    credits: 300,
    images: "~80",
    videos: "~10 short",
    badge: null,
    bonus: null,
  },
  {
    id: "creator",
    name: "Creator",
    description: "Most popular for creators",
    price: 29,
    credits: 900,
    images: "~240",
    videos: "~30",
    badge: "Most Popular",
    bonus: null,
  },
  {
    id: "pro",
    name: "Pro",
    description: "5% bonus credits",
    price: 50,
    credits: 1600,
    images: "~600",
    videos: "~75",
    badge: null,
    bonus: "+5% Bonus",
  },
  {
    id: "studio",
    name: "Studio",
    description: "10% bonus credits",
    price: 99,
    credits: 3300,
    images: "~1,400",
    videos: "~175",
    badge: null,
    bonus: "+10% Bonus",
  },
] as const;

export const POPULAR_SEARCHES = [
  "cyberpunk",
  "fantasy",
  "anime",
  "realistic portrait",
  "sci-fi",
  "nature",
  "abstract",
  "star wars",
] as const;

export const MEDIA_CATEGORIES = ["All", "Images", "Videos"] as const;

export const NAV_ITEMS = [
  { label: "Product", href: "/product" },
  { label: "Explore", href: "/explore" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { label: "Generate", href: "/dashboard/generate", icon: "Sparkles" },
  { label: "My Creations", href: "/dashboard/creations", icon: "Image" },
  { label: "Collections", href: "/dashboard/collections", icon: "FolderOpen" },
  { label: "Favorites", href: "/dashboard/favorites", icon: "Heart" },
  { label: "History", href: "/dashboard/history", icon: "Clock" },
  { label: "Models", href: "/dashboard/models", icon: "Box" },
  { label: "Templates", href: "/dashboard/templates", icon: "LayoutTemplate" },
  { label: "Community", href: "/dashboard/community", icon: "Users" },
  { label: "Threads", href: "/dashboard/threads", icon: "MessageSquare" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: "Key" },
  { label: "Credits", href: "/dashboard/credits", icon: "Coins" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const STORAGE_KEYS = {
  USER: "basedlabs_user",
  CREATIONS: "basedlabs_creations",
  FAVORITES: "basedlabs_favorites",
  COLLECTIONS: "basedlabs_collections",
  HISTORY: "basedlabs_history",
  SETTINGS: "basedlabs_settings",
  CREDITS: "basedlabs_credits",
  API_KEYS: "basedlabs_api_keys",
  THEME: "basedlabs_theme",
} as const;

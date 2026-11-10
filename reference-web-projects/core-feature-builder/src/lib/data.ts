// Static seed data shared across the app (no backend yet).

export type Platform = "TikTok" | "Reels" | "Shorts";
export type ContentFormat = "wall-of-text" | "hook-demo" | "slideshow" | "green-screen";

export const PLATFORMS: Platform[] = ["TikTok", "Reels", "Shorts"];

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  "wall-of-text": "Wall of Text",
  "hook-demo": "Hook & Demo",
  slideshow: "Slideshow",
  "green-screen": "Green Screen",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  TikTok: "bg-foreground text-background",
  Reels: "bg-primary text-primary-foreground",
  Shorts: "bg-destructive text-destructive-foreground",
};

export interface Avatar {
  id: number;
  name: string;
  style: string;
  ethnicity: string;
  gender: string;
  age: string;
  emoji: string;
  languages: number;
  popular: boolean;
}

export const AVATARS: Avatar[] = [
  { id: 1, name: "Sarah", style: "Professional", ethnicity: "Caucasian", gender: "Female", age: "25-34", emoji: "👩‍💼", languages: 12, popular: true },
  { id: 2, name: "Marcus", style: "Casual", ethnicity: "Black", gender: "Male", age: "25-34", emoji: "👨‍💻", languages: 8, popular: true },
  { id: 3, name: "Emily", style: "Energetic", ethnicity: "Caucasian", gender: "Female", age: "18-24", emoji: "🧑‍🎤", languages: 10, popular: true },
  { id: 4, name: "Jake", style: "Friendly", ethnicity: "Caucasian", gender: "Male", age: "18-24", emoji: "🧑‍🦱", languages: 6, popular: false },
  { id: 5, name: "Priya", style: "Authoritative", ethnicity: "Asian", gender: "Female", age: "35-44", emoji: "👩‍🔬", languages: 14, popular: true },
  { id: 6, name: "Alex", style: "Trendy", ethnicity: "Hispanic", gender: "Non-binary", age: "18-24", emoji: "🧑‍🎨", languages: 9, popular: false },
  { id: 7, name: "Aisha", style: "Professional", ethnicity: "Middle Eastern", gender: "Female", age: "25-34", emoji: "👩‍🏫", languages: 11, popular: false },
  { id: 8, name: "Daniel", style: "Authoritative", ethnicity: "Caucasian", gender: "Male", age: "35-44", emoji: "🧑‍⚖️", languages: 7, popular: false },
  { id: 9, name: "Yuki", style: "Energetic", ethnicity: "Asian", gender: "Female", age: "18-24", emoji: "👧", languages: 13, popular: true },
  { id: 10, name: "Diego", style: "Friendly", ethnicity: "Hispanic", gender: "Male", age: "25-34", emoji: "🧔", languages: 8, popular: false },
  { id: 11, name: "Zara", style: "Trendy", ethnicity: "Black", gender: "Female", age: "18-24", emoji: "👩‍🎤", languages: 10, popular: true },
  { id: 12, name: "Tom", style: "Casual", ethnicity: "Caucasian", gender: "Male", age: "25-34", emoji: "🧑", languages: 5, popular: false },
];

export interface TrendingVideo {
  id: number;
  title: string;
  hook: string;
  views: string;
  growth: string;
  category: string;
  duration: string;
  trending: boolean;
  thumbnail: string;
  format: ContentFormat;
  creator: string;
}

export const TRENDING_VIDEOS: TrendingVideo[] = [
  { id: 1, title: "POV: You just found the perfect marketing tool", hook: "When the algorithm finally hits", views: "2.1M", growth: "+340%", category: "SaaS", duration: "0:32", trending: true, thumbnail: "🚀", format: "hook-demo", creator: "@growthhacks" },
  { id: 2, title: "3 things I wish I knew before starting", hook: "I lost $10K learning these", views: "1.8M", growth: "+280%", category: "Tech", duration: "0:45", trending: true, thumbnail: "💡", format: "slideshow", creator: "@techfounder" },
  { id: 3, title: "This hack changed my business forever", hook: "Nobody talks about this", views: "1.2M", growth: "+190%", category: "E-commerce", duration: "0:28", trending: true, thumbnail: "🔥", format: "wall-of-text", creator: "@ecomking" },
  { id: 4, title: "Day in the life of a startup founder", hook: "5 AM grind reality check", views: "980K", growth: "+150%", category: "SaaS", duration: "1:02", trending: false, thumbnail: "☕", format: "green-screen", creator: "@dailyhustle" },
  { id: 5, title: "Stop wasting money on ads", hook: "Burned $5K to learn this", views: "850K", growth: "+120%", category: "Finance", duration: "0:38", trending: false, thumbnail: "💰", format: "wall-of-text", creator: "@adwizard" },
  { id: 6, title: "The morning routine that 10x'd my productivity", hook: "Stop snoozing immediately", views: "720K", growth: "+95%", category: "Fitness", duration: "0:55", trending: false, thumbnail: "🌅", format: "slideshow", creator: "@morningguru" },
  { id: 7, title: "Why your content isn't getting views", hook: "It's not the algorithm", views: "650K", growth: "+88%", category: "Tech", duration: "0:41", trending: true, thumbnail: "📱", format: "hook-demo", creator: "@viralcoach" },
  { id: 8, title: "I tested every AI tool so you don't have to", hook: "Only 3 are actually worth it", views: "540K", growth: "+75%", category: "Tech", duration: "1:15", trending: false, thumbnail: "🤖", format: "slideshow", creator: "@aitester" },
  { id: 9, title: "The $0 marketing strategy that works", hook: "I built $10K MRR with this", views: "480K", growth: "+68%", category: "SaaS", duration: "0:33", trending: false, thumbnail: "🎯", format: "wall-of-text", creator: "@bootstrapper" },
];

export interface BlitzIdea {
  id: number;
  title: string;
  format: ContentFormat;
  preview: string;
  hook: string;
  avatar: string;
  tags: string[];
}

export const BLITZ_IDEAS: BlitzIdea[] = [
  { id: 101, title: "Stop scrolling. Start building.", format: "wall-of-text", preview: "Your competitors are posting 3x a day while you're still perfecting your landing page...", hook: "The uncomfortable truth about marketing your SaaS", avatar: "Sarah", tags: ["SaaS", "Marketing", "Growth"] },
  { id: 102, title: "I built a $10K MRR app in 30 days", format: "hook-demo", preview: "Here's the exact marketing strategy I used to get my first 1000 users...", hook: "Everyone said it was impossible", avatar: "Marcus", tags: ["Startup", "Revenue", "Demo"] },
  { id: 103, title: "3 tools every founder needs", format: "slideshow", preview: "Slide 1: The problem with manual marketing\nSlide 2: AI-powered content creation\nSlide 3: Automated scheduling", hook: "I wish someone told me this sooner", avatar: "Emily", tags: ["Tools", "Productivity", "AI"] },
  { id: 104, title: "Why your TikTok strategy is failing", format: "green-screen", preview: "Most founders make this critical mistake: they post and pray. Here's what to do instead...", hook: "POV: You just realized why nobody watches your content", avatar: "Jake", tags: ["TikTok", "Strategy", "Content"] },
  { id: 105, title: "From 0 to 50K views in a week", format: "hook-demo", preview: "The exact template I use for every viral video. Step by step breakdown...", hook: "This simple format gets 10x more views", avatar: "Priya", tags: ["Viral", "Template", "Views"] },
  { id: 106, title: "The marketing mistake costing you customers", format: "wall-of-text", preview: "You're focused on the wrong metric. Here's what actually moves the needle...", hook: "I wasted 6 months on this", avatar: "Aisha", tags: ["Marketing", "Mistake", "CRO"] },
  { id: 107, title: "AI tools that pay for themselves", format: "slideshow", preview: "Slide 1: Content generation\nSlide 2: Customer support\nSlide 3: Analytics insights", hook: "Stop paying for tools you don't use", avatar: "Yuki", tags: ["AI", "SaaS", "Tools"] },
];

export const MUSIC_TRACKS = [
  { id: 1, name: "Upbeat Pop", duration: "0:32", mood: "Energetic", trending: true },
  { id: 2, name: "Chill Lofi", duration: "0:45", mood: "Calm", trending: false },
  { id: 3, name: "Epic Cinematic", duration: "1:02", mood: "Dramatic", trending: true },
  { id: 4, name: "Funky Groove", duration: "0:38", mood: "Fun", trending: false },
  { id: 5, name: "Trap Beat", duration: "0:28", mood: "Hype", trending: true },
];

export const CAPTION_STYLES = [
  { id: 1, name: "Bold Yellow", className: "text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", preview: "WOW!" },
  { id: 2, name: "Clean White", className: "text-white drop-shadow-md", preview: "Hello" },
  { id: 3, name: "Karaoke Pop", className: "text-pink-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", preview: "Vibe" },
  { id: 4, name: "TikTok Classic", className: "text-white bg-black/60 px-2 py-1 rounded inline-block", preview: "Trend" },
];

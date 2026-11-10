import { APP_NAME } from "@/constants/app";
import { Link } from "react-router-dom";

export default function ProductPage() {
  const features = [
    { title: "Image Generation", desc: "Create stunning images from text with FLUX, Nano Banana, Imagen 4, and more." },
    { title: "Video Generation", desc: "Generate cinematic videos with Veo, Kling, Seedance, and Luma Ray." },
    { title: "Image Editing", desc: "Edit images with AI using GPT Image Edit, background removal, and upscaling." },
    { title: "Audio Generation", desc: "Create music and transform voices with AI-powered audio tools." },
    { title: "Community", desc: "Share your creations, get inspired, and connect with other creators." },
    { title: "API Access", desc: "Integrate AI generation into your apps with our developer-friendly API." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-center">The Complete AI Creative Platform</h1>
      <p className="mt-4 text-center text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to generate images, videos, and audio with the best AI models.</p>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all">
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { APP_NAME } from "@/constants/app";

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold mb-8">About {APP_NAME}</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          {APP_NAME} makes deploying personal AI assistants effortless. We believe everyone deserves a 24/7 AI assistant that works on their favorite messaging platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
        <p className="text-muted-foreground">
          To democratize AI by making it accessible to everyone, regardless of technical expertise. No servers, no code, no configuration — just pick a model, choose a channel, and deploy.
        </p>
        <h2 className="text-2xl font-semibold mt-8">The Team</h2>
        <p className="text-muted-foreground">
          We're a small team of engineers, designers, and AI enthusiasts passionate about building tools that empower people. Based globally, working remotely.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Open Source</h2>
        <p className="text-muted-foreground">
          OpenClaw, the AI assistant at the heart of {APP_NAME}, is open source. We believe in transparency and community-driven development.
        </p>
      </div>
    </div>
  );
}

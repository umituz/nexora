import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/constants/app";
import { MOCK_MEDIA, MOCK_MODELS, MOCK_IDEAS, MOCK_USE_CASES, MOCK_ARTICLES, MOCK_THREADS } from "@/data/mock-data";
import { formatRelativeTime } from "@/utils/formatters";
import { MediaCard } from "@/components/MediaCard";
import { ModelCard } from "@/components/ModelCard";
import { forwardRef, useState } from "react";

const HomePage = forwardRef<HTMLDivElement>(function HomePage(_props, ref) {
  const [heroPrompt, setHeroPrompt] = useState("");
  const featuredVideos = MOCK_MEDIA.filter((m) => m.type === "video").slice(0, 8);
  const featuredImages = MOCK_MEDIA.filter((m) => m.type === "image").slice(0, 10);
  const topModels = MOCK_MODELS.filter((m) => m.category === "image" || m.category === "video").slice(0, 6);

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(250_85%_65%/0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          >
            YOUR CREATIVE{" "}
            <span className="text-gradient">SUPER WEAPON</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            {APP_DESCRIPTION}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <div className="flex items-center rounded-xl border border-border bg-card p-1.5">
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Link to={`/dashboard/generate${heroPrompt ? `?prompt=${encodeURIComponent(heroPrompt)}` : ""}`}>
                <Button className="bg-gradient-primary text-primary-foreground px-6">
                  Generate
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Free to start · No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Featured Videos</h2>
          <Link to="/explore?type=video" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all videos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featuredVideos.map((item) => (
            <MediaCard key={item.id} item={item} className="min-w-[250px] max-w-[250px]" />
          ))}
        </div>
      </section>

      {/* Featured Images */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Featured Images</h2>
          <Link to="/explore?type=image" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all images <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {featuredImages.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Top Models */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Top AI Models</h2>
          <Link to="/models" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all models <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {topModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Ideas */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Featured Ideas</h2>
          <Link to="/ideas" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all ideas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {MOCK_IDEAS.slice(0, 10).map((idea) => (
            <Link key={idea.id} to={`/ideas/${idea.id}`} className="group">
              <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-card">
                <div className="aspect-square overflow-hidden">
                  <img src={idea.imageUrl} alt={idea.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={idea.authorAvatar} alt={idea.authorName} className="h-5 w-5 rounded-full" />
                    <span className="text-xs text-muted-foreground">{idea.authorName}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Use Cases</h2>
          <Link to="/use-cases" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all use cases <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_USE_CASES.slice(0, 6).map((uc) => (
            <Link key={uc.id} to={`/use-cases/${uc.slug}`} className="group">
              <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
                <div className="aspect-video overflow-hidden">
                  <img src={uc.imageUrl} alt={uc.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{uc.category}</span>
                  <h3 className="mt-1 font-display font-semibold text-foreground">{uc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{uc.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Latest Articles</h2>
          <Link to="/articles" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Read all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_ARTICLES.slice(0, 4).map((article) => (
            <Link key={article.id} to={`/articles/${article.slug}`} className="group">
              <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
                <div className="aspect-video overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Threads */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Featured Threads</h2>
          <Link to="/threads" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Explore all threads <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {MOCK_THREADS.slice(0, 4).map((thread) => (
            <Link key={thread.id} to={`/threads/${thread.id}`} className="block">
              <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <img src={thread.authorAvatar} alt={thread.authorName} className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{thread.authorName}</span>
                      <span className="text-xs text-muted-foreground">☀️ {formatRelativeTime(thread.createdAt)}</span>
                    </div>
                    <h3 className="mt-1 font-display font-semibold text-foreground">{thread.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{thread.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>❤️ {thread.likes}</span>
                      <span>💬 {thread.replies}</span>
                      <span>👁 {thread.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
});

export default HomePage;

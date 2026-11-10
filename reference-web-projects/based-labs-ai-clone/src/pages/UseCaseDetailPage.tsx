import { useParams, Link } from "react-router-dom";
import { MOCK_USE_CASES } from "@/data/mock-data";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UseCaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const useCase = MOCK_USE_CASES.find((uc) => uc.slug === slug);

  if (!useCase) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Use case not found.</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/use-cases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Use Cases
      </Link>
      <div className="overflow-hidden rounded-xl border border-border">
        <img src={useCase.imageUrl} alt={useCase.title} className="w-full aspect-video object-cover" />
      </div>
      <div className="mt-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">{useCase.category}</span>
        <h1 className="mt-2 font-display text-3xl font-bold">{useCase.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{useCase.description}</p>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>AI-powered content creation is revolutionizing how creators and businesses produce visual content. With advanced models, you can generate professional-quality outputs in seconds.</p>
          <p>Whether you're a solo creator or a large team, our platform provides the tools you need to bring your vision to life. From ideation to final output, the entire workflow is streamlined.</p>
          <h2 className="font-display text-xl font-semibold text-foreground pt-4">Key Benefits</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Save hours of manual work with AI-powered generation</li>
            <li>Maintain consistency across all your content</li>
            <li>Scale your content production effortlessly</li>
            <li>Access multiple AI models for different use cases</li>
          </ul>
        </div>
        <div className="mt-8">
          <Link to="/dashboard/generate">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Sparkles className="mr-2 h-4 w-4" /> Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

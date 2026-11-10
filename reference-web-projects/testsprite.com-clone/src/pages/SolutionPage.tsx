import { APP_NAME } from "@/constants/app";
import { useParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const solutionsData: Record<string, { title: string; subtitle: string; features: string[]; description: string }> = {
  mcp: {
    title: "MCP Server",
    subtitle: "Seamless IDE Integration",
    description: `Connect ${APP_NAME} directly to your development environment through the Model Context Protocol. Get real-time test feedback as you code.`,
    features: ["Real-time test feedback in IDE", "Supports Cursor, VS Code, Claude Code, Trae", "Zero-config setup", "Automatic test generation on save", "Inline test results and suggestions"],
  },
  backend: {
    title: "Backend Testing",
    subtitle: "Comprehensive API Validation",
    description: "Automatically generate and execute backend tests for your REST and GraphQL APIs. Validate request/response schemas, edge cases, and error handling.",
    features: ["REST & GraphQL support", "Schema validation", "Authentication testing", "Load & performance testing", "Auto-generated test data", "Contract testing"],
  },
  frontend: {
    title: "Frontend Testing",
    subtitle: "Visual & Functional UI Testing",
    description: "AI-powered visual regression testing and functional UI validation. Catch visual bugs before they reach production.",
    features: ["Visual regression testing", "Component testing", "Accessibility testing", "Cross-browser validation", "Responsive design testing", "Interaction flow testing"],
  },
  data: {
    title: "Data Testing",
    subtitle: "Data Pipeline Validation",
    description: "Ensure data integrity across your pipelines. Validate transformations, schema changes, and data quality automatically.",
    features: ["Data quality checks", "Schema validation", "Pipeline monitoring", "Anomaly detection", "Data lineage tracking", "Custom data rules"],
  },
  "ai-agent": {
    title: "AI Agent/Model Testing",
    subtitle: "Validate AI Outputs",
    description: "Test and validate your AI models and agents. Ensure consistent, accurate, and safe outputs across different scenarios.",
    features: ["Prompt testing", "Output validation", "Hallucination detection", "Bias testing", "Performance benchmarking", "Safety guardrails testing"],
  },
};

export default function SolutionPage() {
  const { type } = useParams<{ type: string }>();
  const solution = solutionsData[type ?? ""] ?? solutionsData.mcp;

  return (
    <div>
      <section className="section-padding grid-bg">
        <div className="container-wide">
          <span className="text-primary font-heading text-sm font-medium">{APP_NAME} Solutions</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-4">{solution.title}</h1>
          <p className="text-xl text-muted-foreground font-heading">{solution.subtitle}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <p className="text-lg text-muted-foreground mb-8">{solution.description}</p>

          <h2 className="text-2xl font-heading font-bold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {solution.features.map((f) => (
              <div key={f} className="flex items-start gap-3 glass-card p-4">
                <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/sign-up">
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2">
                Get Started Free <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

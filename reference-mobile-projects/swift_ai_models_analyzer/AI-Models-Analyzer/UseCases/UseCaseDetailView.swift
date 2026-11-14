import SwiftUI

struct UseCaseDetailView: View {
    let useCase: UseCase

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                headerCard
                overviewCard
                stepsCard
                toolsCard
            }
            .padding(.bottom, 30)
        }
        .background(AppTheme.secondaryBackground.ignoresSafeArea())
        .navigationTitle(useCase.industry)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var headerCard: some View {
        VStack(spacing: 14) {
            Image(systemName: useCase.iconSymbol)
                .font(.system(size: 40))
                .foregroundStyle(AppTheme.accentSecondary)
                .frame(width: 76, height: 76)
                .background(AppTheme.accentSecondary.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 22))
            Text(useCase.title)
                .font(.title3.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .multilineTextAlignment(.center)
            HStack(spacing: 10) {
                IndustryTag(text: useCase.industry)
                ComplexityTag(text: useCase.complexity)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.06), radius: 10, y: 4)
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }

    private var overviewCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Overview", systemImage: "doc.text.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(fullDescription())
                .font(.subheadline)
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(4)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var stepsCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Label("Implementation Steps", systemImage: "list.number")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            ForEach(Array(implementationSteps().enumerated()), id: \.offset) { idx, step in
                HStack(alignment: .top, spacing: 12) {
                    Text("\(idx + 1)")
                        .font(.caption.bold())
                        .foregroundStyle(.white)
                        .frame(width: 24, height: 24)
                        .background(AppTheme.heroGradient)
                        .clipShape(Circle())
                    Text(step)
                        .font(.subheadline)
                        .foregroundStyle(AppTheme.textPrimary)
                        .lineSpacing(3)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var toolsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Recommended Models", systemImage: "cpu.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            FlowTagsView(tags: recommendedModels())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private func fullDescription() -> String {
        switch useCase.title {
        case "AI-Powered Code Review":
            return "Leverage large language models to automatically analyze pull requests, detect bugs, suggest optimizations, and enforce coding standards at scale — reducing manual review time by up to 70%."
        case "Medical Image Diagnosis":
            return "Apply vision-language models to interpret radiology scans, pathology slides, and diagnostic imaging with clinical-grade accuracy, augmenting physician decision-making."
        case "Customer Support Bot":
            return "Deploy conversational AI agents trained on your product documentation to handle tier-1 support queries, reducing ticket volume and improving response times 24/7."
        case "Content Generation Pipeline":
            return "Build automated pipelines that generate, review, and publish SEO-optimized blog posts, social media copy, and email campaigns — powered by instruction-tuned language models."
        case "Fraud Detection System":
            return "Use transformer-based anomaly detection to analyze transaction patterns in real-time, flagging suspicious activity with sub-100ms latency while minimizing false positives."
        default:
            return useCase.description
        }
    }

    private func implementationSteps() -> [String] {
        switch useCase.industry {
        case "Engineering": return ["Define code quality metrics and linting rules", "Fine-tune a base LLM on your codebase", "Integrate with GitHub/GitLab via CI/CD webhooks", "Set up review dashboard and feedback loop"]
        case "Healthcare": return ["Collect and anonymize medical imaging dataset", "Train or fine-tune a vision model", "Validate against clinical benchmarks", "Deploy behind HIPAA-compliant API gateway"]
        case "SaaS": return ["Build knowledge base from documentation", "Configure intent classification layer", "Integrate with helpdesk platform", "Monitor CSAT and escalation rates"]
        case "Marketing": return ["Define brand voice and content guidelines", "Set up content generation pipeline", "Add human review stage for brand safety", "Publish and measure engagement metrics"]
        case "Finance": return ["Ingest transaction streams from data warehouse", "Train anomaly detection model", "Define risk thresholds and alert rules", "Integrate with case management system"]
        default: return ["Define problem scope", "Select appropriate AI model", "Build and test pipeline", "Deploy and monitor"]
        }
    }

    private func recommendedModels() -> [String] {
        switch useCase.industry {
        case "Engineering": return ["GPT-5", "Claude 4", "Llama 4", "CodeLlama"]
        case "Healthcare": return ["Gemini Ultra 2", "Med-PaLM 2", "BioGPT"]
        case "SaaS": return ["GPT-5", "Claude 4", "Mistral Large"]
        case "Marketing": return ["GPT-5", "Llama 4", "Stable Diffusion 4"]
        case "Finance": return ["GPT-5", "Claude 4", "TimesFM"]
        default: return ["GPT-5", "Claude 4", "Gemini Ultra 2"]
        }
    }
}

struct ComplexityTag: View {
    let text: String
    private var color: Color {
        switch text {
        case "Beginner": return AppTheme.success
        case "Intermediate": return AppTheme.warning
        case "Advanced": return AppTheme.primaryGradientStart
        case "Expert": return AppTheme.destructive
        default: return AppTheme.textSecondary
        }
    }
    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(color)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
    }
}

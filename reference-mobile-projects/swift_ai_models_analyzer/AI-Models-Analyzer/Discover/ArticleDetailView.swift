import SwiftUI

struct ArticleDetailView: View {
    let article: NewsItem
    @State private var isBookmarked = false

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                heroHeader
                VStack(alignment: .leading, spacing: 20) {
                    metaRow
                    divider
                    articleBody
                    relatedTopics
                }
                .padding(16)
                .padding(.bottom, 40)
            }
        }
        .background(AppTheme.secondaryBackground.ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    withAnimation(.spring()) { isBookmarked.toggle() }
                } label: {
                    Image(systemName: isBookmarked ? "bookmark.fill" : "bookmark")
                        .foregroundStyle(AppTheme.primaryGradientStart)
                }
            }
        }
    }

    private var heroHeader: some View {
        ZStack(alignment: .bottomLeading) {
            AppTheme.heroGradient.frame(height: 200)
            Image(systemName: article.iconSymbol)
                .font(.system(size: 80))
                .foregroundStyle(.white.opacity(0.15))
                .frame(maxWidth: .infinity, alignment: .trailing)
                .padding(24)
            VStack(alignment: .leading, spacing: 8) {
                NewsArticleCategoryTag(text: article.category)
                Text(article.title)
                    .font(.title3.bold())
                    .foregroundStyle(.white)
                    .lineLimit(4)
            }
            .padding(20)
        }
    }

    private var metaRow: some View {
        HStack(spacing: 12) {
            Image(systemName: "newspaper.fill")
                .font(.caption)
                .foregroundStyle(AppTheme.primaryGradientStart)
            Text(article.source)
                .font(.subheadline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            HStack(spacing: 4) {
                Image(systemName: "clock")
                    .font(.caption2)
                Text(article.readTime)
                    .font(.caption)
            }
            .foregroundStyle(AppTheme.textTertiary)
            Text("·")
                .foregroundStyle(AppTheme.textTertiary)
            Text(article.timeAgo + " ago")
                .font(.caption)
                .foregroundStyle(AppTheme.textTertiary)
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.04), radius: 6, y: 2)
    }

    private var divider: some View {
        Rectangle()
            .fill(AppTheme.textTertiary.opacity(0.2))
            .frame(height: 1)
    }

    private var articleBody: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Summary")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(article.summary.isEmpty ? placeholderBody() : article.summary)
                .font(.body)
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(6)
            Text(expandedBody())
                .font(.body)
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(6)
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.04), radius: 6, y: 2)
    }

    private var relatedTopics: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Related Topics")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            FlowTagsView(tags: relatedTags())
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.04), radius: 6, y: 2)
    }

    private func placeholderBody() -> String {
        "This article covers the latest developments in the AI industry, with key insights from researchers and industry leaders. The implications for developers and businesses are explored in depth."
    }

    private func expandedBody() -> String {
        switch article.category {
        case "Releases":
            return "This release marks a significant leap in the generative AI space, introducing improvements in latency, accuracy, and cost-efficiency. Early benchmarks suggest up to 40% improvements over the prior generation across standard evaluation suites including MMLU, HumanEval, and GSM8K.\n\nEnterprise customers will benefit from new fine-tuning APIs and enhanced function calling capabilities that make it easier to integrate the model into existing production workflows."
        case "Research":
            return "The research methodology involved rigorous evaluation across over 50 standardized benchmarks, with human expert evaluations as a calibration layer. The authors note that while aggregate performance is impressive, edge cases and adversarial inputs remain an open challenge across all evaluated systems.\n\nThe findings have been submitted for peer review and are expected to shape the roadmap of several major AI labs in the coming quarters."
        case "Policy":
            return "Compliance timelines are staggered by organization size, with large enterprises required to meet initial requirements within six months. Smaller developers have a 12-month grace period to implement transparency disclosures and risk assessments.\n\nThe regulation has drawn mixed reactions — civil society organizations welcome the accountability measures, while some industry groups argue that the compliance burden may disadvantage European AI startups relative to US and Chinese competitors."
        case "Business":
            return "The funding round was led by a consortium of sovereign wealth funds and strategic corporate investors. The capital will be directed toward expanding compute infrastructure, hiring research talent, and accelerating international go-to-market efforts.\n\nAnalysts note that the valuation reflects not only current revenue traction but also the strategic optionality that frontier AI capabilities represent for acquirers and enterprise customers across sectors."
        default:
            return "The open-source community has responded enthusiastically to the release, with hundreds of derivative fine-tunes and integrations appearing within days on platforms like Hugging Face. The release is expected to accelerate research reproducibility and lower the barrier for smaller teams to experiment with frontier-scale AI capabilities."
        }
    }

    private func relatedTags() -> [String] {
        switch article.category {
        case "Releases": return ["GPT-5", "OpenAI", "LLM", "Benchmarks", "API"]
        case "Research": return ["AGI", "Benchmarks", "Reasoning", "DeepMind", "Safety"]
        case "Policy": return ["EU AI Act", "Compliance", "Regulation", "Ethics", "Governance"]
        case "Business": return ["Funding", "Venture Capital", "Anthropic", "Valuation", "Enterprise"]
        case "Open Source": return ["Meta", "Llama", "Open Source", "Community", "Hugging Face"]
        default: return ["AI", "Machine Learning", "Foundation Models", "Industry"]
        }
    }
}

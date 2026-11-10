import SwiftUI
import Charts

struct ModelDetailView: View {
    let model: AIModel
    @State private var isSaved = false
    private var cardColor: Color { Color(hex: model.color) }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                headerCard
                metricsRow
                benchmarkChart
                capabilitiesCard
                usedInSection
            }
            .padding(.bottom, 30)
        }
        .background(AppTheme.secondaryBackground.ignoresSafeArea())
        .navigationTitle(model.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                NavigationLink(destination: ModelCompareView()) {
                    Image(systemName: "arrow.left.arrow.right")
                        .foregroundStyle(AppTheme.primaryGradientStart)
                }
                Button { withAnimation(.spring()) { isSaved.toggle() } } label: {
                    Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                        .foregroundStyle(AppTheme.primaryGradientStart)
                }
            }
        }
    }

    private var headerCard: some View {
        VStack(spacing: 16) {
            Image(systemName: model.iconSymbol)
                .font(.system(size: 44))
                .foregroundStyle(cardColor)
                .frame(width: 80, height: 80)
                .background(cardColor.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 22))
            VStack(spacing: 6) {
                Text(model.name)
                    .font(.title2.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                Text(model.provider)
                    .font(.subheadline)
                    .foregroundStyle(AppTheme.textSecondary)
                CategoryTagSmall(text: model.category)
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

    private var metricsRow: some View {
        HStack(spacing: 12) {
            MetricTile(label: "Parameters", value: model.parameterCount, icon: "cpu")
            MetricTile(label: "Rating", value: String(format: "%.1f/5", model.rating), icon: "star.fill")
            MetricTile(label: "Trending", value: model.trending ? "Yes 🔥" : "No", icon: "flame.fill")
        }
        .padding(.horizontal, 16)
    }

    private var benchmarkChart: some View {
        let scores = benchmarkScores()
        return VStack(alignment: .leading, spacing: 12) {
            Text("Benchmark Scores")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Chart(scores) { item in
                BarMark(x: .value("Score", item.value), y: .value("Task", item.label))
                    .foregroundStyle(cardColor.gradient)
                    .cornerRadius(6)
            }
            .chartXScale(domain: 0...100)
            .frame(height: 180)
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var capabilitiesCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Capabilities")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            FlowTagsView(tags: capabilityTags())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var usedInSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Common Use Cases")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            ForEach(useCaseSamples(), id: \.self) { uc in
                HStack(spacing: 10) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(AppTheme.success)
                        .font(.body)
                    Text(uc)
                        .font(.subheadline)
                        .foregroundStyle(AppTheme.textPrimary)
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

    private func benchmarkScores() -> [ChartDataPoint] {
        let base = model.rating / 5.0
        return [
            ChartDataPoint(label: "Reasoning", value: base * 95),
            ChartDataPoint(label: "Coding", value: base * 88),
            ChartDataPoint(label: "Math", value: base * 80),
            ChartDataPoint(label: "Language", value: base * 97),
            ChartDataPoint(label: "Safety", value: base * 92),
        ]
    }

    private func capabilityTags() -> [String] {
        switch model.category {
        case "Language": return ["Text Generation", "Summarization", "Q&A", "Translation", "Code", "Reasoning"]
        case "Multimodal": return ["Vision", "Text", "Audio", "Video", "Reasoning", "OCR"]
        case "Image": return ["Text-to-Image", "Inpainting", "Style Transfer", "Upscaling"]
        case "Video": return ["Text-to-Video", "Video Editing", "Motion", "Rendering"]
        case "Audio": return ["Speech-to-Text", "Translation", "Diarization", "Noise Reduction"]
        default: return ["General AI", "Processing", "Inference"]
        }
    }

    private func useCaseSamples() -> [String] {
        switch model.category {
        case "Language": return ["Customer support automation", "Document analysis", "Code review & generation"]
        case "Multimodal": return ["Visual Q&A", "Document understanding", "Creative content"]
        case "Image": return ["Marketing visuals", "Product mockups", "Concept art"]
        case "Video": return ["Ad creation", "Social media content", "Training data"]
        case "Audio": return ["Meeting transcription", "Podcast subtitles", "Voice assistants"]
        default: return ["Data processing", "Workflow automation", "Analytics"]
        }
    }
}

struct MetricTile: View {
    let label: String
    let value: String
    let icon: String

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.body)
                .foregroundStyle(AppTheme.primaryGradientStart)
            Text(value)
                .font(.subheadline.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(label)
                .font(.caption2)
                .foregroundStyle(AppTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
    }
}

struct FlowTagsView: View {
    let tags: [String]

    var body: some View {
        // Simple wrap layout using LazyVGrid
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 90), spacing: 8)], spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                Text(tag)
                    .font(.caption.weight(.medium))
                    .foregroundStyle(AppTheme.primaryGradientStart)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(AppTheme.primaryGradientStart.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}

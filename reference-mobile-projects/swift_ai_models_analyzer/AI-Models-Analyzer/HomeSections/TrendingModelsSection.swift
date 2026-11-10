import SwiftUI

struct TrendingModelsSection: View {
    private let trendingModels = SampleData.models.filter { $0.trending }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionHeader
            scrollableCards
        }
    }

    private var sectionHeader: some View {
        HStack {
            Label("Trending Models", systemImage: "flame.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Text("See All")
                .font(.subheadline.weight(.medium))
                .foregroundStyle(AppTheme.primaryGradientStart)
        }
        .padding(.horizontal, 16)
    }

    private var scrollableCards: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 14) {
                ForEach(trendingModels) { model in
                    TrendingModelCard(model: model)
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

struct TrendingModelCard: View {
    let model: AIModel

    private var cardColor: Color { Color(hex: model.color) }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            cardHeader
            cardDetails
            ratingRow
        }
        .padding(14)
        .frame(width: 170)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
    }

    private var cardHeader: some View {
        HStack {
            Image(systemName: model.iconSymbol)
                .font(.title3)
                .foregroundStyle(cardColor)
                .frame(width: 36, height: 36)
                .background(cardColor.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            Spacer()
            Text("🔥")
                .font(.caption)
        }
    }

    private var cardDetails: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(model.name)
                .font(.subheadline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(model.provider)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }

    private var ratingRow: some View {
        HStack(spacing: 4) {
            Image(systemName: "star.fill")
                .font(.caption2)
                .foregroundStyle(.orange)
            Text(String(format: "%.1f", model.rating))
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Text(model.parameterCount)
                .font(.caption2.weight(.medium))
                .foregroundStyle(AppTheme.textSecondary)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(AppTheme.secondaryBackground)
                .clipShape(Capsule())
        }
    }
}

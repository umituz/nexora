import SwiftUI

struct QuickUseCasesSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionHeader
            scrollableCards
        }
    }

    private var sectionHeader: some View {
        HStack {
            Label("Popular Use Cases", systemImage: "lightbulb.fill")
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
                ForEach(SampleData.useCases) { useCase in
                    UseCaseCard(useCase: useCase)
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

struct UseCaseCard: View {
    let useCase: UseCase

    private var complexityColor: Color {
        switch useCase.complexity {
        case "Beginner": return AppTheme.success
        case "Intermediate": return AppTheme.warning
        case "Advanced": return AppTheme.primaryGradientStart
        case "Expert": return AppTheme.destructive
        default: return AppTheme.textSecondary
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            cardIcon
            cardContent
            complexityBadge
        }
        .padding(14)
        .frame(width: 190)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
    }

    private var cardIcon: some View {
        Image(systemName: useCase.iconSymbol)
            .font(.title3)
            .foregroundStyle(AppTheme.accentSecondary)
            .frame(width: 40, height: 40)
            .background(AppTheme.accentSecondary.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    private var cardContent: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(useCase.title)
                .font(.subheadline.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .lineLimit(2)
            Text(useCase.industry)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }

    private var complexityBadge: some View {
        Text(useCase.complexity)
            .font(.caption2.bold())
            .foregroundStyle(complexityColor)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(complexityColor.opacity(0.12))
            .clipShape(Capsule())
    }
}

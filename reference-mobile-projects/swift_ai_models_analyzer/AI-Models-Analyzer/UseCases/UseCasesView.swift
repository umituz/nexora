import SwiftUI

struct UseCasesView: View {
    @State private var searchText = ""
    @State private var selectedIndustry = "All"

    private let industries = ["All", "Engineering", "Healthcare", "SaaS", "Marketing", "Finance"]

    private var filtered: [UseCase] {
        SampleData.useCases.filter { uc in
            let matchInd = selectedIndustry == "All" || uc.industry == selectedIndustry
            let matchSearch = searchText.isEmpty || uc.title.localizedCaseInsensitiveContains(searchText)
            return matchInd && matchSearch
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    inspirationBanner
                    industryPicker
                    useCaseList
                }
                .padding(.bottom, 24)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("Use Cases")
            .searchable(text: $searchText, prompt: "Search use cases...")
        }
    }

    private var inspirationBanner: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Find Your AI Workflow")
                    .font(.headline.bold())
                    .foregroundStyle(.white)
                Text("Hundreds of real-world AI implementations, curated by experts.")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.85))
                    .lineLimit(2)
            }
            Spacer()
            Image(systemName: "lightbulb.fill")
                .font(.system(size: 36))
                .foregroundStyle(.white.opacity(0.9))
        }
        .padding(20)
        .background(AppTheme.heroGradient)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .padding(.horizontal, 16)
        .padding(.top, 4)
    }

    private var industryPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(industries, id: \.self) { ind in
                    CategoryChip(title: ind, isSelected: selectedIndustry == ind) {
                        withAnimation(.spring(response: 0.3)) { selectedIndustry = ind }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }

    private var useCaseList: some View {
        LazyVStack(spacing: 14) {
            ForEach(filtered) { uc in
                NavigationLink(destination: UseCaseDetailView(useCase: uc)) {
                    UseCaseListCard(useCase: uc)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
    }
}

struct UseCaseListCard: View {
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
        HStack(spacing: 14) {
            Image(systemName: useCase.iconSymbol)
                .font(.title3)
                .foregroundStyle(AppTheme.accentSecondary)
                .frame(width: 50, height: 50)
                .background(AppTheme.accentSecondary.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 14))
            VStack(alignment: .leading, spacing: 4) {
                Text(useCase.title)
                    .font(.subheadline.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                    .lineLimit(2)
                Text(useCase.description)
                    .font(.caption)
                    .foregroundStyle(AppTheme.textSecondary)
                    .lineLimit(1)
                HStack(spacing: 8) {
                    IndustryTag(text: useCase.industry)
                    Text(useCase.complexity)
                        .font(.caption2.bold())
                        .foregroundStyle(complexityColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(complexityColor.opacity(0.12))
                        .clipShape(Capsule())
                }
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption.weight(.semibold))
                .foregroundStyle(AppTheme.textTertiary)
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
    }
}

struct IndustryTag: View {
    let text: String
    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(AppTheme.accent)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(AppTheme.accent.opacity(0.12))
            .clipShape(Capsule())
    }
}

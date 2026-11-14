import SwiftUI

struct ModelsView: View {
    @State private var searchText = ""
    @State private var selectedCategory: String = "All"

    private let categories = ["All", "Language", "Multimodal", "Image", "Video", "Audio"]

    private var filtered: [AIModel] {
        SampleData.models.filter { model in
            let matchCat = selectedCategory == "All" || model.category == selectedCategory
            let matchSearch = searchText.isEmpty || model.name.localizedCaseInsensitiveContains(searchText) || model.provider.localizedCaseInsensitiveContains(searchText)
            return matchCat && matchSearch
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    categoryPicker
                    modelGrid
                }
                .padding(.bottom, 20)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("AI Models")
            .searchable(text: $searchText, prompt: "Search models or providers...")
        }
    }

    private var categoryPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(categories, id: \.self) { cat in
                    CategoryChip(title: cat, isSelected: selectedCategory == cat) {
                        withAnimation(.spring(response: 0.3)) { selectedCategory = cat }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 4)
        }
    }

    private var modelGrid: some View {
        LazyVStack(spacing: 14) {
            ForEach(filtered) { model in
                NavigationLink(destination: ModelDetailView(model: model)) {
                    ModelListCard(model: model)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
    }
}

struct CategoryChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline.weight(isSelected ? .semibold : .regular))
                .foregroundStyle(isSelected ? .white : AppTheme.textSecondary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? AppTheme.heroGradient : LinearGradient(colors: [AppTheme.cardBackground, AppTheme.cardBackground], startPoint: .leading, endPoint: .trailing))
                .clipShape(Capsule())
                .shadow(color: isSelected ? AppTheme.primaryGradientStart.opacity(0.3) : .clear, radius: 6, y: 3)
        }
    }
}

struct ModelListCard: View {
    let model: AIModel
    private var cardColor: Color { Color(hex: model.color) }

    var body: some View {
        HStack(spacing: 14) {
            iconView
            infoView
            Spacer()
            ratingView
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
    }

    private var iconView: some View {
        Image(systemName: model.iconSymbol)
            .font(.title3)
            .foregroundStyle(cardColor)
            .frame(width: 48, height: 48)
            .background(cardColor.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var infoView: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack(spacing: 6) {
                Text(model.name)
                    .font(.subheadline.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                if model.trending {
                    Text("🔥")
                        .font(.caption2)
                }
            }
            Text(model.provider)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
            HStack(spacing: 6) {
                CategoryTagSmall(text: model.category)
                Text(model.parameterCount)
                    .font(.caption2.weight(.medium))
                    .foregroundStyle(AppTheme.textTertiary)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(AppTheme.secondaryBackground)
                    .clipShape(Capsule())
            }
        }
    }

    private var ratingView: some View {
        VStack(spacing: 4) {
            Image(systemName: "star.fill")
                .font(.caption)
                .foregroundStyle(.orange)
            Text(String(format: "%.1f", model.rating))
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
        }
    }
}

struct CategoryTagSmall: View {
    let text: String

    private var color: Color {
        switch text {
        case "Language": return AppTheme.primaryGradientStart
        case "Multimodal": return AppTheme.accent
        case "Image": return Color(hex: "EC4899")
        case "Video": return AppTheme.primaryGradientEnd
        case "Audio": return AppTheme.success
        default: return AppTheme.textSecondary
        }
    }

    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(color)
            .padding(.horizontal, 7)
            .padding(.vertical, 2)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
    }
}

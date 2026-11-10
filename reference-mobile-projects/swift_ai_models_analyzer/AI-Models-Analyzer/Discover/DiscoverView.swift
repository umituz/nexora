import SwiftUI

struct DiscoverView: View {
    @State private var selectedCategory = "All"
    @State private var searchText = ""

    private let categories = ["All", "Releases", "Research", "Policy", "Business", "Open Source"]

    private var filteredNews: [NewsItem] {
        SampleData.news.filter { item in
            let matchCat = selectedCategory == "All" || item.category == selectedCategory
            let matchSearch = searchText.isEmpty || item.title.localizedCaseInsensitiveContains(searchText)
            return matchCat && matchSearch
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    trendingTopics
                    categoryFilter
                    if filteredNews.isEmpty {
                        emptyState
                    } else {
                        featuredArticle
                        newsFeed
                    }
                }
                .padding(.bottom, 24)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("Discover")
            .searchable(text: $searchText, prompt: "Search AI news & research...")
        }
    }

    // MARK: - Trending Topics
    private var trendingTopics: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Trending Topics", systemImage: "flame.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .padding(.horizontal, 16)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(SampleData.trendingTopics) { topic in
                        TrendingTopicCard(topic: topic)
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.top, 4)
    }

    // MARK: - Category Filter
    private var categoryFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(categories, id: \.self) { cat in
                    CategoryChip(title: cat, isSelected: selectedCategory == cat) {
                        withAnimation(.spring(response: 0.3)) { selectedCategory = cat }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }

    // MARK: - Featured Article
    private var featuredArticle: some View {
        Group {
            if let first = filteredNews.first {
                NavigationLink(destination: ArticleDetailView(article: first)) {
                    FeaturedArticleCard(article: first)
                }
                .buttonStyle(.plain)
                .padding(.horizontal, 16)
            }
        }
    }

    // MARK: - News Feed
    private var newsFeed: some View {
        LazyVStack(spacing: 12) {
            ForEach(filteredNews.dropFirst()) { item in
                NavigationLink(destination: ArticleDetailView(article: item)) {
                    NewsListCard(article: item)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "newspaper")
                .font(.system(size: 50))
                .foregroundStyle(AppTheme.textTertiary)
            Text("No articles found")
                .font(.headline)
                .foregroundStyle(AppTheme.textSecondary)
            Text("Try a different category or search term")
                .font(.subheadline)
                .foregroundStyle(AppTheme.textTertiary)
        }
        .frame(maxWidth: .infinity)
        .padding(40)
    }
}

// MARK: - Trending Topic Card
struct TrendingTopicCard: View {
    let topic: TrendingTopic
    private var topicColor: Color { Color(hex: topic.color) }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Image(systemName: topic.icon)
                .font(.title3)
                .foregroundStyle(topicColor)
                .frame(width: 42, height: 42)
                .background(topicColor.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            Text(topic.title)
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .lineLimit(2)
                .frame(width: 100, alignment: .leading)
            Text("\(formattedCount(topic.count)) posts")
                .font(.caption2)
                .foregroundStyle(AppTheme.textTertiary)
        }
        .padding(12)
        .frame(width: 124)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
    }

    private func formattedCount(_ n: Int) -> String {
        if n >= 1000 { return String(format: "%.1fK", Double(n) / 1000) }
        return "\(n)"
    }
}

// MARK: - Featured Article Card
struct FeaturedArticleCard: View {
    let article: NewsItem

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            featuredHeader
            featuredBody
        }
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.07), radius: 10, y: 4)
    }

    private var featuredHeader: some View {
        ZStack(alignment: .bottomLeading) {
            AppTheme.heroGradient
                .frame(height: 160)
            HStack {
                Image(systemName: article.iconSymbol)
                    .font(.system(size: 50))
                    .foregroundStyle(.white.opacity(0.25))
            }
            .frame(maxWidth: .infinity, alignment: .trailing)
            .padding(24)
            VStack(alignment: .leading, spacing: 6) {
                NewsArticleCategoryTag(text: article.category)
                Text(article.title)
                    .font(.headline.bold())
                    .foregroundStyle(.white)
                    .lineLimit(3)
            }
            .padding(16)
        }
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    private var featuredBody: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(article.summary)
                .font(.subheadline)
                .foregroundStyle(AppTheme.textSecondary)
                .lineLimit(2)
            HStack {
                Text(article.source)
                    .font(.caption.bold())
                    .foregroundStyle(AppTheme.primaryGradientStart)
                Spacer()
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.caption2)
                    Text(article.readTime)
                        .font(.caption2)
                }
                .foregroundStyle(AppTheme.textTertiary)
                Text("· \(article.timeAgo) ago")
                    .font(.caption2)
                    .foregroundStyle(AppTheme.textTertiary)
            }
        }
        .padding(16)
    }
}

// MARK: - News List Card
struct NewsListCard: View {
    let article: NewsItem

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: article.iconSymbol)
                .font(.title3)
                .foregroundStyle(AppTheme.primaryGradientStart)
                .frame(width: 48, height: 48)
                .background(AppTheme.primaryGradientStart.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 14))
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    NewsArticleCategoryTag(text: article.category)
                    Spacer()
                    Text(article.timeAgo + " ago")
                        .font(.caption2)
                        .foregroundStyle(AppTheme.textTertiary)
                }
                Text(article.title)
                    .font(.subheadline.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                    .lineLimit(2)
                HStack(spacing: 6) {
                    Text(article.source)
                        .font(.caption)
                        .foregroundStyle(AppTheme.textSecondary)
                    Text("·")
                        .font(.caption)
                        .foregroundStyle(AppTheme.textTertiary)
                    Image(systemName: "clock")
                        .font(.caption2)
                        .foregroundStyle(AppTheme.textTertiary)
                    Text(article.readTime)
                        .font(.caption)
                        .foregroundStyle(AppTheme.textTertiary)
                }
            }
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.04), radius: 6, y: 2)
    }
}

// MARK: - Category Tag
struct NewsArticleCategoryTag: View {
    let text: String
    private var color: Color {
        switch text {
        case "Releases": return AppTheme.success
        case "Research": return AppTheme.primaryGradientStart
        case "Policy": return AppTheme.warning
        case "Business": return Color(hex: "0EA5E9")
        case "Open Source": return Color(hex: "10B981")
        default: return AppTheme.textSecondary
        }
    }
    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
    }
}

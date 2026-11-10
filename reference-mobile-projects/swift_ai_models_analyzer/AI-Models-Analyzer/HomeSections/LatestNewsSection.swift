import SwiftUI

struct LatestNewsSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionHeader
            newsCards
        }
        .padding(.horizontal, 16)
    }

    private var sectionHeader: some View {
        HStack {
            Label("Latest AI News", systemImage: "newspaper.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Text("See All")
                .font(.subheadline.weight(.medium))
                .foregroundStyle(AppTheme.primaryGradientStart)
        }
    }

    private var newsCards: some View {
        VStack(spacing: 0) {
            ForEach(Array(SampleData.news.enumerated()), id: \.element.id) { index, item in
                NewsRow(item: item)
                if index < SampleData.news.count - 1 {
                    Divider().padding(.leading, 52)
                }
            }
        }
        .padding(.vertical, 4)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
    }
}

struct NewsRow: View {
    let item: NewsItem

    var body: some View {
        HStack(spacing: 12) {
            newsIcon
            newsContent
            Spacer()
            timeLabel
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    private var newsIcon: some View {
        Image(systemName: item.iconSymbol)
            .font(.body)
            .foregroundStyle(AppTheme.accent)
            .frame(width: 32, height: 32)
            .background(AppTheme.accent.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private var newsContent: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(item.title)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(AppTheme.textPrimary)
                .lineLimit(2)
            Text(item.source)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }

    private var timeLabel: some View {
        Text(item.timeAgo)
            .font(.caption2.weight(.medium))
            .foregroundStyle(AppTheme.textTertiary)
    }
}

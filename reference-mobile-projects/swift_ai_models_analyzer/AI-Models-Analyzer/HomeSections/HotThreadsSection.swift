import SwiftUI

struct HotThreadsSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionHeader
            threadCards
        }
        .padding(.horizontal, 16)
    }

    private var sectionHeader: some View {
        HStack {
            Label("Hot Discussions", systemImage: "bubble.left.and.bubble.right.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Text("See All")
                .font(.subheadline.weight(.medium))
                .foregroundStyle(AppTheme.primaryGradientStart)
        }
    }

    private var threadCards: some View {
        VStack(spacing: 10) {
            ForEach(SampleData.threads) { thread in
                ThreadCard(thread: thread)
            }
        }
    }
}

struct ThreadCard: View {
    let thread: DiscussionThread

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            threadHeader
            threadTitle
            threadFooter
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
    }

    private var threadHeader: some View {
        HStack {
            TagBadge(text: thread.tag)
            Spacer()
            Text(thread.timeAgo + " ago")
                .font(.caption2)
                .foregroundStyle(AppTheme.textTertiary)
        }
    }

    private var threadTitle: some View {
        Text(thread.title)
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(AppTheme.textPrimary)
            .lineLimit(2)
    }

    private var threadFooter: some View {
        HStack(spacing: 16) {
            Label("@\(thread.author)", systemImage: "person.circle.fill")
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
            Spacer()
            Label("\(thread.replies)", systemImage: "bubble.right.fill")
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
            Label("\(thread.likes)", systemImage: "heart.fill")
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }
}

struct TagBadge: View {
    let text: String

    private var tagColor: Color {
        switch text {
        case "Debate": return AppTheme.primaryGradientEnd
        case "Tutorial": return AppTheme.success
        case "News": return AppTheme.accent
        case "Guide": return AppTheme.warning
        default: return AppTheme.textSecondary
        }
    }

    var body: some View {
        Text(text)
            .font(.caption2.bold())
            .foregroundStyle(tagColor)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(tagColor.opacity(0.12))
            .clipShape(Capsule())
    }
}

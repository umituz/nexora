import SwiftUI

struct ProfileView: View {
    @State private var notificationsOn = true
    @State private var darkModeOverride = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    profileHeader
                    activityCard
                    savedSection
                    settingsSection
                }
                .padding(.bottom, 30)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("Profile")
        }
    }

    private var profileHeader: some View {
        VStack(spacing: 14) {
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(AppTheme.heroGradient)
                    .frame(width: 88, height: 88)
                    .overlay {
                        Text("AJ")
                            .font(.title.bold())
                            .foregroundStyle(.white)
                    }
                Circle()
                    .fill(AppTheme.success)
                    .frame(width: 20, height: 20)
                    .overlay { Image(systemName: "checkmark").font(.system(size: 10, weight: .bold)).foregroundStyle(.white) }
            }
            VStack(spacing: 4) {
                Text("Alex Johnson")
                    .font(.title3.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                Text("@alexj_ai · AI Researcher")
                    .font(.subheadline)
                    .foregroundStyle(AppTheme.textSecondary)
            }
            HStack(spacing: 24) {
                ProfileStat(value: "148", label: "Bookmarks")
                Divider().frame(height: 32)
                ProfileStat(value: "32", label: "Threads")
                Divider().frame(height: 32)
                ProfileStat(value: "1.2K", label: "Likes")
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

    private var activityCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Recent Activity")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            ForEach(recentActivity(), id: \.title) { item in
                ActivityRow(item: item)
            }
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var savedSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Bookmarked Models")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(SampleData.models.filter { $0.trending }.prefix(4)) { model in
                        SavedModelChip(model: model)
                    }
                }
            }
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var settingsSection: some View {
        VStack(spacing: 0) {
            ToggleSettingsRow(icon: "bell.fill", title: "Notifications", color: AppTheme.primaryGradientStart, isOn: $notificationsOn)
            Divider().padding(.leading, 52)
            ToggleSettingsRow(icon: "moon.fill", title: "Dark Mode", color: AppTheme.accentSecondary, isOn: $darkModeOverride)
            Divider().padding(.leading, 52)
            ChevronSettingsRow(icon: "envelope.fill", title: "Weekly Digest", color: AppTheme.accent)
            Divider().padding(.leading, 52)
            ChevronSettingsRow(icon: "questionmark.circle.fill", title: "Help & Feedback", color: AppTheme.warning)
        }
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private func recentActivity() -> [ActivityItem] {
        [
            ActivityItem(icon: "bookmark.fill", title: "Bookmarked GPT-5", timeAgo: "2h", color: AppTheme.primaryGradientStart),
            ActivityItem(icon: "bubble.right.fill", title: "Replied to thread on RAG", timeAgo: "5h", color: AppTheme.accent),
            ActivityItem(icon: "heart.fill", title: "Liked 12 posts", timeAgo: "1d", color: AppTheme.destructive),
        ]
    }
}

struct ProfileStat: View {
    let value: String
    let label: String
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(label)
                .font(.caption2)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }
}

struct ActivityItem {
    let icon: String
    let title: String
    let timeAgo: String
    let color: Color
}

struct ActivityRow: View {
    let item: ActivityItem
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: item.icon)
                .font(.body)
                .foregroundStyle(item.color)
                .frame(width: 34, height: 34)
                .background(item.color.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            Text(item.title)
                .font(.subheadline)
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Text(item.timeAgo)
                .font(.caption2)
                .foregroundStyle(AppTheme.textTertiary)
        }
    }
}

struct SavedModelChip: View {
    let model: AIModel
    private var cardColor: Color { Color(hex: model.color) }
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: model.iconSymbol)
                .font(.caption)
                .foregroundStyle(cardColor)
            Text(model.name)
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(cardColor.opacity(0.08))
        .clipShape(Capsule())
    }
}

struct ToggleSettingsRow: View {
    let icon: String
    let title: String
    let color: Color
    @Binding var isOn: Bool

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.body).foregroundStyle(.white)
                .frame(width: 32, height: 32)
                .background(color)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            Text(title).font(.subheadline).foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Toggle("", isOn: $isOn).labelsHidden().tint(AppTheme.primaryGradientStart)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
    }
}

struct ChevronSettingsRow: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.body).foregroundStyle(.white)
                .frame(width: 32, height: 32)
                .background(color)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            Text(title).font(.subheadline).foregroundStyle(AppTheme.textPrimary)
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption.weight(.semibold))
                .foregroundStyle(AppTheme.textTertiary)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
    }
}

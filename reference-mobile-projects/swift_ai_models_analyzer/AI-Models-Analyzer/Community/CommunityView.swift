import SwiftUI

struct CommunityView: View {
    @State private var searchText = ""
    @State private var selectedTag = "All"

    private let tags = ["All", "Debate", "Tutorial", "News", "Guide"]

    private var filtered: [DiscussionThread] {
        SampleData.threads.filter { t in
            let matchTag = selectedTag == "All" || t.tag == selectedTag
            let matchSearch = searchText.isEmpty || t.title.localizedCaseInsensitiveContains(searchText)
            return matchTag && matchSearch
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    communityStats
                    tagFilter
                    threadList
                }
                .padding(.bottom, 24)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("Community")
            .searchable(text: $searchText, prompt: "Search threads...")
            .toolbar { toolbarItem }
        }
    }

    private var communityStats: some View {
        HStack(spacing: 12) {
            CommunityStat(value: "12K", label: "Threads", icon: "bubble.left.and.bubble.right.fill", color: AppTheme.primaryGradientStart)
            CommunityStat(value: "48K", label: "Members", icon: "person.3.fill", color: AppTheme.accent)
            CommunityStat(value: "230K", label: "Likes", icon: "heart.fill", color: Color(hex: "EF4444"))
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
    }

    private var tagFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(tags, id: \.self) { tag in
                    CategoryChip(title: tag, isSelected: selectedTag == tag) {
                        withAnimation(.spring(response: 0.3)) { selectedTag = tag }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }

    private var threadList: some View {
        LazyVStack(spacing: 14) {
            ForEach(filtered) { thread in
                NavigationLink(destination: ThreadDetailView(thread: thread)) {
                    ThreadCard(thread: thread)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
    }

    private var toolbarItem: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Button { } label: {
                Image(systemName: "square.and.pencil")
                    .foregroundStyle(AppTheme.primaryGradientStart)
            }
        }
    }
}

struct CommunityStat: View {
    let value: String
    let label: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(color)
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(label)
                .font(.caption2)
                .foregroundStyle(AppTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
    }
}

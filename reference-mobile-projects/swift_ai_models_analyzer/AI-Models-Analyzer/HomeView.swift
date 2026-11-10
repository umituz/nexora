import SwiftUI

struct HomeView: View {
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 24) {
                    HeroSection()
                    TrendingModelsSection()
                    LeaderboardChartSection()
                    LatestNewsSection()
                    HotThreadsSection()
                    QuickUseCasesSection()
                    Spacer(minLength: 20)
                }
                .padding(.bottom, 20)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("InsightHub")
            .searchable(text: $searchText, prompt: "Search models, threads, use cases...")
        }
    }
}

// MARK: - Hero Section
struct HeroSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            heroHeader
            heroStats
        }
        .padding(20)
        .background(AppTheme.heroGradient)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .padding(.horizontal, 16)
    }

    private var heroHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("AI Intelligence Feed", systemImage: "sparkles")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.white.opacity(0.85))
            Text("The AI landscape is\nmoving fast.")
                .font(.title2.bold())
                .foregroundStyle(.white)
            Text("Track 2,400+ models across 180 providers. Your command center for everything AI.")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))
                .lineLimit(3)
        }
    }

    private var heroStats: some View {
        HStack(spacing: 16) {
            StatBadge(value: "2.4K", label: "Models")
            StatBadge(value: "180", label: "Providers")
            StatBadge(value: "12K", label: "Discussions")
        }
        .padding(.top, 4)
    }
}

struct StatBadge: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(.white)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(.white.opacity(0.15))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

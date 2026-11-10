import SwiftUI
import Charts

struct LeaderboardView: View {
    @State private var selectedCategory = "Overall"
    private let categories = ["Overall", "Language", "Multimodal", "Image", "Code", "Reasoning"]

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    podiumSection
                    categoryFilter
                    weeklyTrendCard
                    rankingList
                }
                .padding(.bottom, 32)
            }
            .background(AppTheme.secondaryBackground.ignoresSafeArea())
            .navigationTitle("Leaderboard")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Podium
    private var podiumSection: some View {
        ZStack(alignment: .bottom) {
            AppTheme.heroGradient
                .clipShape(RoundedRectangle(cornerRadius: 0))
                .frame(height: 220)
                .padding(.horizontal, -16)
            HStack(alignment: .bottom, spacing: 0) {
                podiumSlot(entry: SampleData.leaderboard[1], rank: 2, height: 90, delay: 0.1)
                podiumSlot(entry: SampleData.leaderboard[0], rank: 1, height: 120, delay: 0.0)
                podiumSlot(entry: SampleData.leaderboard[2], rank: 3, height: 70, delay: 0.2)
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, 0)
        .clipped()
    }

    private func podiumSlot(entry: LeaderboardEntry, rank: Int, height: CGFloat, delay: Double) -> some View {
        VStack(spacing: 6) {
            if rank == 1 {
                Text("🏆").font(.title)
            }
            Text(entry.modelName)
                .font(.caption.bold())
                .foregroundStyle(.white)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(String(format: "%.1f", entry.score))
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.8))
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(.white.opacity(rank == 1 ? 0.25 : 0.15))
                    .frame(width: rank == 1 ? 110 : 90, height: height)
                Text("#\(rank)")
                    .font(.title2.bold())
                    .foregroundStyle(.white)
            }
        }
        .frame(maxWidth: .infinity)
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

    // MARK: - Weekly Trend
    private var weeklyTrendCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Score Trend — Top Model (7 Days)", systemImage: "chart.line.uptrend.xyaxis")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Chart {
                ForEach(Array(zip(SampleData.weekLabels, SampleData.weeklyScores)), id: \.0) { label, score in
                    LineMark(x: .value("Day", label), y: .value("Score", score))
                        .foregroundStyle(AppTheme.heroGradient)
                        .interpolationMethod(.catmullRom)
                    AreaMark(x: .value("Day", label), y: .value("Score", score))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [AppTheme.primaryGradientStart.opacity(0.3), AppTheme.primaryGradientStart.opacity(0.0)],
                                startPoint: .top, endPoint: .bottom
                            )
                        )
                        .interpolationMethod(.catmullRom)
                    PointMark(x: .value("Day", label), y: .value("Score", score))
                        .foregroundStyle(AppTheme.primaryGradientEnd)
                        .symbolSize(30)
                }
            }
            .chartYScale(domain: 75...100)
            .frame(height: 150)
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    // MARK: - Ranking List
    private var rankingList: some View {
        VStack(spacing: 10) {
            ForEach(SampleData.leaderboard) { entry in
                LeaderboardRow(entry: entry)
            }
        }
        .padding(.horizontal, 16)
    }
}

struct LeaderboardRow: View {
    let entry: LeaderboardEntry

    private var rankColor: Color {
        switch entry.rank {
        case 1: return Color(hex: "F59E0B")
        case 2: return Color(hex: "94A3B8")
        case 3: return Color(hex: "CD7F32")
        default: return AppTheme.textTertiary
        }
    }

    private var changeIcon: String {
        if entry.change > 0 { return "arrow.up" }
        if entry.change < 0 { return "arrow.down" }
        return "minus"
    }

    private var changeColor: Color {
        if entry.change > 0 { return AppTheme.success }
        if entry.change < 0 { return AppTheme.destructive }
        return AppTheme.textTertiary
    }

    var body: some View {
        HStack(spacing: 14) {
            rankBadge
            modelInfo
            Spacer()
            scoreView
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 6, y: 2)
        .overlay(
            entry.rank == 1 ? RoundedRectangle(cornerRadius: 16).strokeBorder(Color(hex: "F59E0B").opacity(0.4), lineWidth: 1.5) : nil
        )
    }

    private var rankBadge: some View {
        ZStack {
            Circle()
                .fill(rankColor.opacity(0.15))
                .frame(width: 40, height: 40)
            Text("#\(entry.rank)")
                .font(.caption.bold())
                .foregroundStyle(rankColor)
        }
    }

    private var modelInfo: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(entry.modelName)
                .font(.subheadline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Text(entry.provider)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }

    private var scoreView: some View {
        VStack(alignment: .trailing, spacing: 4) {
            Text(String(format: "%.1f", entry.score))
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            HStack(spacing: 3) {
                Image(systemName: changeIcon)
                    .font(.caption2.bold())
                if entry.change != 0 {
                    Text("\(abs(entry.change))")
                        .font(.caption2.bold())
                }
            }
            .foregroundStyle(changeColor)
        }
    }
}

import SwiftUI
import Charts

struct LeaderboardChartSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionHeader
            chartCard
            topModelsCard
        }
        .padding(.horizontal, 16)
    }

    private var sectionHeader: some View {
        HStack {
            Label("Performance Leaderboard", systemImage: "chart.bar.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Spacer()
            NavigationLink(destination: LeaderboardView()) {
                Text("Full Rankings")
                    .font(.caption.bold())
                    .foregroundStyle(AppTheme.primaryGradientStart)
            }
        }
    }

    private var chartCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            chartHeader
            performanceChart
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
    }

    private var chartHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Top Model Score Trend")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AppTheme.textPrimary)
            Text("GPT-5 benchmark score this week")
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
        }
    }

    private var performanceChart: some View {
        let data = zip(SampleData.weekLabels, SampleData.weeklyScores)
            .map { ChartDataPoint(label: $0.0, value: $0.1) }
        return Chart(data) { point in
            LineMark(x: .value("Day", point.label), y: .value("Score", point.value))
                .foregroundStyle(AppTheme.primaryGradientStart)
                .interpolationMethod(.catmullRom)
            AreaMark(x: .value("Day", point.label), y: .value("Score", point.value))
                .foregroundStyle(
                    LinearGradient(
                        colors: [AppTheme.primaryGradientStart.opacity(0.3), .clear],
                        startPoint: .top, endPoint: .bottom
                    )
                )
                .interpolationMethod(.catmullRom)
            PointMark(x: .value("Day", point.label), y: .value("Score", point.value))
                .foregroundStyle(AppTheme.primaryGradientStart)
                .symbolSize(30)
        }
        .chartYScale(domain: 78...96)
        .chartYAxis { AxisMarks(position: .leading, values: .automatic(desiredCount: 4)) }
        .frame(height: 160)
    }

    private var topModelsCard: some View {
        VStack(spacing: 0) {
            ForEach(Array(SampleData.leaderboard.prefix(3).enumerated()), id: \.element.id) { index, entry in
                HomeLeaderboardRow(entry: entry)
                if index < 2 {
                    Divider().padding(.leading, 44)
                }
            }
        }
        .padding(.vertical, 4)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
    }
}

struct HomeLeaderboardRow: View {
    let entry: LeaderboardEntry
    private var rankColor: Color {
        switch entry.rank {
        case 1: return .orange
        case 2: return Color(.systemGray2)
        case 3: return Color(hex: "CD7F32")
        default: return AppTheme.textTertiary
        }
    }
    var body: some View {
        HStack(spacing: 12) {
            Text("#\(entry.rank)")
                .font(.caption.bold())
                .foregroundStyle(rankColor)
                .frame(width: 28)
            VStack(alignment: .leading, spacing: 1) {
                Text(entry.modelName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(AppTheme.textPrimary)
                Text(entry.provider)
                    .font(.caption)
                    .foregroundStyle(AppTheme.textSecondary)
            }
            Spacer()
            HStack(spacing: 6) {
                Text(String(format: "%.1f", entry.score))
                    .font(.subheadline.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                Group {
                    if entry.change > 0 {
                        Image(systemName: "arrow.up.circle.fill").foregroundStyle(AppTheme.success)
                    } else if entry.change < 0 {
                        Image(systemName: "arrow.down.circle.fill").foregroundStyle(AppTheme.destructive)
                    } else {
                        Image(systemName: "minus.circle.fill").foregroundStyle(AppTheme.textTertiary)
                    }
                }
                .font(.caption)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}



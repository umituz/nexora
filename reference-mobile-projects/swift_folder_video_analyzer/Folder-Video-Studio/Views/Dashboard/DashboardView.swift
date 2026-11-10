import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                heroSection
                statsRow
                contentColumns
            }
            .padding(28)
        }
        .background(Color(NSColor.underPageBackgroundColor))
    }

    private var heroSection: some View {
        HeroCard(
            hasAnalysis: appState.folderAnalysis != nil,
            isAnalyzing: appState.isAnalyzing,
            folderName: appState.folderAnalysis?.folderName,
            onSelectFolder: { appState.selectFolder() }
        )
    }

    private var statsRow: some View {
        HStack(spacing: 16) {
            StatCard(title: L10n.Dashboard.Stats.totalProjects, value: "\(appState.projects.count)", icon: "film.stack.fill", color: .blue)
            StatCard(title: L10n.Dashboard.Stats.completed, value: "\(appState.projects.filter { $0.status == .completed }.count)", icon: "checkmark.circle.fill", color: .green)
            StatCard(title: L10n.Dashboard.Stats.processing, value: "\(appState.projects.filter { $0.status == .rendering }.count)", icon: "arrow.triangle.2.circlepath", color: .orange)
            StatCard(title: L10n.Dashboard.Stats.drafts, value: "\(appState.projects.filter { $0.status == .draft }.count)", icon: "pencil.circle.fill", color: .gray)
        }
    }

    private var contentColumns: some View {
        HStack(alignment: .top, spacing: 20) {
            recentProjectsColumn
            analysisColumn
        }
    }

    private var recentProjectsColumn: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(L10n.Dashboard.Sections.recentProjects, icon: "clock.fill")
            ForEach(appState.projects) { project in
                ProjectRowCard(project: project)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var analysisColumn: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(L10n.Dashboard.Sections.folderAnalysis, icon: "chart.pie.fill")
            analysisContent
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    @ViewBuilder
    private var analysisContent: some View {
        if let analysis = appState.folderAnalysis {
            FolderAnalysisCard(analysis: analysis)
        } else {
            EmptyAnalysisCard(onSelect: { appState.selectFolder() })
        }
    }

    private func sectionHeader(_ title: String, icon: String) -> some View {
        Label(title, systemImage: icon)
            .font(.headline)
            .foregroundColor(.primary)
    }
}

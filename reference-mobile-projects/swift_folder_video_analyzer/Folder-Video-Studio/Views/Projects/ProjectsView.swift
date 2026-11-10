import SwiftUI

struct ProjectsView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var renderService = RenderService()
    @State private var showRenderSheet = false
    @State private var projectToRender: VideoProject?

    var body: some View {
        HSplitView {
            projectList
            detailOrEmpty
        }
        .sheet(isPresented: $showRenderSheet) {
            if let proj = projectToRender {
                RenderSheetView(project: proj, renderService: renderService)
                    .environmentObject(appState)
            }
        }
        .onChange(of: renderService.progress) { newValue in
            guard newValue >= 1.0,
                  let url = renderService.lastOutputURL,
                  let idx = appState.projects.firstIndex(where: { $0.id == projectToRender?.id })
            else { return }
            appState.projects[idx].status = .completed
            appState.projects[idx].outputVideoURL = url.absoluteString
            if appState.selectedProject?.id == appState.projects[idx].id {
                appState.selectedProject = appState.projects[idx]
            }
        }
    }

    // MARK: List

    private var projectList: some View {
        VStack(spacing: 0) {
            listHeader
            Divider()
            if appState.projects.isEmpty {
                emptyProjects
            } else {
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(appState.projects) { project in
                            ProjectListRow(
                                project: project,
                                isSelected: appState.selectedProject?.id == project.id
                            )
                            .onTapGesture { appState.selectedProject = project }
                            .contextMenu {
                                Button(role: .destructive) { appState.deleteProject(project) }
                                label: { Label(L10n.Projects.delete, systemImage: "trash") }
                            }
                        }
                    }
                    .padding(12)
                }
            }
        }
        .frame(minWidth: 260, maxWidth: 320)
        .background(Color(NSColor.controlBackgroundColor))
    }

    private var listHeader: some View {
        HStack {
            Text(L10n.Projects.title)
                .font(.title3.bold())
            Spacer()
            Text("\(appState.projects.count)")
                .font(.caption.bold())
                .padding(.horizontal, 8).padding(.vertical, 3)
                .background(AppTheme.accent.opacity(0.15), in: Capsule())
                .foregroundColor(AppTheme.accent)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
    }

    // MARK: Detail

    @ViewBuilder
    private var detailOrEmpty: some View {
        if let selected = appState.selectedProject,
           let idx = appState.projects.firstIndex(where: { $0.id == selected.id }) {
            ProjectDetailView(
                project: $appState.projects[idx],
                renderService: renderService,
                onRender: {
                    projectToRender = appState.projects[idx]
                    showRenderSheet = true
                }
            )
            .id(selected.id)
            .frame(minWidth: 380)
        } else {
            emptyDetail
        }
    }

    private var emptyDetail: some View {
        VStack(spacing: 16) {
            Image(systemName: "film.stack")
                .font(.system(size: 48))
                .foregroundStyle(AppTheme.accentGradient)
            Text(L10n.Projects.selectProject)
                .font(.title3.bold())
            Text(L10n.Projects.selectProjectHint)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 280)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.underPageBackgroundColor))
    }

    private var emptyProjects: some View {
        VStack(spacing: 14) {
            Image(systemName: "folder.badge.plus")
                .font(.system(size: 40))
                .foregroundStyle(AppTheme.accentGradient)
            Text(L10n.Projects.noProjects)
                .font(.headline)
            Text(L10n.Projects.noProjectsHint)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding()
    }
}

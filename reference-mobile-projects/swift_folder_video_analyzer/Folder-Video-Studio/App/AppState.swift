import SwiftUI
import Combine

final class AppState: ObservableObject {
    @Published var selectedTab: SidebarTab = .dashboard
    @Published var selectedFolderURL: URL?
    @Published var folderAnalysis: FolderAnalysis?
    @Published var projects: [VideoProject] = []
    @Published var isAnalyzing = false
    @Published var renderSettings: RenderSettings = RenderSettings()
    @Published var selectedProject: VideoProject?

    func selectFolder() {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.allowsMultipleSelection = false
        panel.message = L10n.FilePicker.selectFolder
        panel.prompt = L10n.FilePicker.choose

        if panel.runModal() == .OK, let url = panel.url {
            selectedFolderURL = url
            analyzeFolder(at: url)
        }
    }

    func analyzeFolder(at url: URL) {
        isAnalyzing = true
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            let analysis = FolderAnalyzer.analyze(url: url)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                self?.folderAnalysis = analysis
                self?.isAnalyzing = false
            }
        }
    }

    func createProject(from analysis: FolderAnalysis, template: VideoTemplate) {
        let params = TemplateParams(
            title: analysis.folderName,
            subtitle: template.description,
            accentColorHex: template.accentColor,
            backgroundColor: "dark"
        )
        let proj = VideoProject(
            name: "\(analysis.folderName) — \(template.name)",
            folderPath: selectedFolderURL?.path ?? "/",
            status: .draft,
            createdAt: Date(),
            duration: template.duration,
            template: template.name,
            thumbnailColor: template.accentColor,
            params: params
        )
        projects.insert(proj, at: 0)
        selectedProject = proj
        selectedTab = .projects
    }

    func deleteProject(_ project: VideoProject) {
        projects.removeAll { $0.id == project.id }
        if selectedProject?.id == project.id { selectedProject = nil }
    }

    func updateProject(_ project: VideoProject) {
        if let idx = projects.firstIndex(where: { $0.id == project.id }) {
            projects[idx] = project
            if selectedProject?.id == project.id {
                selectedProject = project
            }
        }
    }
}

enum SidebarTab: String, CaseIterable, Identifiable {
    case dashboard = "Dashboard"
    case projects = "Projects"
    case templates = "Templates"
    case settings = "Settings"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .dashboard: return L10n.Icons.dashboard
        case .projects: return L10n.Icons.projects
        case .templates: return L10n.Icons.templates
        case .settings: return L10n.Icons.settings
        }
    }
}

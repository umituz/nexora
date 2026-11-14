import SwiftUI

struct RenderSheetView: View {
    let project: VideoProject
    @ObservedObject var renderService: RenderService
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var showVideoPlayer = false

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    projectInfo
                    settingsSection
                    if renderService.isRendering || renderService.progress == 1.0 {
                        progressSection
                    }
                    if !renderService.renderLog.isEmpty {
                        logSection
                    }
                }
                .padding(24)
            }
            Divider()
            footer
        }
        .frame(width: 520, height: 600)
        .sheet(isPresented: $showVideoPlayer) {
            if let url = renderService.lastOutputURL,
               FileManager.default.fileExists(atPath: url.path) {
                VideoPlayerView(videoURL: url)
            }
        }
        .onChange(of: renderService.progress) { val in
            guard val >= 1.0,
                  let url = renderService.lastOutputURL,
                  let idx = appState.projects.firstIndex(where: { $0.id == project.id })
            else { return }
            appState.projects[idx].status = .completed
            appState.projects[idx].outputVideoURL = url.absoluteString
        }
    }

    // MARK: Header

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(L10n.Render.Sheet.title)
                    .font(.title3.bold())
                Text(project.name)
                    .font(.subheadline).foregroundColor(.secondary)
            }
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title3).foregroundStyle(.secondary)
            }
            .buttonStyle(.plain)
        }
        .padding(20)
    }

    // MARK: Project Info

    private var projectInfo: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(AppTheme.categoryColor(project.thumbnailColor).opacity(0.15))
                    .frame(width: 48, height: 48)
                if !project.params.logoText.isEmpty {
                    Text(project.params.logoText)
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(AppTheme.categoryColor(project.thumbnailColor))
                } else {
                    Image(systemName: "film.fill")
                        .foregroundColor(AppTheme.categoryColor(project.thumbnailColor))
                        .font(.title2)
                }
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(project.template).font(.headline)
                Text("\(appState.renderSettings.defaultResolution.label) • \(appState.renderSettings.defaultFPS.label)")
                    .font(.caption).foregroundColor(.secondary)
                HStack(spacing: 4) {
                    Image(systemName: "doc.text.fill")
                        .font(.caption2)
                    Text(project.params.title)
                        .font(.caption).foregroundColor(.secondary)
                }
            }
            Spacer()
        }
        .padding(14)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    // MARK: Settings

    private var settingsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(L10n.Render.Sheet.settings).font(.headline)
            renderRow(L10n.Render.Settings.resolution, icon: "display") {
                AnyView(
                    Picker("", selection: $appState.renderSettings.defaultResolution) {
                        ForEach(RenderSettings.Resolution.allCases, id: \.self) {
                            Text($0.label).tag($0)
                        }
                    }
                    .labelsHidden().frame(width: 180)
                )
            }
            renderRow(L10n.Render.Settings.fps, icon: "speedometer") {
                AnyView(
                    Picker("", selection: $appState.renderSettings.defaultFPS) {
                        ForEach(RenderSettings.FPS.allCases, id: \.self) {
                            Text($0.label).tag($0)
                        }
                    }
                    .labelsHidden().frame(width: 180)
                )
            }
            renderRow(L10n.Render.Settings.quality, icon: "dial.high.fill") {
                AnyView(
                    Picker("", selection: $appState.renderSettings.defaultQuality) {
                        ForEach(RenderSettings.Quality.allCases, id: \.self) {
                            Text($0.rawValue).tag($0)
                        }
                    }
                    .labelsHidden().frame(width: 180)
                )
            }
            renderRow(L10n.Render.Settings.codec, icon: "film.stack") {
                AnyView(
                    Picker("", selection: $appState.renderSettings.codec) {
                        ForEach(RenderSettings.Codec.allCases, id: \.self) {
                            Text($0.rawValue).tag($0)
                        }
                    }
                    .labelsHidden().frame(width: 180)
                )
            }
        }
        .padding(16)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    private func renderRow(_ label: String, icon: String, content: () -> AnyView) -> some View {
        HStack {
            Image(systemName: icon).foregroundStyle(AppTheme.accentGradient).frame(width: 20)
            Text(label).font(.system(size: 13))
            Spacer()
            content()
        }
    }

    // MARK: Progress

    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(L10n.Render.Sheet.progress).font(.headline)
                Spacer()
                if renderService.progress >= 1.0 {
                    Label(L10n.Render.Sheet.completed, systemImage: "checkmark.circle.fill")
                        .font(.caption.bold())
                        .foregroundColor(.green)
                } else {
                    Text(L10n.Render.Sheet.processing)
                        .font(.caption.bold())
                        .foregroundColor(AppTheme.accent)
                }
            }
            ProgressView(value: renderService.progress)
                .tint(renderService.progress >= 1.0 ? .green : AppTheme.accent)
            HStack {
                Text("Frame \(renderService.currentFrame) / \(renderService.totalFrames)")
                    .font(.caption).foregroundColor(.secondary)
                Spacer()
                if let error = renderService.renderError {
                    Text(error.errorDescription ?? "Unknown error").font(.caption).foregroundColor(.red).lineLimit(2)
                }
            }
        }
        .padding(16)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    // MARK: Log

    private var logSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(L10n.Render.Sheet.log).font(.headline)
            ScrollView {
                VStack(alignment: .leading, spacing: 3) {
                    ForEach(renderService.renderLog.suffix(50), id: \.self) { line in
                        Text(line)
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundColor(.secondary)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .frame(maxHeight: 120)
            .padding(10)
            .background(Color.black.opacity(0.06), in: RoundedRectangle(cornerRadius: 8))
        }
    }

    // MARK: Footer

    private var footer: some View {
        HStack(spacing: 12) {
            if renderService.isRendering {
                Button(L10n.Render.cancel) { renderService.cancelRender() }
                    .buttonStyle(.bordered)
                    .foregroundColor(.red)
            }
            Spacer()
            if renderService.progress >= 1.0, let url = renderService.lastOutputURL {
                Button(L10n.Render.showInFinder) {
                    NSWorkspace.shared.activateFileViewerSelecting([url])
                }
                .buttonStyle(.bordered)

                if FileManager.default.fileExists(atPath: url.path) {
                    Button {
                        showVideoPlayer = true
                    } label: {
                        Label(L10n.Render.play, systemImage: "play.fill")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)
                }
            } else {
                Button(renderService.isRendering ? L10n.Render.starting : L10n.Render.start) {
                    if !renderService.isRendering {
                        renderService.startRender(project: project, settings: appState.renderSettings)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(AppTheme.accent)
                .disabled(renderService.isRendering)
            }
        }
        .padding(20)
    }
}

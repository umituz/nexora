import SwiftUI

struct ProjectDetailView: View {
    @Binding var project: VideoProject
    @ObservedObject var renderService: RenderService
    let onRender: () -> Void

    @State private var showEditor = false
    @State private var showVideoPlayer = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                heroSection
                infoGrid
                paramsPreview
                if renderService.isRendering || renderService.progress == 1.0 {
                    renderProgressSection
                }
                logSection
            }
            .padding(24)
        }
        .background(Color(NSColor.underPageBackgroundColor))
        .sheet(isPresented: $showEditor) {
            ProjectEditorView(project: $project)
        }
        .sheet(isPresented: $showVideoPlayer) {
            if let urlStr = project.outputVideoURL, let url = URL(string: urlStr) {
                VideoPlayerView(videoURL: url)
            }
        }
    }

    // MARK: Hero

    private var heroSection: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: 16)
                .fill(AppTheme.categoryColor(project.thumbnailColor).opacity(0.12))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(AppTheme.categoryColor(project.thumbnailColor).opacity(0.25), lineWidth: 1)
                )
                .frame(height: 160)

            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(AppTheme.categoryColor(project.thumbnailColor).opacity(0.2))
                        .frame(width: 56, height: 56)
                    if !project.params.logoText.isEmpty {
                        Text(project.params.logoText)
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundColor(AppTheme.categoryColor(project.thumbnailColor))
                    } else {
                        Image(systemName: "play.circle.fill")
                            .font(.system(size: 32))
                            .foregroundColor(AppTheme.categoryColor(project.thumbnailColor))
                    }
                }

                VStack(alignment: .leading, spacing: 5) {
                    Text(project.name)
                        .font(.title3.bold())
                        .lineLimit(2)
                    Text(project.template + " • " + project.duration)
                        .font(.subheadline).foregroundColor(.secondary)
                    statusPill
                }

                Spacer()
                actionButtons
            }
            .padding(20)
        }
    }

    private var statusPill: some View {
        HStack(spacing: 5) {
            Image(systemName: project.status.icon)
            Text(project.status.rawValue)
        }
        .font(.caption.bold())
        .padding(.horizontal, 10).padding(.vertical, 4)
        .background(AppTheme.categoryColor(project.status.color).opacity(0.15), in: Capsule())
        .foregroundColor(AppTheme.categoryColor(project.status.color))
    }

    private var actionButtons: some View {
        VStack(spacing: 8) {
            Button(action: onRender) {
                Label(renderService.isRendering ? L10n.Projects.Detail.Hero.rendering : L10n.Projects.Detail.Hero.render,
                      systemImage: renderService.isRendering ? "arrow.triangle.2.circlepath" : "film.fill")
                    .font(.system(size: 12, weight: .semibold))
            }
            .buttonStyle(.borderedProminent)
            .tint(AppTheme.accent)
            .disabled(renderService.isRendering)

            HStack(spacing: 6) {
                Button {
                    showEditor = true
                } label: {
                    Label(L10n.Projects.Detail.Hero.edit, systemImage: "pencil")
                        .font(.system(size: 12))
                }
                .buttonStyle(.bordered)

                if project.status == .completed, let urlStr = project.outputVideoURL,
                   let url = URL(string: urlStr),
                   FileManager.default.fileExists(atPath: url.path) {
                    Button {
                        showVideoPlayer = true
                    } label: {
                        Label(L10n.Projects.Detail.Hero.play, systemImage: "play.fill")
                            .font(.system(size: 12))
                    }
                    .buttonStyle(.bordered)
                    .tint(.green)
                }
            }
        }
    }

    // MARK: Info Grid

    private var infoGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            DetailInfoCell(
                label: L10n.Projects.Detail.Info.folder,
                value: URL(fileURLWithPath: project.folderPath).lastPathComponent,
                icon: "folder.fill"
            )
            DetailInfoCell(
                label: L10n.Projects.Detail.Info.created,
                value: project.createdAt.formatted(date: .abbreviated, time: .shortened),
                icon: "calendar"
            )
            DetailInfoCell(label: L10n.Projects.Detail.Info.duration, value: project.duration, icon: "clock.fill")
            DetailInfoCell(label: L10n.Projects.Detail.Info.template, value: project.template, icon: "rectangle.stack.fill")
        }
    }

    // MARK: Params Preview

    private var paramsPreview: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(L10n.Projects.Detail.Params.title)
                    .font(.headline)
                Spacer()
                Button {
                    showEditor = true
                } label: {
                    Label(L10n.Projects.Detail.Params.edit, systemImage: "pencil.circle")
                        .font(.caption)
                }
                .buttonStyle(.plain)
                .foregroundColor(AppTheme.accent)
            }

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                paramChip(L10n.Projects.Detail.Params.titleLabel, value: project.params.title, icon: "text.alignleft")
                paramChip(L10n.Projects.Detail.Params.subtitleLabel, value: project.params.subtitle.isEmpty ? L10n.Projects.Detail.Params.empty : project.params.subtitle, icon: "text.alignright")
                paramChip(L10n.Projects.Detail.Params.animation, value: project.params.animationStyle.rawValue, icon: "wand.and.stars")
                paramChip(L10n.Projects.Detail.Params.font, value: project.params.fontStyle.rawValue, icon: "textformat")
                paramChip(L10n.Projects.Detail.Params.background, value: bgLabel(project.params.backgroundColor), icon: "rectangle.fill")
                paramChip(L10n.Projects.Detail.Params.accent, value: project.params.accentColorHex, icon: "paintpalette.fill")
            }
        }
        .padding(16)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    private func paramChip(_ label: String, value: String, icon: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption2)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 14)
            VStack(alignment: .leading, spacing: 1) {
                Text(label)
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.system(size: 12, weight: .medium))
                    .lineLimit(1)
            }
        }
        .padding(.horizontal, 10).padding(.vertical, 7)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(NSColor.underPageBackgroundColor), in: RoundedRectangle(cornerRadius: 8))
    }

    private func bgLabel(_ val: String) -> String {
        switch val {
        case "dark": return L10n.Projects.Detail.Params.Background.dark
        case "light": return L10n.Projects.Detail.Params.Background.light
        case "gradient": return L10n.Projects.Detail.Params.Background.gradient
        case "glass": return L10n.Projects.Detail.Params.Background.glass
        default: return val
        }
    }

    // MARK: Render Progress

    private var renderProgressSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(L10n.Projects.Detail.Render.progress)
                    .font(.headline)
                Spacer()
                Text("\(Int(renderService.progress * 100))%")
                    .font(.system(.body, design: .monospaced).bold())
                    .foregroundColor(AppTheme.accent)
            }
            ProgressView(value: renderService.progress)
                .tint(renderService.progress >= 1.0 ? .green : AppTheme.accent)
                .scaleEffect(x: 1, y: 1.5)
            HStack {
                Text(L10n.Projects.Detail.Render.frameProgress(renderService.currentFrame, renderService.totalFrames))
                    .font(.caption).foregroundColor(.secondary)
                Spacer()
                if renderService.progress >= 1.0, let url = renderService.lastOutputURL {
                    Button(L10n.Projects.Detail.Render.openInFinder) {
                        NSWorkspace.shared.activateFileViewerSelecting([url])
                    }
                    .font(.caption.bold())
                    .foregroundColor(AppTheme.accent)
                    .buttonStyle(.plain)

                    if FileManager.default.fileExists(atPath: url.path) {
                        Button(L10n.Projects.Detail.Hero.play) {
                            showVideoPlayer = true
                        }
                        .font(.caption.bold())
                        .foregroundColor(.green)
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .padding(16)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    // MARK: Log

    private var logSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !renderService.renderLog.isEmpty {
                Text(L10n.Projects.Detail.Render.log)
                    .font(.headline)
                ScrollView {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(renderService.renderLog, id: \.self) { line in
                            Text(line)
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.secondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(maxHeight: 160)
                .padding(12)
                .background(Color.black.opacity(0.05), in: RoundedRectangle(cornerRadius: 10))
            }
        }
    }
}

// MARK: - Detail Info Cell

struct DetailInfoCell: View {
    let label: String
    let value: String
    let icon: String

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 20)
            VStack(alignment: .leading, spacing: 2) {
                Text(label).font(.caption).foregroundColor(.secondary)
                Text(value).font(.system(size: 13, weight: .medium)).lineLimit(1)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10))
    }
}

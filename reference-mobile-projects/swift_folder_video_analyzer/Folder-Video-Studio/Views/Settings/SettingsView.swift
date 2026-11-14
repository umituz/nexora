import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedSection: SettingsSection = .remotion

    enum SettingsSection: String, CaseIterable {
        case remotion = "Remotion"
        case output = "Output"
        case render = "Render"
        case about = "About"

        var icon: String {
            switch self {
            case .remotion: return "terminal.fill"
            case .output: return "folder.fill"
            case .render: return "cpu.fill"
            case .about: return "info.circle.fill"
            }
        }
    }

    var body: some View {
        HSplitView {
            sectionList
            sectionContent
        }
        .background(Color(NSColor.underPageBackgroundColor))
    }

    private var sectionList: some View {
        VStack(spacing: 4) {
            Text(L10n.Settings.title)
                .font(.title3.bold())
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 16).padding(.top, 16).padding(.bottom, 8)
            Divider()
            ForEach(SettingsSection.allCases, id: \.self) { sec in
                SectionRow(section: sec, isSelected: selectedSection == sec)
                    .onTapGesture { selectedSection = sec }
            }
            Spacer()
        }
        .frame(minWidth: 200, maxWidth: 220)
        .background(Color(NSColor.controlBackgroundColor))
    }

    @ViewBuilder
    private var sectionContent: some View {
        switch selectedSection {
        case .remotion: RemotionSettingsSection()
        case .output: OutputSettingsSection()
        case .render: RenderSettingsSection()
        case .about: AboutSection()
        }
    }
}

struct SectionRow: View {
    let section: SettingsView.SettingsSection
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: section.icon)
                .foregroundColor(isSelected ? AppTheme.accent : Color.secondary)
                .frame(width: 20)
            Text(section.rawValue)
                .font(.system(size: 13, weight: isSelected ? .semibold : .regular))
            Spacer()
        }
        .padding(.horizontal, 16).padding(.vertical, 10)
        .background(isSelected ? AppTheme.accent.opacity(0.1) : Color.clear, in: RoundedRectangle(cornerRadius: 8))
        .padding(.horizontal, 6)
        .contentShape(Rectangle())
    }
}

struct RemotionSettingsSection: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                sectionTitle(L10n.Settings.Remotion.title, icon: "terminal.fill")
                SettingsCard {
                    SettingsRow(label: L10n.Settings.Remotion.cliPath, icon: "terminal") {
                        TextField(AppConstants.Paths.defaultRemotionCLI, text: $appState.renderSettings.remotionPath)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 280)
                    }
                }
                statusCard
                SettingsCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(L10n.Settings.Remotion.installGuide)
                            .font(.system(size: 13, weight: .semibold))
                        Text(L10n.Settings.Remotion.installHint)
                            .font(.caption).foregroundColor(.secondary)
                        Text("npm install -g @remotion/cli")
                            .font(.system(size: 12, design: .monospaced))
                            .padding(10)
                            .background(Color.black.opacity(0.07), in: RoundedRectangle(cornerRadius: 8))
                    }
                }
            }
            .padding(28)
        }
    }

    private var statusCard: some View {
        SettingsCard {
            HStack(spacing: 12) {
                Circle()
                    .fill(Color.green)
                    .frame(width: 10, height: 10)
                    .shadow(color: .green.opacity(0.6), radius: 4)
                VStack(alignment: .leading, spacing: 2) {
                    Text(L10n.Settings.Remotion.statusReady).font(.system(size: 13, weight: .semibold))
                    Text("\(AppConstants.ThirdPartyVersions.remotion) — \(AppConstants.ThirdPartyVersions.nodeJS)").font(.caption).foregroundColor(.secondary)
                }
                Spacer()
                Button(L10n.Settings.Remotion.verifyPath) {}
                    .buttonStyle(.bordered)
                    .font(.caption)
            }
        }
    }
}

struct OutputSettingsSection: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                sectionTitle(L10n.Settings.Output.title, icon: "folder.fill")
                SettingsCard {
                    VStack(spacing: 14) {
                        SettingsRow(label: L10n.Settings.Output.folder, icon: "folder") {
                            HStack {
                                Text(appState.renderSettings.outputDirectory)
                                    .font(.system(size: 12))
                                    .foregroundColor(.secondary)
                                    .lineLimit(1)
                                    .truncationMode(.middle)
                                    .frame(maxWidth: 200, alignment: .leading)
                                Button(L10n.Settings.Output.change) { chooseOutputDir() }
                                    .buttonStyle(.bordered)
                                    .font(.caption)
                            }
                        }
                        Divider()
                        SettingsRow(label: L10n.Settings.Output.openAfterRender, icon: "eye.fill") {
                            Toggle("", isOn: $appState.renderSettings.openAfterRender)
                                .labelsHidden()
                        }
                        Divider()
                        SettingsRow(label: L10n.Settings.Output.concurrentRenders, icon: "slider.horizontal.3") {
                            Stepper("\(appState.renderSettings.concurrentRenders)",
                                    value: $appState.renderSettings.concurrentRenders,
                                    in: AppConstants.RenderDefaults.minConcurrentRenders...AppConstants.RenderDefaults.maxConcurrentRenders)
                        }
                    }
                }
            }
            .padding(28)
        }
    }

    private func chooseOutputDir() {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        if panel.runModal() == .OK, let url = panel.url {
            appState.renderSettings.outputDirectory = url.path
        }
    }
}

struct RenderSettingsSection: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                sectionTitle(L10n.Settings.Render.title, icon: "cpu.fill")
                SettingsCard {
                    VStack(spacing: 14) {
                        SettingsRow(label: L10n.Settings.Render.defaultResolution, icon: "display") {
                            Picker("", selection: $appState.renderSettings.defaultResolution) {
                                ForEach(RenderSettings.Resolution.allCases, id: \.self) {
                                    Text($0.label).tag($0)
                                }
                            }
                            .labelsHidden().frame(width: 200)
                        }
                        Divider()
                        SettingsRow(label: L10n.Settings.Render.defaultFps, icon: "speedometer") {
                            Picker("", selection: $appState.renderSettings.defaultFPS) {
                                ForEach(RenderSettings.FPS.allCases, id: \.self) {
                                    Text($0.label).tag($0)
                                }
                            }
                            .labelsHidden().frame(width: 200)
                        }
                        Divider()
                        SettingsRow(label: L10n.Render.Settings.quality, icon: "dial.high.fill") {
                            Picker("", selection: $appState.renderSettings.defaultQuality) {
                                ForEach(RenderSettings.Quality.allCases, id: \.self) {
                                    Text($0.rawValue).tag($0)
                                }
                            }
                            .labelsHidden().frame(width: 200)
                        }
                        Divider()
                        SettingsRow(label: L10n.Render.Settings.codec, icon: "film.stack") {
                            Picker("", selection: $appState.renderSettings.codec) {
                                ForEach(RenderSettings.Codec.allCases, id: \.self) {
                                    Text($0.rawValue).tag($0)
                                }
                            }
                            .labelsHidden().frame(width: 200)
                        }
                    }
                }
            }
            .padding(28)
        }
    }
}

struct AboutSection: View {
    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "film.stack.fill")
                .font(.system(size: 56))
                .foregroundStyle(AppTheme.accentGradient)
            Text(L10n.Settings.About.title)
                .font(.largeTitle.bold())
            Text(L10n.App.version)
                .font(.subheadline)
                .foregroundColor(.secondary)
            Text(L10n.Settings.About.description)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Helpers

private func sectionTitle(_ text: String, icon: String) -> some View {
    HStack(spacing: 8) {
        Image(systemName: icon)
            .foregroundStyle(AppTheme.accentGradient)
        Text(text).font(.title3.bold())
    }
}

struct SettingsCard<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }

    var body: some View {
        content
            .padding(16)
            .frame(maxWidth: .infinity)
            .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }
}

struct SettingsRow<Content: View>: View {
    let label: String
    let icon: String
    let trailing: Content
    init(label: String, icon: String, @ViewBuilder trailing: () -> Content) {
        self.label = label; self.icon = icon; self.trailing = trailing()
    }

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 20)
            Text(label).font(.system(size: 13))
            Spacer()
            trailing
        }
    }
}

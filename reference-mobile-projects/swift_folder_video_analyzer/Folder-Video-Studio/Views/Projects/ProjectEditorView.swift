import SwiftUI

struct ProjectEditorView: View {
    @Binding var project: VideoProject
    @Environment(\.dismiss) private var dismiss
    @State private var params: TemplateParams
    @State private var projectName: String

    init(project: Binding<VideoProject>) {
        self._project = project
        self._params = State(initialValue: project.wrappedValue.params)
        self._projectName = State(initialValue: project.wrappedValue.name)
    }

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            HSplitView {
                formPanel
                previewPanel
            }
            Divider()
            footer
        }
        .frame(width: 780, height: 580)
    }

    // MARK: Header

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Edit Project")
                    .font(.title3.bold())
                Text(project.template)
                    .font(.caption).foregroundColor(.secondary)
            }
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title3).foregroundStyle(.secondary)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 20).padding(.vertical, 14)
    }

    // MARK: Form

    private var formPanel: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                editorSection("General") { generalFields }
                editorSection("Content") { contentFields }
                editorSection("Appearance") { appearanceFields }
                editorSection("Animation") { animationFields }
            }
            .padding(20)
        }
        .frame(minWidth: 320, maxWidth: 360)
        .background(Color(NSColor.controlBackgroundColor))
    }

    private var generalFields: some View {
        VStack(spacing: 12) {
            fieldRow("Project Name", icon: "pencil") {
                TextField("Project name", text: $projectName)
                    .textFieldStyle(.roundedBorder)
            }
            fieldRow("Title", icon: "text.alignleft") {
                TextField("Video title", text: $params.title)
                    .textFieldStyle(.roundedBorder)
            }
            fieldRow("Subtitle", icon: "text.alignright") {
                TextField("Subtitle or slogan", text: $params.subtitle)
                    .textFieldStyle(.roundedBorder)
            }
            fieldRow("Logo Text", icon: "square.text.square") {
                TextField("e.g.: AB", text: $params.logoText)
                    .textFieldStyle(.roundedBorder)
            }
        }
    }

    private var contentFields: some View {
        VStack(spacing: 12) {
            Toggle(isOn: $params.showFileCount) {
                Label("Show File Count", systemImage: "doc.fill")
                    .font(.system(size: 13))
            }
            .toggleStyle(.switch)
            Toggle(isOn: $params.showFolderTree) {
                Label("Show Folder Tree", systemImage: "folder.fill")
                    .font(.system(size: 13))
            }
            .toggleStyle(.switch)
        }
    }

    private var appearanceFields: some View {
        VStack(spacing: 12) {
            fieldRow("Background", icon: "rectangle.fill") {
                Picker("", selection: $params.backgroundColor) {
                    Text("Dark").tag("dark")
                    Text("Light").tag("light")
                    Text("Gradient").tag("gradient")
                    Text("Glass Effect").tag("glass")
                }
                .labelsHidden()
                .frame(width: 140)
            }
            fieldRow("Font Style", icon: "textformat") {
                Picker("", selection: $params.fontStyle) {
                    ForEach(TemplateParams.FontStyle.allCases, id: \.self) {
                        Text($0.rawValue).tag($0)
                    }
                }
                .labelsHidden()
                .frame(width: 140)
            }
            accentColorRow
        }
    }

    private var accentColorRow: some View {
        HStack(spacing: 10) {
            Image(systemName: "paintpalette.fill")
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 20)
            Text("Accent Color")
                .font(.system(size: 13))
            Spacer()
            HStack(spacing: 8) {
                ForEach(accentPresets, id: \.self) { hex in
                    Circle()
                        .fill(Color(hex: hex) ?? AppTheme.accent)
                        .frame(width: 22, height: 22)
                        .overlay(
                            Circle().stroke(Color.primary.opacity(params.accentColorHex == hex ? 0.8 : 0), lineWidth: 2)
                        )
                        .scaleEffect(params.accentColorHex == hex ? 1.15 : 1.0)
                        .animation(.spring(duration: 0.2), value: params.accentColorHex)
                        .onTapGesture { params.accentColorHex = hex }
                }
            }
        }
    }

    private var animationFields: some View {
        VStack(spacing: 12) {
            fieldRow("Animation", icon: "wand.and.stars") {
                Picker("", selection: $params.animationStyle) {
                    ForEach(TemplateParams.AnimationStyle.allCases, id: \.self) {
                        Text($0.rawValue).tag($0)
                    }
                }
                .labelsHidden()
                .frame(width: 140)
            }
        }
    }

    // MARK: Preview Panel

    private var previewPanel: some View {
        VStack(spacing: 0) {
            Text("Preview")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.secondary)
                .padding(.top, 16)

            Spacer()

            ZStack {
                // Background
                previewBackground
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                // Content overlay
                VStack(spacing: 10) {
                    if !params.logoText.isEmpty {
                        Text(params.logoText)
                            .font(.system(size: 20, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background((Color(hex: params.accentColorHex) ?? AppTheme.accent).opacity(0.9), in: RoundedRectangle(cornerRadius: 10))
                    }
                    Text(params.title.isEmpty ? "Title" : params.title)
                        .font(.system(size: previewFontSize, weight: previewFontWeight, design: .default))
                        .foregroundColor(previewTextColor)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                    if !params.subtitle.isEmpty {
                        Text(params.subtitle)
                            .font(.system(size: 11))
                            .foregroundColor(previewTextColor.opacity(0.7))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                    }
                    if params.showFileCount {
                        HStack(spacing: 4) {
                            Image(systemName: "doc.fill")
                                .font(.caption2)
                            Text("128 files")
                                .font(.caption2)
                        }
                        .foregroundColor(Color(hex: params.accentColorHex) ?? AppTheme.accent)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background((Color(hex: params.accentColorHex) ?? AppTheme.accent).opacity(0.15), in: Capsule())
                    }
                }
                .padding(16)
            }
            .frame(width: 300, height: 168)
            .shadow(color: .black.opacity(0.2), radius: 20, y: 8)

            Spacer()
            Text("16:9 — \(project.template)")
                .font(.caption2)
                .foregroundColor(.secondary)
                .padding(.bottom, 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.underPageBackgroundColor))
    }

    @ViewBuilder
    private var previewBackground: some View {
        switch params.backgroundColor {
        case "light":
            Color.white
        case "gradient":
            LinearGradient(
                colors: [
                    (Color(hex: params.accentColorHex) ?? AppTheme.accent).opacity(0.8),
                    (Color(hex: params.accentColorHex) ?? AppTheme.accent).opacity(0.3)
                ],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
        case "glass":
            ZStack {
                Color.black.opacity(0.7)
                LinearGradient(
                    colors: [Color.white.opacity(0.1), Color.white.opacity(0.03)],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                )
            }
        default: // dark
            Color.black.opacity(0.9)
        }
    }

    private var previewTextColor: Color {
        params.backgroundColor == "light" ? .black : .white
    }

    private var previewFontSize: CGFloat {
        switch params.fontStyle {
        case .bold: return 20
        case .light: return 16
        default: return 18
        }
    }

    private var previewFontWeight: Font.Weight {
        switch params.fontStyle {
        case .bold: return .heavy
        case .light: return .light
        case .classic: return .regular
        default: return .semibold
        }
    }

    // MARK: Footer

    private var footer: some View {
        HStack {
            Button("Cancel") { dismiss() }
                .buttonStyle(.bordered)
            Spacer()
            Button("Save") {
                project.name = projectName
                project.params = params
                dismiss()
            }
            .buttonStyle(.borderedProminent)
            .tint(AppTheme.accent)
        }
        .padding(.horizontal, 20).padding(.vertical, 14)
    }

    // MARK: Helpers

    private let accentPresets = [
        "#5B72FF", "#9B72FF", "#FF6B9D", "#FF8C42", "#2ED573", "#00D2FF"
    ]

    private func editorSection<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)
                .kerning(0.5)
            content()
                .padding(14)
                .background(Color(NSColor.underPageBackgroundColor), in: RoundedRectangle(cornerRadius: 10))
        }
    }

    private func fieldRow<Content: View>(_ label: String, icon: String, @ViewBuilder content: () -> Content) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 18)
            Text(label)
                .font(.system(size: 13))
                .frame(width: 90, alignment: .leading)
            Spacer()
            content()
        }
    }
}

// MARK: - Color from hex

extension Color {
    init?(hex: String) {
        var h = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if h.hasPrefix("#") { h.removeFirst() }
        guard h.count == 6, let val = UInt64(h, radix: 16) else { return nil }
        self.init(
            red: Double((val >> 16) & 0xFF) / 255,
            green: Double((val >> 8) & 0xFF) / 255,
            blue: Double(val & 0xFF) / 255
        )
    }
}

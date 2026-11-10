import SwiftUI

struct FolderAnalysisCard: View {
    let analysis: FolderAnalysis
    @EnvironmentObject var appState: AppState
    @State private var showTemplates = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            summaryRow
            Divider()
            breakdownSection
            Divider()
            extensionsSection
            generateButton
        }
        .padding(18)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 14))
        .sheet(isPresented: $showTemplates) {
            QuickTemplatePickerSheet(analysis: analysis)
                .environmentObject(appState)
        }
    }

    private var summaryRow: some View {
        HStack(spacing: 20) {
            analysisStat(value: "\(analysis.totalFiles)", label: L10n.FolderAnalysis.Stats.files)
            analysisStat(value: analysis.totalSize, label: L10n.FolderAnalysis.Stats.size)
            analysisStat(value: "\(analysis.folderDepth)", label: L10n.FolderAnalysis.Stats.depth)
        }
    }

    private func analysisStat(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value).font(.system(.title3, design: .rounded).bold())
            Text(label).font(.caption2).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var breakdownSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(L10n.FolderAnalysis.Sections.fileTypes)
                .font(.caption.weight(.semibold)).foregroundColor(.secondary)
            ForEach(analysis.fileBreakdown.filter { $0.count > 0 }) { cat in
                HStack(spacing: 8) {
                    Image(systemName: cat.icon)
                        .font(.caption)
                        .foregroundColor(AppTheme.categoryColor(cat.color))
                        .frame(width: 18)
                    Text(cat.name).font(.caption)
                    Spacer()
                    Text("\(cat.count)").font(.caption.monospacedDigit()).foregroundColor(.secondary)
                }
            }
        }
    }

    private var extensionsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(L10n.FolderAnalysis.Sections.topExtensions)
                .font(.caption.weight(.semibold)).foregroundColor(.secondary)
            ForEach(analysis.topExtensions) { ext in
                HStack(spacing: 8) {
                    Text(ext.ext).font(.caption.monospaced()).frame(width: 50, alignment: .leading)
                    GeometryReader { geo in
                        RoundedRectangle(cornerRadius: 3)
                            .fill(AppTheme.accentGradient)
                            .frame(width: geo.size.width * ext.percentage)
                    }
                    .frame(height: 8)
                    Text("\(ext.count)").font(.caption2.monospacedDigit()).foregroundColor(.secondary).frame(width: 30, alignment: .trailing)
                }
            }
        }
    }

    private var generateButton: some View {
        Button(action: { showTemplates = true }) {
            Label(L10n.FolderAnalysis.Actions.selectTemplate, systemImage: "wand.and.stars")
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
        }
        .buttonStyle(.borderedProminent)
        .tint(AppTheme.accent)
        .controlSize(.large)
    }
}

struct QuickTemplatePickerSheet: View {
    let analysis: FolderAnalysis
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            ScrollView {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                    ForEach(VideoTemplate.all) { tmpl in
                        QuickTemplateCard(template: tmpl) {
                            appState.createProject(from: analysis, template: tmpl)
                            dismiss()
                        }
                    }
                }
                .padding(20)
            }
        }
        .frame(width: 580, height: 500)
    }

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(L10n.FolderAnalysis.TemplatePicker.title).font(.title3.bold())
                Text(L10n.FolderAnalysis.TemplatePicker.subtitleForFolder(analysis.folderName))
                    .font(.subheadline).foregroundColor(.secondary)
            }
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark.circle.fill").font(.title3).foregroundStyle(.secondary)
            }
            .buttonStyle(.plain)
        }
        .padding(20)
    }
}

struct QuickTemplateCard: View {
    let template: VideoTemplate
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            VStack(spacing: 10) {
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(AppTheme.categoryColor(template.accentColor).opacity(0.15))
                        .frame(height: 70)
                    Image(systemName: template.icon)
                        .font(.system(size: 28))
                        .foregroundColor(AppTheme.categoryColor(template.accentColor))
                }
                VStack(spacing: 3) {
                    Text(template.name).font(.system(size: 13, weight: .semibold))
                    Text(template.duration + " • " + template.resolution)
                        .font(.caption).foregroundColor(.secondary)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity)
            .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }
}

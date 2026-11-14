import SwiftUI

struct TemplatesView: View {
    @EnvironmentObject var appState: AppState
    @State private var selectedCategory: VideoTemplate.Category? = nil
    @State private var selectedTemplate: VideoTemplate? = nil
    @State private var showCreateAlert = false

    private var filtered: [VideoTemplate] {
        guard let cat = selectedCategory else { return VideoTemplate.all }
        return VideoTemplate.all.filter { $0.category == cat }
    }

    var body: some View {
        HSplitView {
            VStack(spacing: 0) {
                templateHeader
                Divider()
                categoryFilter
                Divider()
                templateGrid
            }
            .frame(minWidth: 500)

            if let tmpl = selectedTemplate {
                TemplateDetailPanel(template: tmpl, onUse: {
                    if appState.folderAnalysis != nil {
                        appState.createProject(from: appState.folderAnalysis!, template: tmpl)
                    } else {
                        showCreateAlert = true
                    }
                })
                .frame(minWidth: 300, maxWidth: 340)
            }
        }
        .alert("No Folder Selected", isPresented: $showCreateAlert) {
            Button("Select Folder") { appState.selectFolder() }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Analyze a folder from Dashboard first to use this template.")
        }
        .background(Color(NSColor.underPageBackgroundColor))
    }

    private var templateHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Templates")
                    .font(.title3.bold())
                Text("\(VideoTemplate.all.count) templates available")
                    .font(.caption).foregroundColor(.secondary)
            }
            Spacer()
        }
        .padding(.horizontal, 20).padding(.vertical, 14)
    }

    private var categoryFilter: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                CategoryChip(label: "All", isSelected: selectedCategory == nil) {
                    selectedCategory = nil
                }
                ForEach(VideoTemplate.Category.allCases, id: \.self) { cat in
                    CategoryChip(label: cat.rawValue, isSelected: selectedCategory == cat) {
                        selectedCategory = selectedCategory == cat ? nil : cat
                    }
                }
            }
            .padding(.horizontal, 20).padding(.vertical, 10)
        }
    }

    private var templateGrid: some View {
        ScrollView {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 220), spacing: 16)], spacing: 16) {
                ForEach(filtered) { tmpl in
                    TemplateCard(template: tmpl, isSelected: selectedTemplate?.id == tmpl.id)
                        .onTapGesture { selectedTemplate = tmpl }
                }
            }
            .padding(20)
        }
    }
}

struct CategoryChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 12, weight: isSelected ? .bold : .regular))
                .padding(.horizontal, 14).padding(.vertical, 6)
                .background(isSelected ? AppTheme.accent : Color(NSColor.controlBackgroundColor), in: Capsule())
                .foregroundColor(isSelected ? .white : .primary)
        }
        .buttonStyle(.plain)
    }
}

struct TemplateCard: View {
    let template: VideoTemplate
    let isSelected: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(AppTheme.categoryColor(template.accentColor).opacity(0.15))
                    .frame(height: 100)
                VStack(spacing: 8) {
                    Image(systemName: template.icon)
                        .font(.system(size: 30))
                        .foregroundColor(AppTheme.categoryColor(template.accentColor))
                    Text(template.resolution)
                        .font(.system(size: 10, design: .monospaced))
                        .foregroundColor(.secondary)
                }
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(template.name)
                    .font(.system(size: 14, weight: .semibold))
                Text(template.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            HStack(spacing: 6) {
                ForEach(template.tags.prefix(2), id: \.self) { tag in
                    Text(tag)
                        .font(.system(size: 10, weight: .medium))
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(AppTheme.categoryColor(template.accentColor).opacity(0.12), in: Capsule())
                        .foregroundColor(AppTheme.categoryColor(template.accentColor))
                }
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color(NSColor.controlBackgroundColor))
                .shadow(color: .black.opacity(0.06), radius: 6, y: 2)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(isSelected ? AppTheme.accent : Color.clear, lineWidth: 2)
                )
        )
        .contentShape(Rectangle())
    }
}

struct TemplateDetailPanel: View {
    let template: VideoTemplate
    let onUse: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            heroArea
            Divider()
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    detailRows
                    tagsSection
                }
                .padding(20)
            }
            Divider()
            useButton
        }
        .background(Color(NSColor.controlBackgroundColor))
    }

    private var heroArea: some View {
        ZStack {
            AppTheme.categoryColor(template.accentColor).opacity(0.12)
            VStack(spacing: 10) {
                Image(systemName: template.icon)
                    .font(.system(size: 44))
                    .foregroundColor(AppTheme.categoryColor(template.accentColor))
                Text(template.name)
                    .font(.title3.bold())
                Text(template.category.rawValue)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .frame(height: 140)
    }

    private var detailRows: some View {
        VStack(spacing: 10) {
            infoRow("Resolution", value: template.resolution, icon: "display")
            infoRow("Duration", value: template.duration, icon: "clock.fill")
            infoRow("Category", value: template.category.rawValue, icon: "tag.fill")
        }
    }

    private func infoRow(_ label: String, value: String, icon: String) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 18)
            Text(label).font(.system(size: 13)).foregroundColor(.secondary)
            Spacer()
            Text(value).font(.system(size: 13, weight: .medium))
        }
    }

    private var tagsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Tags").font(.caption.bold()).foregroundColor(.secondary)
            HStack(spacing: 6) {
                ForEach(template.tags, id: \.self) { tag in
                    Text(tag)
                        .font(.caption)
                        .padding(.horizontal, 10).padding(.vertical, 4)
                        .background(AppTheme.categoryColor(template.accentColor).opacity(0.12), in: Capsule())
                        .foregroundColor(AppTheme.categoryColor(template.accentColor))
                }
            }
        }
    }

    private var useButton: some View {
        Button(action: onUse) {
            Label("Use This Template", systemImage: "plus.circle.fill")
                .font(.system(size: 14, weight: .semibold))
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .tint(AppTheme.categoryColor(template.accentColor))
        .padding(16)
    }
}

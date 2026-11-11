import SwiftUI

struct ProjectsView: View {
    @State private var selectedFilter: ProjectStatus? = nil
    @State private var searchText = ""

    private var filtered: [Project] {
        let base = ProjectSampleData.projects
        let byStatus = selectedFilter == nil ? base : base.filter { $0.status == selectedFilter }
        if searchText.isEmpty { return byStatus }
        return byStatus.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    statsRow
                    filterBar
                    projectsList
                    Spacer(minLength: 20)
                }
                .padding(.horizontal, 20)
                .padding(.top, 4)
            }
            .background(Color.black)
            .navigationTitle("Projects")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .searchable(text: $searchText, prompt: "Search projects")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .foregroundStyle(.white)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var statsRow: some View {
        HStack(spacing: 12) {
            StatChip(label: "Total", value: "\(ProjectSampleData.projects.count)", color: .white)
            StatChip(label: "Active", value: "\(ProjectSampleData.projects.filter { $0.status == .active }.count)", color: .green)
            StatChip(label: "Done", value: "\(ProjectSampleData.projects.filter { $0.status == .completed }.count)", color: .blue)
            StatChip(label: "Paused", value: "\(ProjectSampleData.projects.filter { $0.status == .paused }.count)", color: .orange)
        }
    }

    @ViewBuilder
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(title: "All", isSelected: selectedFilter == nil) { selectedFilter = nil }
                FilterChip(title: "Active", isSelected: selectedFilter == .active) { selectedFilter = .active }
                FilterChip(title: "Completed", isSelected: selectedFilter == .completed) { selectedFilter = .completed }
                FilterChip(title: "Paused", isSelected: selectedFilter == .paused) { selectedFilter = .paused }
            }
        }
    }

    @ViewBuilder
    private var projectsList: some View {
        if filtered.isEmpty {
            emptyState
        } else {
            VStack(spacing: 14) {
                ForEach(filtered) { project in
                    NavigationLink(destination: ProjectDetailView(project: project)) {
                        ProjectCard(project: project)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "folder.badge.questionmark")
                .font(.system(size: 52))
                .foregroundStyle(.gray.opacity(0.4))
            Text("No Projects Found")
                .font(.headline)
                .foregroundStyle(.white)
            Text("Try a different filter or start a new project.")
                .font(.subheadline)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 60)
    }
}

struct StatChip: View {
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundStyle(color)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color.white.opacity(0.07))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundStyle(isSelected ? .black : .gray)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.white : Color.white.opacity(0.08))
                .clipShape(Capsule())
        }
    }
}

struct ProjectCard: View {
    let project: Project

    private var progress: Double {
        project.tasksCount == 0 ? 0 : Double(project.completedCount) / Double(project.tasksCount)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            headerRow
            Text(project.description)
                .font(.caption)
                .foregroundStyle(.gray)
                .lineLimit(2)
            progressRow
            tagsRow
        }
        .padding(16)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var headerRow: some View {
        HStack(spacing: 12) {
            Image(systemName: project.icon)
                .font(.title3)
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(LinearGradient(colors: project.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            VStack(alignment: .leading, spacing: 2) {
                Text(project.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text("Updated \(project.lastUpdated)")
                    .font(.caption2)
                    .foregroundStyle(.gray)
            }
            Spacer()
            StatusBadge(status: project.status)
        }
    }

    @ViewBuilder
    private var progressRow: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("\(project.completedCount)/\(project.tasksCount) tasks")
                    .font(.caption)
                    .foregroundStyle(.gray)
                Spacer()
                Text("\(Int(progress * 100))%")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
            }
            ProgressView(value: progress)
                .tint(LinearGradient(colors: project.gradient, startPoint: .leading, endPoint: .trailing))
                .scaleEffect(y: 0.8)
        }
    }

    @ViewBuilder
    private var tagsRow: some View {
        HStack(spacing: 6) {
            ForEach(project.tags, id: \.self) { tag in
                Text(tag)
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundStyle(.white.opacity(0.7))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}

struct StatusBadge: View {
    let status: ProjectStatus

    var body: some View {
        Text(status.rawValue)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundStyle(status.color)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(status.color.opacity(0.15))
            .clipShape(Capsule())
    }
}

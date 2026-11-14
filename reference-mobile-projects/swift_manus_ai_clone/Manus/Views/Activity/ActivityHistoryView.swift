import SwiftUI

struct ActivityHistoryView: View {
    @State private var selectedFilter: TaskStatus? = nil
    @State private var searchText = ""

    private let allTasks = AgentSampleData.taskDetails

    private var filtered: [TaskDetail] {
        let base = selectedFilter == nil ? allTasks : allTasks.filter { $0.status == selectedFilter }
        if searchText.isEmpty { return base }
        return base.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    summaryStrip
                    filterRow
                    taskList
                    Spacer(minLength: 24)
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }
        }
        .navigationTitle("Activity")
        .navigationBarTitleDisplayMode(.large)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .searchable(text: $searchText, prompt: "Search tasks")
    }

    @ViewBuilder
    private var summaryStrip: some View {
        HStack(spacing: 10) {
            ActivityStat(label: "Total", value: "\(allTasks.count)", icon: "list.bullet", color: .white)
            ActivityStat(label: "Running", value: "\(allTasks.filter { $0.status == .running }.count)", icon: "circle.dotted", color: .blue)
            ActivityStat(label: "Done", value: "\(allTasks.filter { $0.status == .completed }.count)", icon: "checkmark.circle.fill", color: .green)
            ActivityStat(label: "Queued", value: "\(allTasks.filter { $0.status == .queued }.count)", icon: "clock.fill", color: .orange)
        }
    }

    @ViewBuilder
    private var filterRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(title: "All", isSelected: selectedFilter == nil) { selectedFilter = nil }
                FilterChip(title: "Running", isSelected: selectedFilter == .running) { selectedFilter = .running }
                FilterChip(title: "Completed", isSelected: selectedFilter == .completed) { selectedFilter = .completed }
                FilterChip(title: "Queued", isSelected: selectedFilter == .queued) { selectedFilter = .queued }
            }
        }
    }

    @ViewBuilder
    private var taskList: some View {
        if filtered.isEmpty {
            emptyState
        } else {
            VStack(spacing: 12) {
                ForEach(filtered) { task in
                    NavigationLink(destination: TaskDetailView(task: task)) {
                        ActivityTaskRow(task: task)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 14) {
            Image(systemName: "clock.arrow.circlepath")
                .font(.system(size: 48))
                .foregroundStyle(.gray.opacity(0.3))
            Text("No Tasks Found")
                .font(.headline)
                .foregroundStyle(.white)
            Text("Tasks will appear here once you start using Nexus.")
                .font(.subheadline)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 60)
    }
}

// MARK: - Activity Stat

struct ActivityStat: View {
    let label: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 13))
                .foregroundStyle(color)
            Text(value)
                .font(.headline)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Color.white.opacity(0.07))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

// MARK: - Activity Task Row

struct ActivityTaskRow: View {
    let task: TaskDetail

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: task.icon)
                .font(.system(size: 16))
                .foregroundStyle(.white)
                .frame(width: 44, height: 44)
                .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(RoundedRectangle(cornerRadius: 13))

            VStack(alignment: .leading, spacing: 5) {
                HStack {
                    Text(task.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                    Spacer()
                    statusPill(task.status)
                }
                Text(task.subtitle)
                    .font(.caption)
                    .foregroundStyle(.gray)
                    .lineLimit(1)
                if task.status == .running {
                    progressBar
                }
                HStack(spacing: 8) {
                    if let proj = task.projectName {
                        Label(proj, systemImage: "folder.fill")
                            .font(.caption2)
                            .foregroundStyle(.gray.opacity(0.7))
                    }
                    Spacer()
                    Text(task.createdAt)
                        .font(.caption2)
                        .foregroundStyle(.gray.opacity(0.5))
                    Image(systemName: "chevron.right")
                        .font(.caption2)
                        .foregroundStyle(.gray.opacity(0.4))
                }
            }
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    @ViewBuilder
    private func statusPill(_ status: TaskStatus) -> some View {
        Text(status.rawValue)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundStyle(status.color)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(status.color.opacity(0.13))
            .clipShape(Capsule())
    }

    @ViewBuilder
    private var progressBar: some View {
        ProgressView(value: task.progress)
            .tint(LinearGradient(colors: task.gradient, startPoint: .leading, endPoint: .trailing))
            .scaleEffect(y: 0.7)
    }
}

import SwiftUI

struct AgentActivitySectionView: View {
    private let tasks = AgentSampleData.taskDetails

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            headerRow
            ForEach(tasks) { task in
                NavigationLink(destination: TaskDetailView(task: task)) {
                    TaskCardView(task: task)
                }
                .buttonStyle(.plain)
            }
        }
    }

    @ViewBuilder
    private var headerRow: some View {
        HStack {
            Text("Agent Activity")
                .font(.headline)
                .foregroundStyle(.white)
            Spacer()
            NavigationLink(destination: ActivityHistoryView()) {
                Text("See All")
                    .font(.subheadline)
                    .foregroundStyle(.blue)
            }
        }
    }
}

struct TaskCardView: View {
    let task: TaskDetail

    var body: some View {
        HStack(spacing: 14) {
            iconView
            infoColumn
            Spacer()
            statusArea
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    @ViewBuilder
    private var iconView: some View {
        Image(systemName: task.icon)
            .font(.title3)
            .foregroundStyle(.white)
            .frame(width: 42, height: 42)
            .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing).opacity(0.8))
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    @ViewBuilder
    private var infoColumn: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(task.title)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(.white)
            Text(task.subtitle)
                .font(.caption)
                .foregroundStyle(.gray)
                .lineLimit(1)
            if task.status == .running {
                ProgressView(value: task.progress)
                    .tint(task.gradient.first ?? .blue)
                    .scaleEffect(y: 0.6)
            }
        }
    }

    @ViewBuilder
    private var statusArea: some View {
        VStack(spacing: 4) {
            Image(systemName: task.status.icon)
                .font(.caption)
                .foregroundStyle(task.status.color)
            Text(task.createdAt)
                .font(.caption2)
                .foregroundStyle(.gray)
            Image(systemName: "chevron.right")
                .font(.caption2)
                .foregroundStyle(.gray.opacity(0.4))
        }
    }
}

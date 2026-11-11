import SwiftUI

struct ProjectDetailView: View {
    let project: Project
    @Environment(\.dismiss) private var dismiss
    @State private var showNewTask = false

    private var projectTasks: [TaskDetail] {
        AgentSampleData.taskDetails.filter { $0.projectName == project.title }
    }

    private var allTasks: [TaskDetail] {
        projectTasks.isEmpty ? AgentSampleData.taskDetails : projectTasks
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.black.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    bannerHeader
                    statsStrip
                    tasksSection
                    timelineSection
                    Spacer(minLength: 100)
                }
            }
            addTaskButton
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button { dismiss() } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundStyle(.white)
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button(action: {}) { Label("Share Project", systemImage: "square.and.arrow.up") }
                    Button(action: {}) { Label("Export Report", systemImage: "doc.richtext") }
                    Divider()
                    Button(role: .destructive, action: {}) { Label("Archive", systemImage: "archivebox") }
                } label: {
                    Image(systemName: "ellipsis.circle").foregroundStyle(.white)
                }
            }
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(isPresented: $showNewTask) {
            AgentPromptBuilderView()
        }
    }

    // MARK: - Banner

    @ViewBuilder
    private var bannerHeader: some View {
        ZStack(alignment: .bottomLeading) {
            LinearGradient(
                colors: project.gradient + [Color.black],
                startPoint: .topTrailing,
                endPoint: .bottomLeading
            )
            .frame(height: 180)
            .opacity(0.55)

            VStack(alignment: .leading, spacing: 10) {
                StatusBadge(status: project.status)
                HStack(spacing: 14) {
                    Image(systemName: project.icon)
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 56, height: 56)
                        .background(LinearGradient(colors: project.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    VStack(alignment: .leading, spacing: 4) {
                        Text(project.title)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundStyle(.white)
                        Text(project.description)
                            .font(.caption)
                            .foregroundStyle(.white.opacity(0.65))
                            .lineLimit(2)
                    }
                }
                tagsRow
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)
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
                    .background(Color.white.opacity(0.12))
                    .clipShape(Capsule())
            }
        }
    }

    // MARK: - Stats Strip

    @ViewBuilder
    private var statsStrip: some View {
        HStack(spacing: 12) {
            ProjectStatCard(value: "\(project.tasksCount)", label: "Tasks", color: .white)
            ProjectStatCard(value: "\(project.completedCount)", label: "Done", color: .green)
            ProjectStatCard(value: "\(Int(Double(project.completedCount) / Double(max(project.tasksCount, 1)) * 100))%", label: "Progress", color: project.gradient.first ?? .blue)
            ProjectStatCard(value: project.lastUpdated, label: "Updated", color: .gray)
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Tasks

    @ViewBuilder
    private var tasksSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Tasks", subtitle: "\(allTasks.count) total")
            ForEach(allTasks) { task in
                NavigationLink(destination: TaskDetailView(task: task)) {
                    ProjectTaskRow(task: task)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Timeline

    @ViewBuilder
    private var timelineSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            SectionHeader(title: "Activity", subtitle: "Recent events")
            VStack(spacing: 12) {
                TimelineEvent(icon: "checkmark.circle.fill", color: .green, title: "Task completed", subtitle: "Investor Pitch Deck · 1h ago")
                TimelineEvent(icon: "circle.dotted", color: .blue, title: "Agent working", subtitle: "Landing Page in progress · 2m ago")
                TimelineEvent(icon: "plus.circle.fill", color: .purple, title: "Task created", subtitle: "Market Research added · 8m ago")
                TimelineEvent(icon: "link", color: .cyan, title: "Tool connected", subtitle: "Vercel linked to project · 3h ago")
            }
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Add Task Button

    @ViewBuilder
    private var addTaskButton: some View {
        Button { showNewTask = true } label: {
            HStack(spacing: 10) {
                Image(systemName: "plus")
                    .font(.system(size: 16, weight: .bold))
                Text("Add Task")
                    .font(.subheadline)
                    .fontWeight(.semibold)
            }
            .foregroundStyle(.black)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white)
            .clipShape(Capsule())
            .shadow(color: .black.opacity(0.4), radius: 20)
        }
        .padding(.bottom, 30)
    }
}

// MARK: - Supporting Views

struct ProjectStatCard: View {
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundStyle(color)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
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

struct ProjectTaskRow: View {
    let task: TaskDetail

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: task.icon)
                .font(.system(size: 15))
                .foregroundStyle(.white)
                .frame(width: 40, height: 40)
                .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(RoundedRectangle(cornerRadius: 11))
            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text("\(Int(task.progress * 100))% complete · \(task.createdAt)")
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            Spacer()
            Image(systemName: task.status.icon)
                .font(.system(size: 16))
                .foregroundStyle(task.status.color)
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(.gray.opacity(0.5))
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct TimelineEvent: View {
    let icon: String
    let color: Color
    let title: String
    let subtitle: String

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundStyle(color)
                .frame(width: 32, height: 32)
                .background(color.opacity(0.12))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)
                Text(subtitle)
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            Spacer()
        }
        .padding(12)
        .background(Color.white.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

struct SectionHeader: View {
    let title: String
    let subtitle: String

    var body: some View {
        HStack(alignment: .bottom) {
            Text(title)
                .font(.headline)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            Spacer()
            Text(subtitle)
                .font(.caption)
                .foregroundStyle(.gray)
        }
    }
}

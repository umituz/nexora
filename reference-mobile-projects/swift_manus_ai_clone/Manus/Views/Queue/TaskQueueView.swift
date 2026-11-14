import SwiftUI

// MARK: - Queue Task Model

struct QueuedTask: Identifiable {
    var id = UUID()
    let title: String
    let subtitle: String
    let icon: String
    let gradient: [Color]
    var status: QueueStatus
    var priority: TaskPriority
    let projectName: String
    let estimatedTime: String
    var queuePosition: Int?
}

enum QueueStatus: String, CaseIterable {
    case running = "Running"
    case queued = "Queued"
    case paused = "Paused"
    case failed = "Failed"

    var color: Color {
        switch self {
        case .running: return .blue
        case .queued: return .orange
        case .paused: return .gray
        case .failed: return .red
        }
    }

    var icon: String {
        switch self {
        case .running: return "circle.dotted"
        case .queued: return "clock.fill"
        case .paused: return "pause.circle.fill"
        case .failed: return "xmark.circle.fill"
        }
    }
}

enum TaskPriority: String, CaseIterable, Identifiable {
    case high = "High"
    case normal = "Normal"
    case low = "Low"
    var id: String { rawValue }

    var color: Color {
        switch self {
        case .high: return .red
        case .normal: return .blue
        case .low: return .gray
        }
    }

    var icon: String {
        switch self {
        case .high: return "arrow.up.circle.fill"
        case .normal: return "minus.circle.fill"
        case .low: return "arrow.down.circle.fill"
        }
    }
}

// MARK: - Task Queue View

struct TaskQueueView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var tasks: [QueuedTask] = QueueSampleData.tasks
    @State private var selectedFilter: QueueStatus? = nil
    @State private var editMode: EditMode = .inactive
    @State private var showClearConfirm = false

    private var running: [QueuedTask] { tasks.filter { $0.status == .running } }
    private var filtered: [QueuedTask] {
        guard let f = selectedFilter else { return tasks.filter { $0.status != .running } }
        return tasks.filter { $0.status == f && $0.status != .running }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        statsStrip
                        if !running.isEmpty { runningSection }
                        filterBar
                        queueSection
                        Spacer(minLength: 40)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
            }
            .navigationTitle("Task Queue")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.gray)
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button(action: { withAnimation { editMode = editMode == .active ? .inactive : .active }}) {
                            Label("Reorder", systemImage: "arrow.up.arrow.down")
                        }
                        Button(role: .destructive, action: { showClearConfirm = true }) {
                            Label("Clear Queue", systemImage: "trash")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle").foregroundStyle(.white)
                    }
                }
            }
            .confirmationDialog("Clear all queued tasks?", isPresented: $showClearConfirm, titleVisibility: .visible) {
                Button("Clear Queue", role: .destructive) {
                    withAnimation { tasks.removeAll { $0.status == .queued } }
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }

    // MARK: - Stats Strip

    @ViewBuilder
    private var statsStrip: some View {
        HStack(spacing: 10) {
            QueueStatCard(value: "\(tasks.filter { $0.status == .running }.count)", label: "Running", color: .blue)
            QueueStatCard(value: "\(tasks.filter { $0.status == .queued }.count)", label: "Queued", color: .orange)
            QueueStatCard(value: "\(tasks.filter { $0.status == .paused }.count)", label: "Paused", color: .gray)
            QueueStatCard(value: "\(tasks.filter { $0.status == .failed }.count)", label: "Failed", color: .red)
        }
    }

    // MARK: - Running Section

    @ViewBuilder
    private var runningSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Currently Running", systemImage: "circle.dotted")
                .font(.headline).fontWeight(.bold)
                .foregroundStyle(.white)
            ForEach(running) { task in
                RunningTaskCard(task: task, onStop: { stopTask(task) })
            }
        }
    }

    // MARK: - Filter Bar

    @ViewBuilder
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(title: "All", isSelected: selectedFilter == nil) { selectedFilter = nil }
                ForEach(QueueStatus.allCases.filter { $0 != .running }, id: \.self) { status in
                    FilterChip(title: status.rawValue, isSelected: selectedFilter == status) {
                        selectedFilter = status
                    }
                }
            }
        }
    }

    // MARK: - Queue Section

    @ViewBuilder
    private var queueSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Queue")
                    .font(.headline).fontWeight(.bold).foregroundStyle(.white)
                Spacer()
                Text("\(filtered.count) tasks")
                    .font(.caption).foregroundStyle(.gray)
            }

            if filtered.isEmpty {
                emptyQueueState
            } else {
                ForEach(filtered) { task in
                    QueueTaskCard(task: task,
                                  onPause: { togglePause(task) },
                                  onCancel: { cancelTask(task) },
                                  onPriorityChange: { newP in changePriority(task, to: newP) })
                }
            }
        }
    }

    @ViewBuilder
    private var emptyQueueState: some View {
        VStack(spacing: 14) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 44)).foregroundStyle(.green.opacity(0.4))
            Text("Queue is empty")
                .font(.subheadline).foregroundStyle(.gray)
            Text("All tasks are done. Create a new task to get started.")
                .font(.caption).foregroundStyle(.gray.opacity(0.6)).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 50)
    }

    // MARK: - Actions

    private func stopTask(_ task: QueuedTask) {
        guard let i = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        withAnimation { tasks[i].status = .paused }
    }

    private func togglePause(_ task: QueuedTask) {
        guard let i = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        withAnimation { tasks[i].status = tasks[i].status == .paused ? .queued : .paused }
    }

    private func cancelTask(_ task: QueuedTask) {
        withAnimation { tasks.removeAll { $0.id == task.id } }
    }

    private func changePriority(_ task: QueuedTask, to priority: TaskPriority) {
        guard let i = tasks.firstIndex(where: { $0.id == task.id }) else { return }
        tasks[i].priority = priority
    }
}

// MARK: - Stat Card

struct QueueStatCard: View {
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value).font(.title3).fontWeight(.bold).foregroundStyle(color)
            Text(label).font(.caption2).foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 12)
        .background(color.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(color.opacity(0.2), lineWidth: 1))
    }
}

// MARK: - Running Task Card

struct RunningTaskCard: View {
    let task: QueuedTask
    let onStop: () -> Void
    @State private var progress: Double = 0.45
    @State private var animating = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Image(systemName: task.icon)
                    .font(.body)
                    .foregroundStyle(.white)
                    .frame(width: 44, height: 44)
                    .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                VStack(alignment: .leading, spacing: 3) {
                    Text(task.title).font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                    Text(task.subtitle).font(.caption).foregroundStyle(.gray).lineLimit(1)
                }
                Spacer()
                Button(action: onStop) {
                    Image(systemName: "stop.circle.fill")
                        .font(.title3).foregroundStyle(.red.opacity(0.8))
                }
            }
            VStack(alignment: .leading, spacing: 5) {
                HStack {
                    HStack(spacing: 4) {
                        Circle().fill(Color.blue).frame(width: 6, height: 6)
                            .opacity(animating ? 1 : 0.3)
                        Text("Running · \(task.estimatedTime) remaining")
                            .font(.caption2).foregroundStyle(.blue)
                    }
                    Spacer()
                    Text("\(Int(progress * 100))%")
                        .font(.caption2).fontWeight(.bold).foregroundStyle(.white)
                }
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 4).fill(Color.white.opacity(0.1)).frame(height: 5)
                        RoundedRectangle(cornerRadius: 4)
                            .fill(LinearGradient(colors: task.gradient, startPoint: .leading, endPoint: .trailing))
                            .frame(width: geo.size.width * progress, height: 5)
                    }
                }
                .frame(height: 5)
            }
        }
        .padding(16)
        .background(Color(white: 0.09))
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.blue.opacity(0.25), lineWidth: 1))
        .onAppear {
            withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                animating = true
            }
        }
    }
}

// MARK: - Queue Task Card

struct QueueTaskCard: View {
    let task: QueuedTask
    let onPause: () -> Void
    let onCancel: () -> Void
    let onPriorityChange: (TaskPriority) -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Position
            if let pos = task.queuePosition {
                Text("#\(pos)")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(.gray)
                    .frame(width: 24)
            }

            Image(systemName: task.icon)
                .font(.body)
                .foregroundStyle(.white)
                .frame(width: 42, height: 42)
                .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(RoundedRectangle(cornerRadius: 11))
                .opacity(task.status == .paused ? 0.5 : 1)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(task.status == .paused ? .gray : .white)
                HStack(spacing: 6) {
                    Image(systemName: task.status.icon).font(.caption2).foregroundStyle(task.status.color)
                    Text(task.status.rawValue).font(.caption2).foregroundStyle(task.status.color)
                    Text("·").font(.caption2).foregroundStyle(.gray)
                    Text(task.estimatedTime).font(.caption2).foregroundStyle(.gray)
                }
            }
            Spacer()

            // Priority badge
            Menu {
                ForEach(TaskPriority.allCases, id: \.self) { p in
                    Button(action: { onPriorityChange(p) }) {
                        Label(p.rawValue, systemImage: p.icon)
                    }
                }
            } label: {
                HStack(spacing: 3) {
                    Image(systemName: task.priority.icon).font(.caption2)
                    Text(task.priority.rawValue).font(.caption2).fontWeight(.semibold)
                }
                .foregroundStyle(task.priority.color)
                .padding(.horizontal, 8).padding(.vertical, 4)
                .background(task.priority.color.opacity(0.12))
                .clipShape(Capsule())
            }

            // Actions
            HStack(spacing: 8) {
                Button(action: onPause) {
                    Image(systemName: task.status == .paused ? "play.circle.fill" : "pause.circle.fill")
                        .font(.title3).foregroundStyle(.gray)
                }
                Button(action: onCancel) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3).foregroundStyle(.red.opacity(0.6))
                }
            }
        }
        .padding(.horizontal, 14).padding(.vertical, 12)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

// MARK: - Sample Data

enum QueueSampleData {
    static let tasks: [QueuedTask] = {
        let blue = Color.blue; let cyan = Color.cyan
        let orange = Color.orange; let yellow = Color.yellow
        let pink = Color.pink; let purple = Color.purple
        let red = Color.red; let green = Color.green
        let teal = Color.teal; let indigo = Color.indigo
        let gray = Color.gray
        return [
            QueuedTask(title: "Build Landing Page", subtitle: "Responsive marketing site", icon: "globe", gradient: [blue, cyan], status: .running, priority: .high, projectName: "Nexus Launch", estimatedTime: "4 min", queuePosition: nil),
            QueuedTask(title: "Market Research", subtitle: "Competitor analysis report", icon: "chart.bar.fill", gradient: [orange, yellow], status: .running, priority: .normal, projectName: "Strategy Q2", estimatedTime: "11 min", queuePosition: nil),
            QueuedTask(title: "Social Media Kit", subtitle: "10 posts for Instagram & LinkedIn", icon: "photo.stack.fill", gradient: [pink, purple], status: .queued, priority: .high, projectName: "Marketing", estimatedTime: "6 min", queuePosition: 1),
            QueuedTask(title: "Email Campaign", subtitle: "5-email nurture sequence", icon: "envelope.fill", gradient: [red, orange], status: .queued, priority: .normal, projectName: "Marketing", estimatedTime: "8 min", queuePosition: 2),
            QueuedTask(title: "API Documentation", subtitle: "OpenAPI spec with examples", icon: "doc.text.fill", gradient: [green, teal], status: .queued, priority: .low, projectName: "Dev Hub", estimatedTime: "15 min", queuePosition: 3),
            QueuedTask(title: "Logo Variations", subtitle: "Dark/light and icon versions", icon: "paintpalette.fill", gradient: [purple, indigo], status: .paused, priority: .normal, projectName: "Brand Kit", estimatedTime: "3 min", queuePosition: nil),
            QueuedTask(title: "Podcast Transcript", subtitle: "Episode 12 transcription failed", icon: "waveform", gradient: [gray, gray], status: .failed, priority: .normal, projectName: "Content", estimatedTime: "–", queuePosition: nil),
        ]
    }()
}

import SwiftUI

struct TaskDetailView: View {
    let task: TaskDetail
    @Environment(\.dismiss) private var dismiss
    @State private var selectedTab = 0
    @State private var showLiveRun = false

    var body: some View {
        ZStack(alignment: .top) {
            Color.black.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    headerSection
                    segmentedControl
                    tabContent
                    Spacer(minLength: 40)
                }
            }
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
                taskActionMenu
            }
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(isPresented: $showLiveRun) {
            AgentRunView(taskTitle: task.title, gradient: task.gradient)
        }
    }

    // MARK: - Header

    @ViewBuilder
    private var headerSection: some View {
        VStack(spacing: 0) {
            // Gradient banner
            ZStack(alignment: .bottomLeading) {
                LinearGradient(colors: task.gradient + [Color.black], startPoint: .top, endPoint: .bottom)
                    .frame(height: 160)
                    .opacity(0.6)
                VStack(alignment: .leading, spacing: 8) {
                    statusPill
                    HStack(spacing: 14) {
                        Image(systemName: task.icon)
                            .font(.title2)
                            .foregroundStyle(.white)
                            .frame(width: 52, height: 52)
                            .background(LinearGradient(colors: task.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        VStack(alignment: .leading, spacing: 3) {
                            Text(task.title)
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundStyle(.white)
                            Text(task.subtitle)
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.7))
                                .lineLimit(2)
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 16)
            }

            // Progress & meta bar
            VStack(spacing: 12) {
                progressBar
                metaRow
                if task.status == .running {
                    watchLiveButton
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(Color(white: 0.07))
        }
    }

    @ViewBuilder
    private var statusPill: some View {
        HStack(spacing: 5) {
            if task.status == .running {
                Circle().fill(task.status.color).frame(width: 7, height: 7)
                    .overlay(Circle().stroke(task.status.color.opacity(0.4), lineWidth: 3))
            } else {
                Image(systemName: task.status.icon).font(.caption2).foregroundStyle(task.status.color)
            }
            Text(task.status.rawValue)
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(task.status.color)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(task.status.color.opacity(0.15))
        .clipShape(Capsule())
    }

    @ViewBuilder
    private var progressBar: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Progress")
                    .font(.caption)
                    .foregroundStyle(.gray)
                Spacer()
                Text("\(Int(task.progress * 100))%")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4).fill(Color.white.opacity(0.1)).frame(height: 6)
                    RoundedRectangle(cornerRadius: 4)
                        .fill(LinearGradient(colors: task.gradient, startPoint: .leading, endPoint: .trailing))
                        .frame(width: geo.size.width * task.progress, height: 6)
                }
            }
            .frame(height: 6)
        }
    }

    @ViewBuilder
    private var metaRow: some View {
        HStack {
            metaItem(icon: "clock", label: task.createdAt)
            Divider().frame(height: 20).background(Color.white.opacity(0.15))
            metaItem(icon: "timer", label: task.estimatedTime)
            if let project = task.projectName {
                Divider().frame(height: 20).background(Color.white.opacity(0.15))
                metaItem(icon: "folder.fill", label: project)
            }
        }
    }

    @ViewBuilder
    private var watchLiveButton: some View {
        Button { showLiveRun = true } label: {
            HStack(spacing: 8) {
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 15))
                Text("Watch Agent Live")
                    .font(.subheadline)
                    .fontWeight(.semibold)
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(LinearGradient(colors: task.gradient, startPoint: .leading, endPoint: .trailing))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    @ViewBuilder
    private func metaItem(icon: String, label: String) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon).font(.caption2).foregroundStyle(.gray)
            Text(label).font(.caption).foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Segment Control

    @ViewBuilder
    private var segmentedControl: some View {
        HStack(spacing: 0) {
            ForEach(["Steps", "Outputs", "Tools"].indices, id: \.self) { i in
                let labels = ["Steps", "Outputs", "Tools"]
                Button {
                    withAnimation(.spring(duration: 0.3)) { selectedTab = i }
                } label: {
                    VStack(spacing: 8) {
                        Text(labels[i])
                            .font(.subheadline)
                            .fontWeight(selectedTab == i ? .semibold : .regular)
                            .foregroundStyle(selectedTab == i ? .white : .gray)
                        Rectangle()
                            .fill(selectedTab == i ? Color.white : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 20)
        .background(Color.black)
    }

    @ViewBuilder
    private var tabContent: some View {
        switch selectedTab {
        case 0: stepsTab
        case 1: outputsTab
        default: toolsTab
        }
    }

    // MARK: - Steps Tab

    @ViewBuilder
    private var stepsTab: some View {
        VStack(spacing: 0) {
            ForEach(Array(task.steps.enumerated()), id: \.element.id) { idx, step in
                StepRowView(step: step, isLast: idx == task.steps.count - 1)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }

    // MARK: - Outputs Tab

    @ViewBuilder
    private var outputsTab: some View {
        VStack(spacing: 14) {
            if task.outputs.isEmpty {
                emptyOutputState
            } else {
                ForEach(task.outputs) { output in
                    NavigationLink(destination: OutputViewerView(output: output)) {
                        OutputCard(output: output)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }

    @ViewBuilder
    private var emptyOutputState: some View {
        VStack(spacing: 14) {
            Image(systemName: "tray")
                .font(.system(size: 44))
                .foregroundStyle(.gray.opacity(0.3))
            Text("No outputs yet")
                .font(.subheadline)
                .foregroundStyle(.gray)
            Text("Outputs will appear here once the agent completes steps.")
                .font(.caption)
                .foregroundStyle(.gray.opacity(0.6))
                .multilineTextAlignment(.center)
        }
        .padding(.top, 60)
    }

    // MARK: - Tools Tab

    @ViewBuilder
    private var toolsTab: some View {
        VStack(spacing: 12) {
            ForEach(task.toolsUsed, id: \.self) { tool in
                ToolUsedRow(toolName: tool)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
    }

    // MARK: - Action Menu

    @ViewBuilder
    private var taskActionMenu: some View {
        Menu {
            Button(role: .none, action: {}) {
                Label("Share Output", systemImage: "square.and.arrow.up")
            }
            Button(role: .none, action: {}) {
                Label("Duplicate Task", systemImage: "plus.square.on.square")
            }
            if task.status == .running {
                Divider()
                Button(role: .destructive, action: {}) {
                    Label("Stop Agent", systemImage: "stop.circle")
                }
            }
        } label: {
            Image(systemName: "ellipsis.circle")
                .font(.system(size: 17))
                .foregroundStyle(.white)
        }
    }
}

// MARK: - Step Row

struct StepRowView: View {
    let step: AgentStep
    let isLast: Bool
    @State private var pulse = false

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            // Timeline indicator
            VStack(spacing: 0) {
                ZStack {
                    if step.status == .running {
                        Circle()
                            .fill(step.status.color.opacity(0.2))
                            .frame(width: 32, height: 32)
                            .scaleEffect(pulse ? 1.3 : 1.0)
                            .opacity(pulse ? 0 : 1)
                    }
                    Image(systemName: step.status.icon)
                        .font(.system(size: 14))
                        .foregroundStyle(step.status.color)
                        .frame(width: 32, height: 32)
                        .background(step.status.color.opacity(step.status == .pending ? 0 : 0.15))
                        .overlay(Circle().stroke(step.status.color.opacity(step.status == .pending ? 0.3 : 0), lineWidth: 1.5))
                        .clipShape(Circle())
                }
                if !isLast {
                    Rectangle()
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 1.5)
                        .frame(maxHeight: .infinity)
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(step.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(step.status == .pending ? Color.gray : Color.white)
                    Spacer()
                    if let dur = step.duration {
                        Text(dur)
                            .font(.caption2)
                            .foregroundStyle(.gray)
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(Color.white.opacity(0.07))
                            .clipShape(Capsule())
                    }
                }
                Text(step.detail)
                    .font(.caption)
                    .foregroundStyle(step.status == .pending ? Color.gray.opacity(0.5) : Color.gray)
                    .lineLimit(2)
                if let tool = step.toolUsed {
                    HStack(spacing: 4) {
                        Image(systemName: "wrench.adjustable.fill").font(.caption2).foregroundStyle(.blue.opacity(0.8))
                        Text(tool).font(.caption2).foregroundStyle(.blue.opacity(0.8))
                    }
                }
            }
            .padding(.bottom, isLast ? 0 : 24)
        }
        .onAppear {
            if step.status == .running {
                withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: false)) {
                    pulse = true
                }
            }
        }
    }
}

// MARK: - Output Card

struct OutputCard: View {
    let output: AgentOutput

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: output.icon)
                .font(.title3)
                .foregroundStyle(output.color)
                .frame(width: 48, height: 48)
                .background(output.color.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 13))
            VStack(alignment: .leading, spacing: 4) {
                Text(output.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text(output.preview)
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            Spacer()
            HStack(spacing: 8) {
                outputTypeTag
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(.gray.opacity(0.5))
            }
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    @ViewBuilder
    private var outputTypeTag: some View {
        let (label, color) = outputTypeInfo
        Text(label)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
    }

    private var outputTypeInfo: (String, Color) {
        switch output.type {
        case .webpage: return ("Preview", .blue)
        case .code: return ("Code", .purple)
        case .document: return ("PDF", .orange)
        case .spreadsheet: return ("Sheet", .green)
        case .image: return ("Images", .pink)
        case .research: return ("Report", .yellow)
        }
    }
}

// MARK: - Tool Used Row

struct ToolUsedRow: View {
    let toolName: String

    private var toolIcon: String {
        switch toolName {
        case "GitHub": return "arrow.triangle.branch"
        case "Figma": return "paintbrush.fill"
        case "Vercel": return "bolt.fill"
        case "Notion": return "doc.text.fill"
        case "Google Drive": return "icloud.fill"
        case "Slack": return "bubble.left.fill"
        case "Spreadsheet": return "tablecells"
        case "Web Browser": return "globe"
        case "Code Editor": return "chevron.left.forwardslash.chevron.right"
        default: return "wrench.adjustable"
        }
    }

    private var toolColor: Color {
        switch toolName {
        case "GitHub": return .white
        case "Figma": return .purple
        case "Vercel": return .white
        case "Notion": return .white
        case "Google Drive": return .blue
        case "Slack": return .green
        case "Web Browser": return .cyan
        case "Code Editor": return .blue
        case "Spreadsheet": return .green
        default: return .gray
        }
    }

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: toolIcon)
                .font(.system(size: 16))
                .foregroundStyle(toolColor)
                .frame(width: 40, height: 40)
                .background(toolColor.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 11))
            Text(toolName)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundStyle(.white)
            Spacer()
            Text("Used")
                .font(.caption2)
                .fontWeight(.semibold)
                .foregroundStyle(.green)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color.green.opacity(0.12))
                .clipShape(Capsule())
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

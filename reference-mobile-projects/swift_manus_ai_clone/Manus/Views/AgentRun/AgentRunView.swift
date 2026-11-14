import SwiftUI

/// Full-screen live agent execution view — shown when tapping "Watch Agent" or creating a task
struct AgentRunView: View {
    let taskTitle: String
    let gradient: [Color]
    @Environment(\.dismiss) private var dismiss

    @State private var steps: [LiveStep] = LiveStep.sampleSteps
    @State private var currentStepIndex = 0
    @State private var logLines: [String] = []
    @State private var showLog = false
    @State private var elapsed = 0
    @State private var timer: Timer? = nil
    @State private var done = false

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 0) {
                agentHeader
                Divider().background(Color.white.opacity(0.08))
                if showLog { logPanel } else { stepsPanel }
                Divider().background(Color.white.opacity(0.08))
                bottomBar
            }
        }
        .onAppear { startExecution() }
        .onDisappear { timer?.invalidate() }
    }

    // MARK: - Header

    @ViewBuilder
    private var agentHeader: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 42, height: 42)
                Image(systemName: "sparkles")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(taskTitle)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                    .lineLimit(1)
                HStack(spacing: 5) {
                    if !done {
                        Circle().fill(Color.green).frame(width: 7, height: 7)
                        Text("Agent running · \(elapsedString)")
                            .font(.caption)
                            .foregroundStyle(.green)
                    } else {
                        Image(systemName: "checkmark.circle.fill").font(.caption).foregroundStyle(.green)
                        Text("Completed in \(elapsedString)")
                            .font(.caption)
                            .foregroundStyle(.green)
                    }
                }
            }
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark.circle.fill")
                    .font(.title3)
                    .foregroundStyle(.gray)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }

    private var elapsedString: String {
        let m = elapsed / 60
        let s = elapsed % 60
        return m > 0 ? "\(m)m \(s)s" : "\(s)s"
    }

    // MARK: - Steps Panel

    @ViewBuilder
    private var stepsPanel: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                ForEach(Array(steps.enumerated()), id: \.element.id) { idx, step in
                    LiveStepRow(step: step, isLast: idx == steps.count - 1)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 20)
        }
    }

    // MARK: - Log Panel

    @ViewBuilder
    private var logPanel: some View {
        ScrollViewReader { proxy in
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(Array(logLines.enumerated()), id: \.offset) { idx, line in
                        Text(line)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundStyle(logColor(line))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .id(idx)
                    }
                }
                .padding(16)
            }
            .background(Color(white: 0.04))
            .onChange(of: logLines.count) { _, _ in
                proxy.scrollTo(logLines.count - 1, anchor: .bottom)
            }
        }
    }

    private func logColor(_ line: String) -> Color {
        if line.hasPrefix("[✓]") { return .green }
        if line.hasPrefix("[→]") { return .cyan }
        if line.hasPrefix("[!]") { return .orange }
        return Color.white.opacity(0.6)
    }

    // MARK: - Bottom Bar

    @ViewBuilder
    private var bottomBar: some View {
        HStack(spacing: 12) {
            Button {
                withAnimation { showLog.toggle() }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: showLog ? "list.bullet" : "terminal")
                        .font(.caption)
                    Text(showLog ? "Steps" : "Logs")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .foregroundStyle(.gray)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.white.opacity(0.08))
                .clipShape(Capsule())
            }
            Spacer()
            if done {
                Button { dismiss() } label: {
                    Text("View Results")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.black)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                        .background(Color.white)
                        .clipShape(Capsule())
                }
            } else {
                Button { stopExecution() } label: {
                    Text("Stop Agent")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.red)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                        .background(Color.red.opacity(0.12))
                        .clipShape(Capsule())
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
    }

    // MARK: - Execution Logic

    private func startExecution() {
        addLog("[→] Initializing agent environment...")
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            elapsed += 1
            addLog(randomLog(for: elapsed))
            if elapsed % 5 == 0 && currentStepIndex < steps.count {
                advanceStep()
            }
            if currentStepIndex >= steps.count {
                timer?.invalidate()
                done = true
                addLog("[✓] All steps completed successfully")
            }
        }
    }

    private func advanceStep() {
        guard currentStepIndex < steps.count else { return }
        withAnimation(.spring(duration: 0.4)) {
            steps[currentStepIndex].status = .completed
            if currentStepIndex + 1 < steps.count {
                steps[currentStepIndex + 1].status = .running
            }
            currentStepIndex += 1
        }
    }

    private func stopExecution() {
        timer?.invalidate()
        done = true
    }

    private func addLog(_ line: String) {
        let ts = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        logLines.append("[\(ts)] \(line)")
    }

    private func randomLog(for tick: Int) -> String {
        let logs = [
            "[→] Fetching data from external source...",
            "[→] Processing response (chunk \(tick)/\(steps.count * 5))...",
            "[→] Applying model inference...",
            "[!] Rate limit approached — throttling requests",
            "[→] Writing output to buffer...",
            "[✓] Checkpoint saved",
            "[→] Parsing structured response...",
            "[→] Validating output schema...",
        ]
        return logs[tick % logs.count]
    }
}

// MARK: - Live Step Model

struct LiveStep: Identifiable {
    let id = UUID()
    let title: String
    let detail: String
    let icon: String
    var status: AgentStepStatus

    static var sampleSteps: [LiveStep] = [
        LiveStep(title: "Analyzing task", detail: "Parsing your request and building execution plan", icon: "doc.text.magnifyingglass", status: .running),
        LiveStep(title: "Gathering context", detail: "Searching web and connected tools for relevant data", icon: "magnifyingglass", status: .pending),
        LiveStep(title: "Generating content", detail: "Creating primary output based on gathered context", icon: "wand.and.stars", status: .pending),
        LiveStep(title: "Refinement pass", detail: "Reviewing and improving output quality", icon: "checkmark.seal", status: .pending),
        LiveStep(title: "Delivering results", detail: "Packaging outputs and notifying you", icon: "paperplane.fill", status: .pending),
    ]
}

// MARK: - Live Step Row

struct LiveStepRow: View {
    let step: LiveStep
    let isLast: Bool
    @State private var pulse = false

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            VStack(spacing: 0) {
                ZStack {
                    if step.status == .running {
                        Circle()
                            .stroke(LinearGradient(colors: [.blue, .purple], startPoint: .top, endPoint: .bottom), lineWidth: 2)
                            .frame(width: 34, height: 34)
                            .rotationEffect(.degrees(pulse ? 360 : 0))
                            .animation(.linear(duration: 1.5).repeatForever(autoreverses: false), value: pulse)
                    }
                    Image(systemName: step.status == .running ? step.icon : step.status.icon)
                        .font(.system(size: 14))
                        .foregroundStyle(step.status.color)
                        .frame(width: 30, height: 30)
                        .background(step.status == .pending ? Color.clear : step.status.color.opacity(0.15))
                        .clipShape(Circle())
                }
                if !isLast {
                    Rectangle()
                        .fill(Color.white.opacity(step.status == .completed ? 0.2 : 0.07))
                        .frame(width: 1.5)
                        .frame(maxHeight: .infinity)
                }
            }

            VStack(alignment: .leading, spacing: 5) {
                Text(step.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(step.status == .pending ? Color.gray : Color.white)
                Text(step.detail)
                    .font(.caption)
                    .foregroundStyle(step.status == .pending ? Color.gray.opacity(0.4) : Color.gray)
                    .lineLimit(2)
                if step.status == .running {
                    ThinkingDotsView()
                        .padding(.top, 2)
                }
            }
            .padding(.bottom, isLast ? 0 : 28)
            Spacer()
        }
        .onAppear {
            if step.status == .running { pulse = true }
        }
        .onChange(of: step.status) { _, s in
            pulse = (s == .running)
        }
    }
}

// MARK: - Thinking Dots

struct ThinkingDotsView: View {
    @State private var active = false
    let dotCount = 3

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<dotCount, id: \.self) { i in
                Circle()
                    .fill(Color.blue)
                    .frame(width: 5, height: 5)
                    .opacity(active ? 1 : 0.2)
                    .animation(.easeInOut(duration: 0.5).delay(Double(i) * 0.15).repeatForever(), value: active)
            }
        }
        .onAppear { active = true }
    }
}

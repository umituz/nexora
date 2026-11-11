import SwiftUI

// MARK: - Structured Agent Task Builder

struct AgentPromptBuilderView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var step: BuilderStep = .type
    @State private var selectedType: TaskType? = nil
    @State private var promptText = ""
    @State private var selectedTools: Set<String> = []
    @State private var priority: TaskPriority = .normal
    @State private var selectedProject: String = "No Project"
    @State private var showRun = false
    @FocusState private var promptFocused: Bool

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    stepIndicator
                    Divider().background(Color.white.opacity(0.08))
                    stepContent
                    bottomBar
                }
            }
            .navigationTitle("New Task")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.gray)
                    }
                }
            }
            .sheet(isPresented: $showRun) {
                AgentRunView(
                    taskTitle: promptText.isEmpty ? (selectedType?.title ?? "New Task") : promptText,
                    gradient: selectedType?.gradient ?? [.blue, .purple]
                )
            }
        }
    }

    // MARK: - Step Indicator

    @ViewBuilder
    private var stepIndicator: some View {
        HStack(spacing: 0) {
            ForEach(BuilderStep.allCases) { s in
                let idx = BuilderStep.allCases.firstIndex(of: s) ?? 0
                let current = BuilderStep.allCases.firstIndex(of: step) ?? 0
                let done = idx < current
                let active = idx == current

                HStack(spacing: 0) {
                    VStack(spacing: 4) {
                        ZStack {
                            Circle()
                                .fill(done ? Color.green : (active ? Color.white : Color.white.opacity(0.12)))
                                .frame(width: 26, height: 26)
                            if done {
                                Image(systemName: "checkmark").font(.system(size: 10, weight: .bold)).foregroundStyle(.black)
                            } else {
                                Text("\(idx + 1)").font(.system(size: 11, weight: .bold))
                                    .foregroundStyle(active ? .black : .gray)
                            }
                        }
                        Text(s.label).font(.system(size: 9, weight: active ? .semibold : .regular))
                            .foregroundStyle(active ? .white : .gray)
                    }
                    if s != BuilderStep.allCases.last {
                        Rectangle()
                            .fill(done ? Color.green.opacity(0.5) : Color.white.opacity(0.1))
                            .frame(height: 1)
                            .frame(maxWidth: .infinity)
                            .padding(.bottom, 14)
                    }
                }
                .frame(maxWidth: s == BuilderStep.allCases.last ? nil : .infinity)
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 14)
        .background(Color(white: 0.07))
    }

    // MARK: - Step Content

    @ViewBuilder
    private var stepContent: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 24) {
                switch step {
                case .type: typeStep
                case .prompt: promptStep
                case .tools: toolsStep
                case .options: optionsStep
                }
            }
            .padding(20)
            .padding(.bottom, 10)
        }
    }

    // MARK: Step 1: Type

    @ViewBuilder
    private var typeStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(title: "What should Nexus do?", subtitle: "Choose the type of task to run")
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(TaskType.allCases) { type in
                    TypeCard(type: type, isSelected: selectedType?.id == type.id) {
                        withAnimation(.spring(duration: 0.25)) { selectedType = type }
                    }
                }
            }
        }
    }

    // MARK: Step 2: Prompt

    @ViewBuilder
    private var promptStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(
                title: "Describe your task",
                subtitle: "Be specific — the more detail, the better the result"
            )
            // Smart suggestions based on type
            if let type = selectedType {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Suggestions")
                        .font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
                    ForEach(type.suggestions, id: \.self) { s in
                        Button {
                            withAnimation { promptText = s }
                            promptFocused = false
                        } label: {
                            HStack(spacing: 10) {
                                Image(systemName: "lightbulb.fill")
                                    .font(.caption2).foregroundStyle(.yellow.opacity(0.8))
                                Text(s)
                                    .font(.subheadline).foregroundStyle(.white.opacity(0.8))
                                    .multilineTextAlignment(.leading)
                                Spacer()
                                Image(systemName: "arrow.up.left")
                                    .font(.caption2).foregroundStyle(.gray)
                            }
                            .padding(12)
                            .background(Color.white.opacity(0.06))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
            }
            // Text input
            VStack(alignment: .leading, spacing: 8) {
                Text("Your prompt").font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color.white.opacity(0.07))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(
                            promptFocused ? Color.white.opacity(0.3) : Color.clear, lineWidth: 1.5)
                        )
                    if promptText.isEmpty {
                        Text("Describe what you want to create or accomplish…")
                            .font(.subheadline).foregroundStyle(.gray.opacity(0.5))
                            .padding(14)
                            .allowsHitTesting(false)
                    }
                    TextEditor(text: $promptText)
                        .font(.subheadline)
                        .foregroundStyle(.white)
                        .scrollContentBackground(.hidden)
                        .focused($promptFocused)
                        .padding(10)
                        .frame(minHeight: 120)
                }
                HStack {
                    Text("\(promptText.count) characters")
                        .font(.caption2).foregroundStyle(.gray)
                    Spacer()
                    if promptText.count > 10 {
                        Label("Good detail!", systemImage: "checkmark.circle.fill")
                            .font(.caption2).foregroundStyle(.green)
                    }
                }
            }
        }
    }

    // MARK: Step 3: Tools

    @ViewBuilder
    private var toolsStep: some View {
        VStack(alignment: .leading, spacing: 16) {
            stepHeader(title: "Connected Tools", subtitle: "Select which integrations Nexus can use")
            // Recommended
            let recommended = selectedType?.recommendedTools ?? []
            if !recommended.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Label("Recommended for this task", systemImage: "star.fill")
                        .font(.caption).fontWeight(.semibold).foregroundStyle(.yellow)
                    ForEach(ToolOption.all.filter { recommended.contains($0.name) }) { tool in
                        ToolToggleRow(tool: tool, isSelected: selectedTools.contains(tool.name)) {
                            toggle(tool: tool.name)
                        }
                    }
                }
            }
            // All tools
            VStack(alignment: .leading, spacing: 8) {
                Text("All Tools").font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
                ForEach(ToolOption.all.filter { !recommended.contains($0.name) }) { tool in
                    ToolToggleRow(tool: tool, isSelected: selectedTools.contains(tool.name)) {
                        toggle(tool: tool.name)
                    }
                }
            }
        }
    }

    private func toggle(tool: String) {
        withAnimation(.spring(duration: 0.2)) {
            if selectedTools.contains(tool) { selectedTools.remove(tool) }
            else { selectedTools.insert(tool) }
        }
    }

    // MARK: Step 4: Options

    @ViewBuilder
    private var optionsStep: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(title: "Task Options", subtitle: "Configure how Nexus runs this task")
            prioritySection
            projectSection
            reviewCard
        }
    }

    @ViewBuilder
    private var prioritySection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Priority").font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
            HStack(spacing: 10) {
                ForEach(TaskPriority.allCases) { p in
                    Button {
                        withAnimation(.spring(duration: 0.2)) { priority = p }
                    } label: {
                        HStack(spacing: 6) {
                            Circle().fill(p.color).frame(width: 8, height: 8)
                            Text(p.rawValue)
                                .font(.subheadline).fontWeight(priority == p ? .semibold : .regular)
                                .foregroundStyle(priority == p ? .white : .gray)
                        }
                        .padding(.horizontal, 16).padding(.vertical, 10)
                        .background(priority == p ? p.color.opacity(0.18) : Color.white.opacity(0.07))
                        .clipShape(Capsule())
                        .overlay(Capsule().stroke(priority == p ? p.color.opacity(0.5) : Color.clear, lineWidth: 1.5))
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var projectSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Add to Project").font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(["No Project", "Nexus Landing Page", "Market Research", "Investor Deck"], id: \.self) { proj in
                        Button {
                            withAnimation { selectedProject = proj }
                        } label: {
                            Text(proj)
                                .font(.subheadline)
                                .fontWeight(selectedProject == proj ? .semibold : .regular)
                                .foregroundStyle(selectedProject == proj ? .black : .gray)
                                .padding(.horizontal, 16).padding(.vertical, 9)
                                .background(selectedProject == proj ? Color.white : Color.white.opacity(0.08))
                                .clipShape(Capsule())
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var reviewCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Label("Task Summary", systemImage: "doc.text.fill")
                .font(.subheadline).fontWeight(.bold).foregroundStyle(.white)
            Divider().background(Color.white.opacity(0.1))
            reviewRow(icon: selectedType?.icon ?? "sparkles", label: "Type", value: selectedType?.title ?? "—", color: .blue)
            reviewRow(icon: "text.cursor", label: "Prompt", value: promptText.isEmpty ? "—" : String(promptText.prefix(50)) + (promptText.count > 50 ? "…" : ""), color: .purple)
            reviewRow(icon: "wrench.adjustable", label: "Tools", value: selectedTools.isEmpty ? "None" : "\(selectedTools.count) selected", color: .orange)
            reviewRow(icon: "flag.fill", label: "Priority", value: priority.rawValue, color: priority.color)
            reviewRow(icon: "folder.fill", label: "Project", value: selectedProject, color: .cyan)
        }
        .padding(16)
        .background(Color.white.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    @ViewBuilder
    private func reviewRow(icon: String, label: String, value: String, color: Color) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon).font(.caption).foregroundStyle(color)
                .frame(width: 24)
            Text(label).font(.subheadline).foregroundStyle(.gray)
            Spacer()
            Text(value).font(.subheadline).fontWeight(.medium).foregroundStyle(.white).lineLimit(1)
        }
    }

    @ViewBuilder
    private func stepHeader(title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).font(.title3).fontWeight(.bold).foregroundStyle(.white)
            Text(subtitle).font(.subheadline).foregroundStyle(.gray)
        }
    }

    // MARK: - Bottom Bar

    @ViewBuilder
    private var bottomBar: some View {
        VStack(spacing: 0) {
            Divider().background(Color.white.opacity(0.08))
            HStack(spacing: 12) {
                if step != .type {
                    Button {
                        withAnimation(.spring(duration: 0.3)) { step = step.previous }
                    } label: {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundStyle(.white)
                            .frame(width: 48, height: 48)
                            .background(Color.white.opacity(0.1))
                            .clipShape(Circle())
                    }
                }
                Button {
                    if step == .options {
                        showRun = true
                    } else {
                        withAnimation(.spring(duration: 0.3)) { step = step.next }
                    }
                } label: {
                    HStack(spacing: 8) {
                        if step == .options {
                            Image(systemName: "bolt.fill").font(.system(size: 14, weight: .bold))
                        }
                        Text(step == .options ? "Run Task" : "Continue")
                            .font(.subheadline).fontWeight(.bold)
                        if step != .options {
                            Image(systemName: "chevron.right").font(.system(size: 13, weight: .bold))
                        }
                    }
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(canContinue ? Color.white : Color.white.opacity(0.2))
                    .clipShape(Capsule())
                }
                .disabled(!canContinue)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
        }
        .background(Color(white: 0.07))
    }

    private var canContinue: Bool {
        switch step {
        case .type: return selectedType != nil
        case .prompt: return !promptText.trimmingCharacters(in: .whitespaces).isEmpty
        case .tools: return true
        case .options: return true
        }
    }
}

// MARK: - Type Card

struct TypeCard: View {
    let type: TaskType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: type.icon)
                    .font(.system(size: 26))
                    .foregroundStyle(isSelected ? .white : type.color)
                    .frame(width: 56, height: 56)
                    .background(
                        isSelected
                        ? LinearGradient(colors: type.gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
                        : LinearGradient(colors: [type.color.opacity(0.12), type.color.opacity(0.08)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                VStack(spacing: 3) {
                    Text(type.title).font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(.white)
                    Text(type.subtitle).font(.caption2).foregroundStyle(.gray)
                        .multilineTextAlignment(.center).lineLimit(2)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(16)
            .background(isSelected ? type.color.opacity(0.12) : Color.white.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .overlay(
                RoundedRectangle(cornerRadius: 18)
                    .stroke(isSelected ? type.color.opacity(0.6) : Color.clear, lineWidth: 1.5)
            )
        }
    }
}

// MARK: - Tool Toggle Row

struct ToolToggleRow: View {
    let tool: ToolOption
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: tool.icon)
                    .font(.system(size: 15))
                    .foregroundStyle(tool.color)
                    .frame(width: 38, height: 38)
                    .background(tool.color.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                VStack(alignment: .leading, spacing: 2) {
                    Text(tool.name).font(.subheadline).fontWeight(.medium).foregroundStyle(.white)
                    Text(tool.description).font(.caption).foregroundStyle(.gray)
                }
                Spacer()
                ZStack {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(isSelected ? Color.white : Color.white.opacity(0.1))
                        .frame(width: 22, height: 22)
                    if isSelected {
                        Image(systemName: "checkmark")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(.black)
                    }
                }
            }
            .padding(12)
            .background(isSelected ? Color.white.opacity(0.07) : Color.white.opacity(0.04))
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
    }
}

// MARK: - Models

enum BuilderStep: CaseIterable, Identifiable {
    case type, prompt, tools, options
    var id: Self { self }
    var label: String {
        switch self {
        case .type: return "Type"
        case .prompt: return "Prompt"
        case .tools: return "Tools"
        case .options: return "Options"
        }
    }
    var next: BuilderStep {
        let all = BuilderStep.allCases
        let idx = all.firstIndex(of: self) ?? 0
        return idx + 1 < all.count ? all[idx + 1] : self
    }
    var previous: BuilderStep {
        let all = BuilderStep.allCases
        let idx = all.firstIndex(of: self) ?? 0
        return idx > 0 ? all[idx - 1] : self
    }
}

struct TaskType: Identifiable, CaseIterable {
    static var allCases: [TaskType] = allTypes
    let id = UUID()
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let gradient: [Color]
    let suggestions: [String]
    let recommendedTools: [String]

    private static var allTypes: [TaskType] = [
        TaskType(title: "Website", subtitle: "Landing pages, apps & sites", icon: "globe", color: .blue, gradient: [.blue, .cyan],
                 suggestions: ["Build a SaaS landing page with hero, features, pricing sections", "Create a portfolio website for a photographer", "Design a product launch page with waitlist signup"],
                 recommendedTools: ["Web Browser", "Code Editor", "Vercel"]),
        TaskType(title: "Slides", subtitle: "Decks, presentations & pitches", icon: "rectangle.stack.fill", color: .purple, gradient: [.purple, .pink],
                 suggestions: ["Create a 12-slide investor pitch deck for a fintech startup", "Build a product demo presentation with animations", "Design a sales deck highlighting key differentiators"],
                 recommendedTools: ["Figma", "Google Drive"]),
        TaskType(title: "Research", subtitle: "Reports, analysis & insights", icon: "magnifyingglass", color: .orange, gradient: [.orange, .yellow],
                 suggestions: ["Analyze top 10 competitors in the AI productivity market", "Research market size and growth trends for B2B SaaS", "Find pricing benchmarks for enterprise software tools"],
                 recommendedTools: ["Web Browser", "Notion", "Spreadsheet"]),
        TaskType(title: "Content", subtitle: "Blogs, newsletters & copy", icon: "doc.text.fill", color: .green, gradient: [.green, .mint],
                 suggestions: ["Write a technical blog post about vector embeddings", "Draft a weekly newsletter for a startup audience", "Create 5 LinkedIn posts for product launch"],
                 recommendedTools: ["Web Browser", "Notion"]),
        TaskType(title: "Code", subtitle: "Scripts, APIs & automation", icon: "chevron.left.forwardslash.chevron.right", color: .cyan, gradient: [.cyan, .blue],
                 suggestions: ["Build a REST API with authentication in Node.js", "Create a Python script to scrape and analyze data", "Write a GitHub Actions workflow for CI/CD"],
                 recommendedTools: ["Code Editor", "GitHub", "Vercel"]),
        TaskType(title: "Images", subtitle: "AI-generated visuals & art", icon: "photo.fill", color: .pink, gradient: [.pink, .red],
                 suggestions: ["Generate 6 product hero images in photorealistic style", "Create a brand logo with 5 concept variations", "Design social media banners for product launch"],
                 recommendedTools: ["Web Browser"]),
        TaskType(title: "Data", subtitle: "Spreadsheets & visualizations", icon: "tablecells.fill", color: .teal, gradient: [.teal, .cyan],
                 suggestions: ["Build a 5-year financial model with 3 scenarios", "Create a competitive pricing matrix for 8 tools", "Analyze cohort retention data and visualize trends"],
                 recommendedTools: ["Spreadsheet", "Google Drive"]),
        TaskType(title: "Custom", subtitle: "Anything else you need", icon: "sparkles", color: .indigo, gradient: [.indigo, .purple],
                 suggestions: ["Automate my weekly reporting workflow", "Set up a monitoring system for my website", "Build a complete onboarding email sequence"],
                 recommendedTools: []),
    ]
}

struct ToolOption: Identifiable {
    let id = UUID()
    let name: String
    let icon: String
    let color: Color
    let description: String

    static let all: [ToolOption] = [
        ToolOption(name: "Web Browser", icon: "globe", color: .cyan, description: "Research, scrape and browse the web"),
        ToolOption(name: "Code Editor", icon: "chevron.left.forwardslash.chevron.right", color: .blue, description: "Write, edit and run code"),
        ToolOption(name: "GitHub", icon: "arrow.triangle.branch", color: .white, description: "Access and push to repositories"),
        ToolOption(name: "Notion", icon: "doc.text", color: .white, description: "Read and write Notion pages"),
        ToolOption(name: "Figma", icon: "paintbrush.fill", color: .purple, description: "Design and export visual assets"),
        ToolOption(name: "Google Drive", icon: "icloud.fill", color: .blue, description: "Read and save files to Drive"),
        ToolOption(name: "Slack", icon: "bubble.left.fill", color: .green, description: "Send messages and notifications"),
        ToolOption(name: "Spreadsheet", icon: "tablecells", color: .green, description: "Create and edit spreadsheets"),
        ToolOption(name: "Vercel", icon: "bolt.fill", color: .white, description: "Deploy and host web projects"),
    ]
}

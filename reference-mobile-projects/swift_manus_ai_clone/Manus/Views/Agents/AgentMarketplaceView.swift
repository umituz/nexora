import SwiftUI

// MARK: - Agent Model

struct AIAgent: Identifiable {
    let id = UUID()
    let name: String
    let tagline: String
    let description: String
    let icon: String
    let gradient: [Color]
    let category: AgentCategory
    let rating: Double
    let tasksRun: String
    let capabilities: [String]
    let tools: [String]
    var isActive: Bool
    let isPro: Bool
}

enum AgentCategory: String, CaseIterable {
    case all = "All"
    case content = "Content"
    case research = "Research"
    case code = "Code"
    case design = "Design"
    case data = "Data"
    case marketing = "Marketing"
}

// MARK: - Agent Marketplace

struct AgentMarketplaceView: View {
    @State private var selectedCategory: AgentCategory = .all
    @State private var searchText = ""
    @State private var selectedAgent: AIAgent? = nil
    @State private var agents: [AIAgent] = AgentSampleData.agents

    private var filtered: [AIAgent] {
        let byCat: [AIAgent] = selectedCategory == .all ? agents : agents.filter { $0.category == selectedCategory }
        if searchText.isEmpty { return byCat }
        return byCat.filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            $0.tagline.localizedCaseInsensitiveContains(searchText)
        }
    }

    private var activeAgents: [AIAgent] { agents.filter(\.isActive) }
    private var featuredAgents: [AIAgent] { agents.filter { $0.rating >= 4.8 } }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        activeStrip
                        featuredSection
                        categoryPicker
                        agentGrid
                        Spacer(minLength: 20)
                    }
                    .padding(.top, 8)
                }
            }
            .navigationTitle("Agents")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .searchable(text: $searchText, prompt: "Search agents")
            .sheet(item: $selectedAgent) { agent in
                AgentDetailSheet(agent: agent, onToggle: { toggleAgent(agent) })
            }
        }
    }

    // MARK: - Active Strip

    @ViewBuilder
    private var activeStrip: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("\(activeAgents.count) Active Agents", systemImage: "cpu.fill")
                    .font(.headline).fontWeight(.bold).foregroundStyle(.white)
                Spacer()
                Text("Manage")
                    .font(.caption).fontWeight(.semibold).foregroundStyle(.blue)
            }
            .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(activeAgents) { agent in
                        ActiveAgentChip(agent: agent)
                            .onTapGesture { selectedAgent = agent }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    // MARK: - Featured

    @ViewBuilder
    private var featuredSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Top Rated")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
                .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(featuredAgents.prefix(4)) { agent in
                        FeaturedAgentCard(agent: agent)
                            .onTapGesture { selectedAgent = agent }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    // MARK: - Category Picker

    @ViewBuilder
    private var categoryPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(AgentCategory.allCases, id: \.rawValue) { cat in
                    FilterChip(title: cat.rawValue, isSelected: selectedCategory == cat) {
                        withAnimation(.spring(duration: 0.3)) { selectedCategory = cat }
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }

    // MARK: - Agent Grid

    @ViewBuilder
    private var agentGrid: some View {
        LazyVStack(spacing: 12) {
            ForEach(filtered) { agent in
                AgentListRow(agent: agent, onToggle: { toggleAgent(agent) })
                    .onTapGesture { selectedAgent = agent }
            }
        }
        .padding(.horizontal, 20)
    }

    private func toggleAgent(_ agent: AIAgent) {
        if let idx = agents.firstIndex(where: { $0.id == agent.id }) {
            withAnimation(.spring(duration: 0.3)) {
                agents[idx].isActive.toggle()
            }
        }
    }
}

// MARK: - Active Agent Chip

struct ActiveAgentChip: View {
    let agent: AIAgent
    @State private var pulse = false

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .stroke(LinearGradient(colors: agent.gradient, startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 2)
                    .frame(width: 54, height: 54)
                    .scaleEffect(pulse ? 1.1 : 1.0)
                    .opacity(pulse ? 0.5 : 1)
                Image(systemName: agent.icon)
                    .font(.title3)
                    .foregroundStyle(.white)
                    .frame(width: 46, height: 46)
                    .background(LinearGradient(colors: agent.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .clipShape(Circle())
                Circle().fill(.green).frame(width: 10, height: 10)
                    .offset(x: 16, y: 16)
            }
            Text(agent.name)
                .font(.caption2).fontWeight(.medium).foregroundStyle(.white)
                .lineLimit(1)
        }
        .frame(width: 70)
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) { pulse = true }
        }
    }
}

// MARK: - Featured Agent Card

struct FeaturedAgentCard: View {
    let agent: AIAgent

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: agent.icon)
                    .font(.title2).foregroundStyle(.white)
                    .frame(width: 52, height: 52)
                    .background(LinearGradient(colors: agent.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .clipShape(RoundedRectangle(cornerRadius: 15))
                Spacer()
                if agent.isPro {
                    Text("PRO")
                        .font(.caption2).fontWeight(.bold).foregroundStyle(.black)
                        .padding(.horizontal, 7).padding(.vertical, 3)
                        .background(Color.yellow)
                        .clipShape(Capsule())
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(agent.name)
                    .font(.subheadline).fontWeight(.bold).foregroundStyle(.white)
                Text(agent.tagline)
                    .font(.caption).foregroundStyle(.gray).lineLimit(2)
            }

            HStack(spacing: 4) {
                Image(systemName: "star.fill").font(.caption2).foregroundStyle(.yellow)
                Text(String(format: "%.1f", agent.rating))
                    .font(.caption2).fontWeight(.semibold).foregroundStyle(.white)
                Text("· \(agent.tasksRun) tasks")
                    .font(.caption2).foregroundStyle(.gray)
            }
        }
        .padding(16)
        .frame(width: 180)
        .background(LinearGradient(colors: [Color(white: 0.12), Color(white: 0.07)], startPoint: .topLeading, endPoint: .bottomTrailing))
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.white.opacity(0.08), lineWidth: 1))
    }
}

// MARK: - Agent List Row

struct AgentListRow: View {
    let agent: AIAgent
    let onToggle: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: agent.icon)
                .font(.title3).foregroundStyle(.white)
                .frame(width: 50, height: 50)
                .background(LinearGradient(colors: agent.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .opacity(agent.isActive ? 1.0 : 0.5)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(agent.name)
                        .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                    if agent.isPro {
                        Text("PRO")
                            .font(.system(size: 9)).fontWeight(.bold).foregroundStyle(.black)
                            .padding(.horizontal, 5).padding(.vertical, 2)
                            .background(Color.yellow).clipShape(Capsule())
                    }
                }
                Text(agent.tagline)
                    .font(.caption).foregroundStyle(.gray).lineLimit(1)
                HStack(spacing: 4) {
                    Image(systemName: "star.fill").font(.system(size: 9)).foregroundStyle(.yellow)
                    Text(String(format: "%.1f", agent.rating))
                        .font(.caption2).foregroundStyle(.white)
                    Text("· \(agent.tasksRun)").font(.caption2).foregroundStyle(.gray)
                    Text("·").font(.caption2).foregroundStyle(.gray)
                    Text(agent.category.rawValue).font(.caption2).foregroundStyle(.blue.opacity(0.8))
                }
            }

            Spacer()

            Button(action: onToggle) {
                Text(agent.isActive ? "Active" : "Enable")
                    .font(.caption2).fontWeight(.semibold)
                    .foregroundStyle(agent.isActive ? .green : .blue)
                    .padding(.horizontal, 12).padding(.vertical, 6)
                    .background(agent.isActive ? Color.green.opacity(0.15) : Color.blue.opacity(0.15))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
        }
        .padding(14)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

// MARK: - Agent Detail Sheet

struct AgentDetailSheet: View {
    let agent: AIAgent
    let onToggle: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        agentHero
                        statsRow
                        capabilitiesSection
                        toolsSection
                        Spacer(minLength: 40)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill").foregroundStyle(.gray)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var agentHero: some View {
        VStack(spacing: 16) {
            ZStack {
                LinearGradient(colors: agent.gradient + [Color.black.opacity(0.6)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    .frame(height: 160)
                VStack(spacing: 14) {
                    Image(systemName: agent.icon)
                        .font(.system(size: 44)).foregroundStyle(.white)
                        .frame(width: 80, height: 80)
                        .background(.white.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 22))
                    Text(agent.name)
                        .font(.title2).fontWeight(.bold).foregroundStyle(.white)
                }
            }
            Text(agent.tagline)
                .font(.subheadline).foregroundStyle(.gray).multilineTextAlignment(.center)
                .padding(.horizontal, 24)
            Text(agent.description)
                .font(.caption).foregroundStyle(.gray.opacity(0.8))
                .multilineTextAlignment(.center).padding(.horizontal, 24)

            Button(action: { onToggle(); dismiss() }) {
                HStack(spacing: 8) {
                    Image(systemName: agent.isActive ? "pause.circle.fill" : "play.circle.fill")
                    Text(agent.isActive ? "Deactivate Agent" : "Activate Agent")
                        .fontWeight(.semibold)
                }
                .font(.subheadline)
                .foregroundStyle(agent.isActive ? .red : .black)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(agent.isActive ? Color.red.opacity(0.15) : Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .padding(.horizontal, 24)
        }
    }

    @ViewBuilder
    private var statsRow: some View {
        HStack(spacing: 0) {
            agentStat(value: String(format: "%.1f", agent.rating), label: "Rating", icon: "star.fill", color: .yellow)
            Divider().frame(height: 40).background(Color.white.opacity(0.1))
            agentStat(value: agent.tasksRun, label: "Tasks Run", icon: "bolt.fill", color: .blue)
            Divider().frame(height: 40).background(Color.white.opacity(0.1))
            agentStat(value: agent.category.rawValue, label: "Category", icon: "tag.fill", color: .purple)
        }
        .padding(.vertical, 12)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .padding(.horizontal, 20)
    }

    @ViewBuilder
    private func agentStat(value: String, label: String, icon: String, color: Color) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon).font(.caption).foregroundStyle(color)
            Text(value).font(.subheadline).fontWeight(.bold).foregroundStyle(.white)
            Text(label).font(.caption2).foregroundStyle(.gray)
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var capabilitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Capabilities")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            FlowLayout(items: agent.capabilities) { cap in
                HStack(spacing: 5) {
                    Image(systemName: "checkmark").font(.caption2).foregroundStyle(.green)
                    Text(cap).font(.caption).foregroundStyle(.white)
                }
                .padding(.horizontal, 12).padding(.vertical, 6)
                .background(Color.white.opacity(0.08))
                .clipShape(Capsule())
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
    }

    @ViewBuilder
    private var toolsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Works With")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            FlowLayout(items: agent.tools) { tool in
                Text(tool)
                    .font(.caption).foregroundStyle(.blue.opacity(0.9))
                    .padding(.horizontal, 12).padding(.vertical, 6)
                    .background(Color.blue.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
    }
}

// MARK: - Flow Layout Helper

struct FlowLayout<Item: Hashable, Content: View>: View {
    let items: [Item]
    let content: (Item) -> Content

    @State private var totalHeight: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            buildBody(in: geo)
                .background(heightSetter)
        }
        .frame(height: totalHeight)
    }

    private func buildBody(in geo: GeometryProxy) -> some View {
        var x: CGFloat = 0
        var y: CGFloat = 0
        return ZStack(alignment: .topLeading) {
            ForEach(items, id: \.self) { item in
                content(item)
                    .alignmentGuide(.leading) { d in
                        if x + d.width > geo.size.width {
                            x = 0; y -= d.height + 8
                        }
                        let result = x
                        if item == items.last { x = 0 } else { x += d.width + 8 }
                        return -result
                    }
                    .alignmentGuide(.top) { _ in
                        let result = y
                        if item == items.last { y = 0 }
                        return -result
                    }
            }
        }
    }

    private var heightSetter: some View {
        GeometryReader { geo in
            Color.clear.preference(key: HeightPreferenceKey.self, value: geo.size.height)
        }
        .onPreferenceChange(HeightPreferenceKey.self) { totalHeight = $0 }
    }
}

private struct HeightPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}

// MARK: - Sample Data

extension AgentSampleData {
    static let agents: [AIAgent] = [
        AIAgent(name: "WebCraft", tagline: "Builds full responsive websites from a single prompt", description: "Designs, codes, and deploys complete websites including HTML, CSS, JavaScript, and hosting via Vercel.", icon: "globe", gradient: [.blue, .cyan], category: .code, rating: 4.9, tasksRun: "12.4k", capabilities: ["HTML/CSS", "JavaScript", "Tailwind", "Responsive Design", "Vercel Deploy"], tools: ["Code Editor", "Vercel", "Web Browser"], isActive: true, isPro: false),
        AIAgent(name: "ResearchBot", tagline: "Deep market & competitor research at scale", description: "Collects, synthesizes, and reports on market trends, competitors, and user insights from across the web.", icon: "magnifyingglass", gradient: [.orange, .yellow], category: .research, rating: 4.8, tasksRun: "8.7k", capabilities: ["Web Scraping", "Sentiment Analysis", "Report Writing", "Data Collection"], tools: ["Web Browser", "Notion", "Spreadsheet"], isActive: true, isPro: false),
        AIAgent(name: "SlideForge", tagline: "Turn briefs into polished presentations instantly", description: "Creates professional slide decks with smart layouts, charts, and compelling copy from your brief.", icon: "rectangle.stack.fill", gradient: [.purple, .pink], category: .design, rating: 4.7, tasksRun: "6.1k", capabilities: ["Slide Design", "Chart Generation", "PDF Export", "PPTX Export"], tools: ["Figma", "Google Drive", "Spreadsheet"], isActive: true, isPro: false),
        AIAgent(name: "CodeReview", tagline: "Automated code reviews with actionable feedback", description: "Reviews pull requests, identifies bugs, suggests improvements, and writes test cases.", icon: "chevron.left.forwardslash.chevron.right", gradient: [.green, .teal], category: .code, rating: 4.9, tasksRun: "21.3k", capabilities: ["Bug Detection", "Code Quality", "Test Writing", "Documentation"], tools: ["GitHub", "VS Code"], isActive: false, isPro: true),
        AIAgent(name: "ContentFlow", tagline: "End-to-end content creation for any channel", description: "Writes blog posts, social media content, email campaigns, and newsletters aligned to your brand voice.", icon: "text.badge.star", gradient: [.red, .orange], category: .content, rating: 4.6, tasksRun: "15.8k", capabilities: ["Blog Writing", "Social Posts", "Email Sequences", "SEO Optimization"], tools: ["Notion", "Gmail", "Web Browser"], isActive: false, isPro: false),
        AIAgent(name: "DataViz", tagline: "Turn raw data into beautiful visual insights", description: "Processes CSVs and APIs to build interactive charts, dashboards, and analytics reports.", icon: "chart.line.uptrend.xyaxis", gradient: [.indigo, .blue], category: .data, rating: 4.8, tasksRun: "4.2k", capabilities: ["Chart Design", "CSV Processing", "Dashboard Build", "Trend Analysis"], tools: ["Spreadsheet", "Web Browser"], isActive: false, isPro: true),
        AIAgent(name: "AdGenius", tagline: "Launch-ready ad campaigns across all platforms", description: "Creates ad copy, visuals, targeting strategy, and A/B variants for Google, Meta, and LinkedIn.", icon: "megaphone.fill", gradient: [.pink, .red], category: .marketing, rating: 4.7, tasksRun: "9.5k", capabilities: ["Ad Copywriting", "Visual Creation", "Targeting Strategy", "A/B Testing"], tools: ["Canva", "Web Browser", "Notion"], isActive: true, isPro: false),
        AIAgent(name: "PhotoStudio", tagline: "Professional product photography, AI-generated", description: "Generates studio-quality product images with custom backgrounds, lighting, and brand styling.", icon: "camera.fill", gradient: [.teal, .green], category: .design, rating: 4.5, tasksRun: "3.3k", capabilities: ["Image Generation", "Background Removal", "Style Transfer", "Batch Export"], tools: ["Canva", "Google Drive"], isActive: false, isPro: true),
    ]
}

import SwiftUI

struct ToolsView: View {
    @State private var tools: [ToolCategory] = ProjectSampleData.toolCategories
    @State private var searchText = ""

    private var connectedCount: Int {
        tools.flatMap(\.tools).filter(\.connected).count
    }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    toolsBanner
                    toolsContent
                    Spacer(minLength: 20)
                }
                .padding(.horizontal, 20)
                .padding(.top, 4)
            }
            .background(Color.black)
            .navigationTitle("Integrations")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .searchable(text: $searchText, prompt: "Search tools")
        }
    }

    @ViewBuilder
    private var toolsBanner: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                Text("\(connectedCount) connected")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
                Text("of \(tools.flatMap(\.tools).count) available tools")
                    .font(.caption)
                    .foregroundStyle(.gray)
                ProgressView(value: Double(connectedCount), total: Double(tools.flatMap(\.tools).count))
                    .tint(.green)
                    .padding(.top, 4)
            }
            Spacer()
            ZStack {
                ForEach(Array(tools.flatMap(\.tools).filter(\.connected).prefix(3).enumerated()), id: \.offset) { idx, tool in
                    Image(systemName: tool.icon)
                        .font(.caption)
                        .foregroundStyle(tool.color)
                        .frame(width: 32, height: 32)
                        .background(Color.white.opacity(0.1))
                        .clipShape(Circle())
                        .offset(x: CGFloat(idx) * 14)
                }
            }
            .frame(width: 70)
        }
        .padding(20)
        .background(LinearGradient(colors: [Color(white: 0.13), Color(white: 0.08)], startPoint: .topLeading, endPoint: .bottomTrailing))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var toolsContent: some View {
        let allTools = tools.flatMap(\.tools)
        let filtered: [ToolCategory] = searchText.isEmpty ? tools : [
            ToolCategory(name: "Results", tools: allTools.filter { $0.name.localizedCaseInsensitiveContains(searchText) })
        ]
        ForEach(Array(filtered.enumerated()), id: \.element.id) { _, category in
            if !category.tools.isEmpty {
                ToolCategorySection(category: category, onToggle: { tool in toggleTool(tool) })
            }
        }
    }

    private func toggleTool(_ tool: Tool) {
        for catIdx in tools.indices {
            for toolIdx in tools[catIdx].tools.indices {
                if tools[catIdx].tools[toolIdx].id == tool.id {
                    tools[catIdx].tools[toolIdx].connected.toggle()
                    return
                }
            }
        }
    }
}

struct ToolCategorySection: View {
    let category: ToolCategory
    let onToggle: (Tool) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(category.name)
                .font(.headline)
                .foregroundStyle(.white)
            VStack(spacing: 1) {
                ForEach(category.tools) { tool in
                    NavigationLink(destination: ToolDetailView(tool: tool)) {
                        ToolRow(tool: tool, onToggle: { onToggle(tool) })
                    }
                    .buttonStyle(.plain)
                    if tool.id != category.tools.last?.id {
                        Divider()
                            .background(Color.white.opacity(0.08))
                            .padding(.leading, 64)
                    }
                }
            }
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 18))
        }
    }
}

struct ToolRow: View {
    let tool: Tool
    let onToggle: () -> Void
    @State private var toggling = false

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: tool.icon)
                .font(.body)
                .foregroundStyle(tool.connected ? tool.color : .gray)
                .frame(width: 40, height: 40)
                .background(tool.connected ? tool.color.opacity(0.15) : Color.white.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            VStack(alignment: .leading, spacing: 2) {
                Text(tool.name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text(tool.description)
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            Spacer()
            Button(action: {
                toggling = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { toggling = false }
                onToggle()
            }) {
                Text(tool.connected ? "Connected" : "Connect")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(tool.connected ? .green : .blue)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(tool.connected ? Color.green.opacity(0.15) : Color.blue.opacity(0.15))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .scaleEffect(toggling ? 0.9 : 1.0)
            .animation(.spring(duration: 0.2), value: toggling)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}

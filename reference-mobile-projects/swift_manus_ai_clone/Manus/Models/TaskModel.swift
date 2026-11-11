import SwiftUI

struct AgentTask: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let icon: String
    let status: TaskStatus
    let progress: Double
    let timeAgo: String
}

enum TaskStatus: String {
    case running = "Running"
    case completed = "Completed"
    case queued = "Queued"

    var color: Color {
        switch self {
        case .running: return .blue
        case .completed: return .green
        case .queued: return .orange
        }
    }

    var icon: String {
        switch self {
        case .running: return "circle.dotted"
        case .completed: return "checkmark.circle.fill"
        case .queued: return "clock.fill"
        }
    }

    var rawValue: String {
        switch self {
        case .running: return "Running"
        case .completed: return "Completed"
        case .queued: return "Queued"
        }
    }
}

struct QuickAction: Identifiable {
    let id = UUID()
    let title: String
    let icon: String
    let gradient: [Color]
}

struct ToolItem: Identifiable {
    let id = UUID()
    let name: String
    let icon: String
    let color: Color
    let connected: Bool
}

enum SampleData {
    static let recentTasks: [AgentTask] = [
        AgentTask(title: "Build landing page", subtitle: "Designing hero section with responsive layout", icon: "globe", status: .running, progress: 0.65, timeAgo: "2m ago"),
        AgentTask(title: "Market research report", subtitle: "Analyzing competitor pricing strategies", icon: "chart.bar.fill", status: .running, progress: 0.42, timeAgo: "8m ago"),
        AgentTask(title: "Investor pitch deck", subtitle: "12 slides generated successfully", icon: "rectangle.stack.fill", status: .completed, progress: 1.0, timeAgo: "1h ago"),
        AgentTask(title: "Product photography", subtitle: "Waiting for available agent", icon: "camera.fill", status: .queued, progress: 0.0, timeAgo: "Just now"),
    ]

    static let quickActions: [QuickAction] = [
        QuickAction(title: "Website", icon: "globe", gradient: [.blue, .cyan]),
        QuickAction(title: "Slides", icon: "rectangle.stack", gradient: [.purple, .pink]),
        QuickAction(title: "Research", icon: "magnifyingglass", gradient: [.orange, .yellow]),
        QuickAction(title: "Image", icon: "photo", gradient: [.green, .mint]),
        QuickAction(title: "Code", icon: "chevron.left.forwardslash.chevron.right", gradient: [.indigo, .blue]),
        QuickAction(title: "Audio", icon: "waveform", gradient: [.red, .orange]),
    ]

    static let connectedTools: [ToolItem] = [
        ToolItem(name: "GitHub", icon: "arrow.triangle.branch", color: .white, connected: true),
        ToolItem(name: "Notion", icon: "doc.text", color: .white, connected: true),
        ToolItem(name: "Slack", icon: "bubble.left.fill", color: .green, connected: true),
        ToolItem(name: "Figma", icon: "paintbrush", color: .purple, connected: false),
        ToolItem(name: "Gmail", icon: "envelope.fill", color: .red, connected: true),
        ToolItem(name: "Drive", icon: "icloud.fill", color: .blue, connected: false),
    ]
}

import SwiftUI

struct Project: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
    let gradient: [Color]
    let status: ProjectStatus
    let tasksCount: Int
    let completedCount: Int
    let lastUpdated: String
    let tags: [String]
}

enum ProjectStatus: String {
    case active = "Active"
    case completed = "Completed"
    case paused = "Paused"

    var color: Color {
        switch self {
        case .active: return .green
        case .completed: return .blue
        case .paused: return .orange
        }
    }
}

struct ToolCategory: Identifiable {
    let id = UUID()
    let name: String
    var tools: [Tool]
}

struct Tool: Identifiable {
    let id = UUID()
    let name: String
    let icon: String
    let color: Color
    var connected: Bool
    let description: String
}

struct SettingsSection: Identifiable {
    let id = UUID()
    let title: String
    let items: [SettingsItem]
}

struct SettingsItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let type: SettingsItemType
}

enum SettingsItemType {
    case toggle(Bool)
    case navigation
    case destructive
}

enum ProjectSampleData {
    static let projects: [Project] = [
        Project(title: "Nexus Landing Page", description: "Marketing site with hero, pricing, and CTA sections", icon: "globe", gradient: [.blue, .cyan], status: .active, tasksCount: 8, completedCount: 5, lastUpdated: "2m ago", tags: ["Web", "Design"]),
        Project(title: "Investor Pitch Deck", description: "12-slide deck covering vision, market, and financials", icon: "rectangle.stack.fill", gradient: [.purple, .pink], status: .completed, tasksCount: 12, completedCount: 12, lastUpdated: "1h ago", tags: ["Slides", "Finance"]),
        Project(title: "Market Research", description: "Competitor analysis across SaaS productivity tools", icon: "chart.bar.fill", gradient: [.orange, .yellow], status: .active, tasksCount: 6, completedCount: 2, lastUpdated: "15m ago", tags: ["Research"]),
        Project(title: "iOS App UI Kit", description: "Component library with dark-mode optimized styles", icon: "paintbrush.fill", gradient: [.green, .mint], status: .paused, tasksCount: 10, completedCount: 4, lastUpdated: "2d ago", tags: ["Design", "Code"]),
        Project(title: "Weekly Newsletter", description: "AI-curated tech digest sent every Monday morning", icon: "envelope.fill", gradient: [.red, .orange], status: .active, tasksCount: 4, completedCount: 3, lastUpdated: "5h ago", tags: ["Content"]),
    ]

    static let toolCategories: [ToolCategory] = [
        ToolCategory(name: "Development", tools: [
            Tool(name: "GitHub", icon: "arrow.triangle.branch", color: .white, connected: true, description: "Code repos & CI/CD"),
            Tool(name: "VS Code", icon: "chevron.left.forwardslash.chevron.right", color: .blue, connected: false, description: "Code editor integration"),
            Tool(name: "Vercel", icon: "bolt.fill", color: .white, connected: true, description: "Deploy & hosting"),
        ]),
        ToolCategory(name: "Productivity", tools: [
            Tool(name: "Notion", icon: "doc.text.fill", color: .white, connected: true, description: "Notes & wikis"),
            Tool(name: "Slack", icon: "bubble.left.fill", color: Color(red: 0.44, green: 0.13, blue: 0.65), connected: true, description: "Team messaging"),
            Tool(name: "Google Drive", icon: "icloud.fill", color: .blue, connected: false, description: "File storage"),
        ]),
        ToolCategory(name: "Design", tools: [
            Tool(name: "Figma", icon: "paintbrush.fill", color: .purple, connected: false, description: "UI/UX design"),
            Tool(name: "Canva", icon: "photo.fill", color: .cyan, connected: true, description: "Visual content"),
        ]),
        ToolCategory(name: "Communication", tools: [
            Tool(name: "Gmail", icon: "envelope.fill", color: .red, connected: true, description: "Email & inbox"),
            Tool(name: "Calendar", icon: "calendar", color: .red, connected: true, description: "Scheduling"),
        ]),
    ]

    static let settingsSections: [SettingsSection] = [
        SettingsSection(title: "Agent", items: [
            SettingsItem(title: "Agent Mode", subtitle: "Full Autonomy", icon: "cpu.fill", color: .blue, type: .navigation),
            SettingsItem(title: "Task Notifications", subtitle: "Alerts for completions & errors", icon: "bell.fill", color: .red, type: .toggle(true)),
            SettingsItem(title: "Auto-Execute", subtitle: "Run approved tasks automatically", icon: "bolt.fill", color: .yellow, type: .toggle(false)),
        ]),
        SettingsSection(title: "Account", items: [
            SettingsItem(title: "Profile", subtitle: "Manage your account details", icon: "person.fill", color: .purple, type: .navigation),
            SettingsItem(title: "Subscription", subtitle: "Nexus Pro — $29/mo", icon: "star.fill", color: .orange, type: .navigation),
            SettingsItem(title: "Usage & Limits", subtitle: "2,340 / 5,000 credits used", icon: "chart.pie.fill", color: .green, type: .navigation),
        ]),
        SettingsSection(title: "Preferences", items: [
            SettingsItem(title: "Appearance", subtitle: "Dark Mode", icon: "moon.fill", color: .indigo, type: .navigation),
            SettingsItem(title: "Language", subtitle: "English", icon: "globe", color: .cyan, type: .navigation),
        ]),
        SettingsSection(title: "Data", items: [
            SettingsItem(title: "Export Data", subtitle: "Download your history", icon: "square.and.arrow.up.fill", color: .teal, type: .navigation),
            SettingsItem(title: "Clear History", subtitle: "Remove all task history", icon: "trash.fill", color: .red, type: .destructive),
        ]),
    ]
}

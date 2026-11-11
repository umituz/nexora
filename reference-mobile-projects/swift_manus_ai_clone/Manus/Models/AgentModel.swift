import SwiftUI

// MARK: - Agent Step

struct AgentStep: Identifiable {
    let id = UUID()
    let title: String
    let detail: String
    let icon: String
    let status: AgentStepStatus
    let duration: String?
    let toolUsed: String?
}

enum AgentStepStatus {
    case completed, running, pending, failed

    var color: Color {
        switch self {
        case .completed: return .green
        case .running: return .blue
        case .pending: return Color.white.opacity(0.3)
        case .failed: return .red
        }
    }

    var icon: String {
        switch self {
        case .completed: return "checkmark.circle.fill"
        case .running: return "circle.dotted"
        case .pending: return "circle"
        case .failed: return "xmark.circle.fill"
        }
    }
}

// MARK: - Agent Output

struct AgentOutput: Identifiable {
    let id = UUID()
    let type: OutputType
    let title: String
    let preview: String
    let icon: String
    let color: Color

    enum OutputType {
        case webpage, document, image, code, research, spreadsheet
    }
}

// MARK: - Extended Task

struct TaskDetail: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let icon: String
    let gradient: [Color]
    let status: TaskStatus
    let progress: Double
    let createdAt: String
    let estimatedTime: String
    let steps: [AgentStep]
    let outputs: [AgentOutput]
    let projectName: String?
    let toolsUsed: [String]
}

// MARK: - Sample Task Details

enum AgentSampleData {
    static let taskDetails: [TaskDetail] = [
        TaskDetail(
            title: "Build Landing Page",
            subtitle: "Designing a responsive marketing site with hero, features, and pricing",
            icon: "globe",
            gradient: [.blue, .cyan],
            status: .running,
            progress: 0.65,
            createdAt: "2 min ago",
            estimatedTime: "~4 min remaining",
            steps: [
                AgentStep(title: "Analyzing requirements", detail: "Parsed task description and identified key sections needed", icon: "doc.text.magnifyingglass", status: .completed, duration: "3s", toolUsed: nil),
                AgentStep(title: "Research & inspiration", detail: "Scanned 12 top-performing SaaS landing pages for patterns", icon: "magnifyingglass", status: .completed, duration: "18s", toolUsed: "Web Browser"),
                AgentStep(title: "Generating HTML/CSS", detail: "Building responsive layout with Tailwind CSS framework", icon: "chevron.left.forwardslash.chevron.right", status: .running, duration: nil, toolUsed: "Code Editor"),
                AgentStep(title: "Add copy & content", detail: "Writing hero headline, feature descriptions, and CTA text", icon: "text.cursor", status: .pending, duration: nil, toolUsed: nil),
                AgentStep(title: "Optimize & deploy", detail: "Minify assets and push to Vercel for live preview", icon: "bolt.fill", status: .pending, duration: nil, toolUsed: "Vercel"),
            ],
            outputs: [
                AgentOutput(type: .webpage, title: "Landing Page Preview", preview: "Live at nexus-landing.vercel.app", icon: "globe", color: .blue),
                AgentOutput(type: .code, title: "Source Code", preview: "index.html · styles.css · 847 lines", icon: "chevron.left.forwardslash.chevron.right", color: .purple),
            ],
            projectName: "Nexus Landing Page",
            toolsUsed: ["Web Browser", "Code Editor", "Vercel"]
        ),
        TaskDetail(
            title: "Market Research Report",
            subtitle: "Deep competitor analysis across SaaS productivity tools",
            icon: "chart.bar.fill",
            gradient: [.orange, .yellow],
            status: .running,
            progress: 0.42,
            createdAt: "8 min ago",
            estimatedTime: "~11 min remaining",
            steps: [
                AgentStep(title: "Define research scope", detail: "Identified 8 key competitors in the AI productivity space", icon: "scope", status: .completed, duration: "5s", toolUsed: nil),
                AgentStep(title: "Data collection", detail: "Scraping pricing pages, feature lists, and user reviews", icon: "arrow.down.circle", status: .running, duration: nil, toolUsed: "Web Browser"),
                AgentStep(title: "Sentiment analysis", detail: "Processing 2,400 G2 and Capterra reviews", icon: "brain.head.profile", status: .pending, duration: nil, toolUsed: nil),
                AgentStep(title: "Build comparison matrix", detail: "Creating feature-by-feature comparison table", icon: "tablecells", status: .pending, duration: nil, toolUsed: "Spreadsheet"),
                AgentStep(title: "Write executive summary", detail: "Synthesize findings into actionable insights", icon: "doc.text", status: .pending, duration: nil, toolUsed: "Notion"),
            ],
            outputs: [],
            projectName: "Market Research",
            toolsUsed: ["Web Browser", "Spreadsheet", "Notion"]
        ),
        TaskDetail(
            title: "Investor Pitch Deck",
            subtitle: "12-slide presentation covering vision, market opportunity, and financials",
            icon: "rectangle.stack.fill",
            gradient: [.purple, .pink],
            status: .completed,
            progress: 1.0,
            createdAt: "1h ago",
            estimatedTime: "Completed in 7m 23s",
            steps: [
                AgentStep(title: "Outline structure", detail: "Created 12-slide flow: problem → solution → market → traction", icon: "list.bullet", status: .completed, duration: "8s", toolUsed: nil),
                AgentStep(title: "Market size research", detail: "TAM/SAM/SOM analysis for AI automation sector", icon: "magnifyingglass", status: .completed, duration: "2m 10s", toolUsed: "Web Browser"),
                AgentStep(title: "Design slides", detail: "Applied brand colors, typography, and layout to all slides", icon: "paintbrush.fill", status: .completed, duration: "3m 45s", toolUsed: "Figma"),
                AgentStep(title: "Generate charts", detail: "Revenue projections, growth curves, competitive positioning", icon: "chart.line.uptrend.xyaxis", status: .completed, duration: "52s", toolUsed: "Spreadsheet"),
                AgentStep(title: "Export & deliver", detail: "Exported PDF and PPTX, uploaded to Google Drive", icon: "square.and.arrow.up", status: .completed, duration: "28s", toolUsed: "Google Drive"),
            ],
            outputs: [
                AgentOutput(type: .document, title: "Pitch Deck PDF", preview: "12 slides · 4.2 MB · Ready to share", icon: "doc.richtext", color: .purple),
                AgentOutput(type: .document, title: "PowerPoint File", preview: "pitch_deck_v1.pptx · 8.7 MB", icon: "rectangle.stack.fill", color: .pink),
                AgentOutput(type: .spreadsheet, title: "Financial Model", preview: "5-year projections · 3 scenarios", icon: "tablecells", color: .green),
            ],
            projectName: "Investor Pitch Deck",
            toolsUsed: ["Figma", "Web Browser", "Google Drive", "Spreadsheet"]
        ),
    ]
}

import SwiftUI

struct VideoTemplate: Identifiable {
    let id = UUID()
    let name: String
    let description: String
    let category: Category
    let duration: String
    let resolution: String
    let accentColor: String
    let icon: String
    let tags: [String]

    enum Category: String, CaseIterable {
        case tech = "Technology"
        case creative = "Creative"
        case developer = "Developer"
        case business = "Business"
        case minimal = "Minimal"

        var icon: String {
            switch self {
            case .tech: return "cpu.fill"
            case .creative: return "paintbrush.fill"
            case .developer: return "chevron.left.forwardslash.chevron.right"
            case .business: return "chart.bar.fill"
            case .minimal: return "square.grid.2x2.fill"
            }
        }

        var color: String {
            switch self {
            case .tech: return "blue"
            case .creative: return "pink"
            case .developer: return "green"
            case .business: return "orange"
            case .minimal: return "gray"
            }
        }
    }

    static let all: [VideoTemplate] = [
        VideoTemplate(
            name: "Tech Showcase",
            description: "Showcase your tech projects with modern animations and code visuals.",
            category: .tech,
            duration: "0:45",
            resolution: "1920x1080",
            accentColor: "blue",
            icon: "cpu.fill",
            tags: ["Code", "Animation", "Gradient"]
        ),
        VideoTemplate(
            name: "Creative Flow",
            description: "Discover your design files with smooth transitions and artistic flair.",
            category: .creative,
            duration: "1:00",
            resolution: "1920x1080",
            accentColor: "pink",
            icon: "paintbrush.fill",
            tags: ["Design", "Flow", "Color"]
        ),
        VideoTemplate(
            name: "Developer Reel",
            description: "Showcase your codebase with stunning visual effects and metrics.",
            category: .developer,
            duration: "1:15",
            resolution: "1920x1080",
            accentColor: "green",
            icon: "chevron.left.forwardslash.chevron.right",
            tags: ["Repository", "Commit", "Code"]
        ),
        VideoTemplate(
            name: "Business Report",
            description: "Transform your files into professional presentation format.",
            category: .business,
            duration: "2:00",
            resolution: "1920x1080",
            accentColor: "orange",
            icon: "chart.bar.fill",
            tags: ["Report", "Charts", "Corporate"]
        ),
        VideoTemplate(
            name: "Minimal Showcase",
            description: "Highlight your content with a clean and elegant presentation.",
            category: .minimal,
            duration: "0:30",
            resolution: "1920x1080",
            accentColor: "gray",
            icon: "square.grid.2x2.fill",
            tags: ["Minimal", "Clean", "Simple"]
        ),
        VideoTemplate(
            name: "Vertical Story",
            description: "Tell your story in 9:16 vertical format for social media.",
            category: .creative,
            duration: "0:30",
            resolution: "1080x1920",
            accentColor: "purple",
            icon: "iphone",
            tags: ["Vertical", "Social", "Story"]
        )
    ]
}

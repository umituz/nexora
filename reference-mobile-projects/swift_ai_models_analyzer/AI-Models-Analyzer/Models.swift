import Foundation

struct AIModel: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let provider: String
    let category: String
    let iconSymbol: String
    let parameterCount: String
    let rating: Double
    let trending: Bool
    let color: String
    var contextWindow: String = "N/A"
    var license: String = "Proprietary"
    var releaseDate: String = "2025"
    var inputCost: String = "N/A"
    var outputCost: String = "N/A"
}

struct UseCase: Identifiable {
    let id = UUID()
    let title: String
    let industry: String
    let complexity: String
    let iconSymbol: String
    let description: String
}

struct DiscussionThread: Identifiable {
    let id = UUID()
    let title: String
    let author: String
    let replies: Int
    let likes: Int
    let timeAgo: String
    let tag: String
}

struct NewsItem: Identifiable {
    let id = UUID()
    let title: String
    let source: String
    let timeAgo: String
    let iconSymbol: String
    var category: String = "General"
    var readTime: String = "3 min"
    var summary: String = ""
    var isBookmarked: Bool = false
}

struct TrendingTopic: Identifiable {
    let id = UUID()
    let title: String
    let count: Int
    let icon: String
    let color: String
}

struct LeaderboardEntry: Identifiable {
    let id = UUID()
    let rank: Int
    let modelName: String
    let provider: String
    let score: Double
    let change: Int // positive = up, negative = down
}

struct ChartDataPoint: Identifiable {
    let id = UUID()
    let label: String
    let value: Double
}

enum Tab: String, CaseIterable {
    case home = "Home"
    case models = "Models"
    case discover = "Discover"
    case useCases = "Use Cases"
    case community = "Community"

    var icon: String {
        switch self {
        case .home: return "house.fill"
        case .models: return "cpu.fill"
        case .discover: return "newspaper.fill"
        case .useCases: return "lightbulb.fill"
        case .community: return "bubble.left.and.bubble.right.fill"
        }
    }
}

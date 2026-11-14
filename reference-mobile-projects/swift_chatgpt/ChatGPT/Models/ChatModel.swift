import Foundation

enum ChatModel: String, CaseIterable, Identifiable, Codable {
    case appleIntelligence = "Apple Intelligence"
    case gpt4o = "GPT-4o"
    case gpt4oMini = "GPT-4o mini"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .appleIntelligence:
            return L10n.AI.Model.appleIntelligence
        case .gpt4o:
            return L10n.AI.Model.gpt4o
        case .gpt4oMini:
            return L10n.AI.Model.gpt4oMini
        }
    }

    var subtitle: String {
        switch self {
        case .appleIntelligence:
            return L10n.AI.Model.Subtitle.onDevice
        case .gpt4o:
            return L10n.AI.Model.Subtitle.fourOh
        case .gpt4oMini:
            return L10n.AI.Model.Subtitle.fourOhMini
        }
    }

    var iconName: String {
        switch self {
        case .appleIntelligence:
            return "apple.intelligence"
        case .gpt4o, .gpt4oMini:
            return "brain"
        }
    }
}

import Foundation
import SwiftUI

// MARK: - AI Service Factory
enum AIServiceFactory {
    static func createService(for model: ChatModel) -> any AIServiceProtocol {
        switch model {
        case .appleIntelligence:
            return AppleIntelligenceService.shared
        case .gpt4o, .gpt4oMini:
            return OpenAIService.shared
        }
    }

    static var allServices: [any AIServiceProtocol] {
        [
            AppleIntelligenceService.shared,
            OpenAIService.shared,
            ClaudeService.shared
        ]
    }
}

// MARK: - Service Health Monitor
@MainActor
final class ServiceHealthMonitor: ObservableObject {
    static let shared = ServiceHealthMonitor()

    @Published private(set) var servicesStatus: [String: Bool] = [:]

    private init() {
        Task { await monitorServices() }
    }

    func monitorServices() async {
        for service in AIServiceFactory.allServices {
            await service.checkAvailability()

            if let appleService = service as? AppleIntelligenceService {
                servicesStatus["apple"] = appleService.isAvailable
            } else if let openAIService = service as? OpenAIService {
                servicesStatus["openai"] = openAIService.isAvailable
            } else if let claudeService = service as? ClaudeService {
                servicesStatus["claude"] = claudeService.isAvailable
            }
        }
    }

    func isServiceAvailable(_ model: ChatModel) -> Bool {
        switch model {
        case .appleIntelligence:
            return servicesStatus["apple"] ?? false
        case .gpt4o, .gpt4oMini:
            return servicesStatus["openai"] ?? false
        }
    }
}

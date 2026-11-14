import Foundation
import SwiftUI

// MARK: - Service Container
@MainActor
final class ServiceContainer: ObservableObject {
    static let shared = ServiceContainer()

    // MARK: - Services

    private(set) var aiService: any AIServiceProtocol
    private(set) var storageService: any StorageServiceProtocol
    private(set) var subscriptionService: any SubscriptionServiceProtocol

    // MARK: - Singleton Instances

    @Published var ai: AppleIntelligenceService {
        didSet { aiService = ai }
    }

    @Published var storage: LocalStorageService {
        didSet { storageService = storage }
    }

    @Published var subscription: RevenueCatService {
        didSet { subscriptionService = subscription }
    }

    // MARK: - Initialization

    private init() {
        let aiRef = AppleIntelligenceService.shared
        let storageRef = LocalStorageService.shared
        let subRef = RevenueCatService.shared

        self.ai = aiRef
        self.storage = storageRef
        self.subscription = subRef

        self.aiService = aiRef
        self.storageService = storageRef
        self.subscriptionService = subRef

        Task { await subRef.configure() }
    }

    // MARK: - Service Resolution

    func resolveAI() -> any AIServiceProtocol {
        aiService
    }

    func resolveStorage() -> any StorageServiceProtocol {
        storageService
    }

    func resolveSubscription() -> any SubscriptionServiceProtocol {
        subscriptionService
    }

    func resolveChat() -> ChatViewModel {
        ChatViewModel(aiService: aiService, storageService: storageService)
    }

    // MARK: - Service Registration (for testing)

    func registerAI(_ service: any AIServiceProtocol) {
        aiService = service
        if let appleService = service as? AppleIntelligenceService {
            ai = appleService
        }
    }

    func registerStorage(_ service: any StorageServiceProtocol) {
        storageService = service
        if let localService = service as? LocalStorageService {
            storage = localService
        }
    }

    func registerSubscription(_ service: any SubscriptionServiceProtocol) {
        subscriptionService = service
        if let revenueService = service as? RevenueCatService {
            subscription = revenueService
        }
    }
}

// MARK: - Environment Key
struct ServiceContainerKey: EnvironmentKey {
    static var defaultValue: ServiceContainer {
        .shared
    }
}

extension EnvironmentValues {
    var services: ServiceContainer {
        get { self[ServiceContainerKey.self] }
        set { self[ServiceContainerKey.self] = newValue }
    }
}

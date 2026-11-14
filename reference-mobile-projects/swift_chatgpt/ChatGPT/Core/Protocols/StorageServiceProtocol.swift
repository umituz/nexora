import Foundation
import SwiftUI

// MARK: - Storage Service Protocol
@MainActor
protocol StorageServiceProtocol: ObservableObject {
    var conversations: [Conversation] { get }
    var currentUser: AppUser { get }

    func loadConversations() -> AppResult<Void>
    func createConversation(title: String, model: String) -> Conversation
    func deleteConversation(_ id: UUID) -> AppResult<Void>
    func updateConversation(_ conversation: Conversation) -> AppResult<Void>
    func saveMessage(_ message: ChatMessage, conversationId: UUID) -> AppResult<Void>
    func loadMessages(for conversationId: UUID) -> AppResult<[ChatMessage]>
    func updateCurrentUser(_ user: AppUser) -> AppResult<Void>
}

// MARK: - Subscription Service Protocol
@MainActor
protocol SubscriptionServiceProtocol: ObservableObject {
    var isProUser: Bool { get }
    var subscriptionStatus: SubscriptionStatus { get }

    func configure() async
    func checkSubscriptionStatus() async -> AppResult<SubscriptionStatus>
    func restorePurchases() async -> AppResult<Void>
}

// MARK: - Subscription Status
enum SubscriptionStatus {
    case notSubscribed
    case subscribed(tier: String)
    case expired
    case unknown

    var isActive: Bool {
        if case .subscribed = self {
            return true
        }
        return false
    }
}

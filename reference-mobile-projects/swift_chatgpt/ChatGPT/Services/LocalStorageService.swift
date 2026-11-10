import Foundation
import SwiftUI

// MARK: - Local Storage Service
@MainActor
final class LocalStorageService: StorageServiceProtocol {
    static let shared = LocalStorageService()

    @Published var conversations: [Conversation] = []
    @Published var currentUser: AppUser

    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = .prettyPrinted
        return encoder
    }()

    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    private init() {
        currentUser = Self.loadOrCreateUser()
        loadConversations()
    }

    // MARK: - StorageServiceProtocol

    func loadConversations() -> AppResult<Void> {
        guard let data = StorageHelper.getData(StorageKeys.conversations) else {
            conversations = []
            return .success(())
        }

        do {
            conversations = try decoder.decode([Conversation].self, from: data)
                .sorted { $0.updatedAt > $1.updatedAt }
            return .success(())
        } catch {
            conversations = []
            return .failure(.storageFailure(reason: "Failed to decode conversations"))
        }
    }

    func createConversation(title: String, model: String) -> Conversation {
        let conv = Conversation(
            id: UUID(),
            userId: currentUser.id,
            title: title,
            model: model
        )
        conversations.insert(conv, at: 0)
        saveConversations()
        return conv
    }

    func deleteConversation(_ id: UUID) -> AppResult<Void> {
        conversations.removeAll { $0.id == id }
        saveConversations()
        return .success(())
    }

    func saveMessage(_ message: ChatMessage, conversationId: UUID) -> AppResult<Void> {
        var messages = loadMessagesInternal(for: conversationId)
        messages.append(message)

        return ResultHelper.catch {
            let data = try encoder.encode(messages)
            StorageHelper.set(data, forKey: messageKey(for: conversationId))
        }
    }

    func loadMessages(for conversationId: UUID) -> AppResult<[ChatMessage]> {
        let messages = loadMessagesInternal(for: conversationId)
        return .success(messages)
    }

    func updateCurrentUser(_ user: AppUser) -> AppResult<Void> {
        currentUser = user
        return ResultHelper.catch {
            let data = try encoder.encode(user)
            StorageHelper.set(data, forKey: StorageKeys.currentUser)
        }
    }

    func updateConversation(_ conversation: Conversation) -> AppResult<Void> {
        if let index = conversations.firstIndex(where: { $0.id == conversation.id }) {
            conversations[index] = conversation
            saveConversations()
            return .success(())
        }
        return .failure(.storageFailure(reason: "Conversation not found"))
    }

    // MARK: - Private Helpers

    private func loadMessagesInternal(for conversationId: UUID) -> [ChatMessage] {
        guard let data = StorageHelper.getData(messageKey(for: conversationId)) else {
            return []
        }

        return (try? decoder.decode([ChatMessage].self, from: data)) ?? []
    }

    private func messageKey(for conversationId: UUID) -> String {
        "\(StorageKeys.conversations)_messages_\(conversationId.uuidString)"
    }

    private func saveConversations() {
        let data = ResultHelper.catch { try encoder.encode(conversations) }
        if case .success(let encodedData) = data {
            StorageHelper.set(encodedData, forKey: StorageKeys.conversations)
        }
    }

    private static func loadOrCreateUser() -> AppUser {
        guard let data = StorageHelper.getData(StorageKeys.currentUser) else {
            return createAndSaveNewUser()
        }

        guard let user = try? JSONDecoder().decode(AppUser.self, from: data) else {
            return createAndSaveNewUser()
        }

        return user
    }

    private static func createAndSaveNewUser() -> AppUser {
        let newUser = AppUser(
            id: UUID(),
            displayName: "User",
            createdAt: Date()
        )
        let data = ResultHelper.catch { try JSONEncoder().encode(newUser) }
        if case .success(let encodedData) = data {
            StorageHelper.set(encodedData, forKey: StorageKeys.currentUser)
        }
        return newUser
    }
}

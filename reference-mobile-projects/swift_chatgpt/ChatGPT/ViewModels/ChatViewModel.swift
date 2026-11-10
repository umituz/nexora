import Foundation
import SwiftUI

// MARK: - Chat View Model
@MainActor
final class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var currentConversation: Conversation?
    @Published var isGenerating = false
    @Published var currentModel: ChatModel = .appleIntelligence

    private(set) var aiService: any AIServiceProtocol
    private(set) var storageService: any StorageServiceProtocol

    init(aiService: any AIServiceProtocol, storageService: any StorageServiceProtocol) {
        self.aiService = aiService
        self.storageService = storageService
    }

    static func make() -> ChatViewModel {
        let services = ServiceContainer.shared
        return ChatViewModel(
            aiService: services.resolveAI(),
            storageService: services.resolveStorage()
        )
    }

    // MARK: - Conversation Management

    func startNewConversation() {
        currentConversation = nil
        messages = []
        currentModel = .appleIntelligence
    }

    func loadConversation(_ conversation: Conversation) {
        currentConversation = conversation
        currentModel = ChatModel(rawValue: conversation.model) ?? .appleIntelligence

        switch storageService.loadMessages(for: conversation.id) {
        case .success(let loadedMessages):
            messages = loadedMessages
        case .failure(let error):
            Logger.shared.logStorageError(error)
            messages = []
        }
    }

    func ensureConversation() -> Conversation {
        if let conv = currentConversation { return conv }

        let conv = storageService.createConversation(
            title: L10n.Conversation.newTitle,
            model: currentModel.rawValue
        )
        currentConversation = conv
        return conv
    }

    func switchModel(to model: ChatModel) {
        currentModel = model
        if let conv = currentConversation {
            var updated = conv
            updated.model = model.rawValue
            // Update conversation in storage
            _ = storageService.updateConversation(updated)
        }
    }

    func deleteConversation(_ conversation: Conversation) {
        _ = storageService.deleteConversation(conversation.id)
        if currentConversation?.id == conversation.id {
            startNewConversation()
        }
    }

    // MARK: - Message Management

    func sendMessage(_ text: String) {
        guard MessageUtils.canSend(text) else { return }

        let conv = ensureConversation()
        let cleanedText = MessageUtils.clean(text)
        let userMsg = ChatMessage(id: UUID(), role: .user, content: cleanedText)
        messages.append(userMsg)

        switch storageService.saveMessage(userMsg, conversationId: conv.id) {
        case .success: break
        case .failure(let error):
            Logger.shared.logStorageError(error)
        }

        if messages.count == 1, currentConversation?.title == L10n.Conversation.newTitle {
            Task { await generateAutoTitle(for: conv, from: cleanedText) }
        }

        Task { await streamResponse(for: conv, messageId: UUID()) }
    }

    func deleteMessage(_ message: ChatMessage) {
        messages.removeAll { $0.id == message.id }
        // Note: Full implementation would also delete from storage
    }

    func clearChat() {
        messages = []
        if let conv = currentConversation {
            // Delete all messages for this conversation
            // Full implementation would clear from storage
        }
    }

    func copyMessage(_ message: ChatMessage) {
        #if os(iOS)
        UIPasteboard.general.string = message.content
        #elseif os(macOS)
        NSPasteboard.general.setString(message.content, forType: .string)
        #endif
    }

    // MARK: - Private Methods

    private func streamResponse(for conversation: Conversation, messageId: UUID) async {
        isGenerating = true
        let stream = aiService.streamMessage(messages.last?.content ?? "")
        var fullResponse = ""

        for await result in stream {
            switch result {
            case .success(let chunk):
                fullResponse = chunk
                updateMessage(id: messageId, content: fullResponse)

            case .failure(let error):
                fullResponse = error.localizedDescription
                updateMessage(id: messageId, content: fullResponse)
            }
        }

        if fullResponse.isEmpty {
            fullResponse = L10n.ErrorMessages.emptyResponse
            updateMessage(id: messageId, content: fullResponse)
        }

        let finalMsg = ChatMessage(id: messageId, role: .assistant, content: fullResponse)
        switch storageService.saveMessage(finalMsg, conversationId: conversation.id) {
        case .success: break
        case .failure(let error):
            Logger.shared.logStorageError(error)
        }

        isGenerating = false
    }

    private func updateMessage(id: UUID, content: String) {
        let updated = ChatMessage(id: id, role: .assistant, content: content)

        if let idx = messages.firstIndex(where: { $0.id == id }) {
            messages[idx] = updated
        } else {
            messages.append(updated)
        }
    }

    private func generateAutoTitle(for conversation: Conversation, from firstMessage: String) async {
        let title = StringUtils.title(from: firstMessage, maxLength: 30)
        var updated = conversation
        updated.title = title
        currentConversation = updated
        // Full implementation would save to storage
    }
}

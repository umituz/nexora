import Foundation
import SwiftUI

// MARK: - Claude Service
@MainActor
final class ClaudeService: AIServiceProtocol {
    static let shared = ClaudeService()

    @Published var isAvailable = true
    @Published var isGenerating = false

    private let network: NetworkServiceProtocol
    private let apiKey: String?

    private init(network: NetworkServiceProtocol = NetworkService.shared) {
        self.network = network
        self.apiKey = ProcessInfo.processInfo.environment["ANTHROPIC_API_KEY"]
    }

    // MARK: - AIServiceProtocol

    func checkAvailability() async {
        isAvailable = apiKey != nil
    }

    func sendMessage(_ text: String) async -> AppResult<String> {
        guard let apiKey = apiKey else {
            return .failure(.aiServiceUnavailable)
        }

        isGenerating = true
        defer { isGenerating = false }

        let request = ClaudeRequest(
            model: "claude-sonnet-4-6-20250514",
            messages: [
                ClaudeMessage(role: "user", content: text)
            ],
            system: L10n.AIServiceConfig.systemPrompt
        )

        do {
            let data = try encoder.encode(request)
            let response: ClaudeResponse = try await network.fetch(
                "/v1/messages",
                method: .post,
                body: data
            ).get()

            return .success(response.content.first?.text ?? "")
        } catch {
            Logger.shared.logError(error, message: "Claude request failed")
            return .failure(.aiProcessingFailed(underlying: error))
        }
    }

    func streamMessage(_ text: String) -> AsyncStream<AppResult<String>> {
        AsyncStream { @Sendable continuation in
            Task { @MainActor in
                guard apiKey != nil else {
                    continuation.yield(.failure(.aiServiceUnavailable))
                    continuation.finish()
                    return
                }

                isGenerating = true
                defer { isGenerating = false }

                let request = ClaudeRequest(
                    model: "claude-sonnet-4-6-20250514",
                    messages: [
                        ClaudeMessage(role: "user", content: text)
                    ],
                    system: L10n.AIServiceConfig.systemPrompt,
                    stream: true
                )

                await ClaudeStreamHandler.handle(
                    request: request,
                    network: network,
                    continuation: continuation
                )
            }
        }
    }

    func resetSession() {
        // Claude is stateless
    }

    // MARK: - Private

    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        return encoder
    }()
}

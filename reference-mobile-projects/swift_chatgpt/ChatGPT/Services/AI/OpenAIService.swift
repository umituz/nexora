import Foundation
import SwiftUI

// MARK: - OpenAI Service
@MainActor
final class OpenAIService: AIServiceProtocol {
    static let shared = OpenAIService()

    @Published var isAvailable = true
    @Published var isGenerating = false

    private let network: NetworkServiceProtocol
    private let apiKey: String?

    private init(network: NetworkServiceProtocol = NetworkService.shared) {
        self.network = network
        self.apiKey = ProcessInfo.processInfo.environment["OPENAI_API_KEY"]
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

        let request = OpenAIRequest(
            model: "gpt-4o",
            messages: [
                OpenAIMessage(role: "system", content: L10n.AIServiceConfig.systemPrompt),
                OpenAIMessage(role: "user", content: text)
            ]
        )

        do {
            let data = try encoder.encode(request)
            let response: OpenAIResponse = try await network.fetch(
                "/v1/chat/completions",
                method: .post,
                body: data
            ).get()

            guard let content = response.choices.first?.message.content else {
                return .failure(.aiProcessingFailed(underlying: NSError(domain: "OpenAI", code: -1)))
            }

            return .success(content)
        } catch {
            Logger.shared.logError(error, message: "OpenAI request failed")
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

                let request = OpenAIRequest(
                    model: "gpt-4o",
                    messages: [
                        OpenAIMessage(role: "system", content: L10n.AIServiceConfig.systemPrompt),
                        OpenAIMessage(role: "user", content: text)
                    ],
                    stream: true
                )

                await OpenAIStreamHandler.handle(
                    request: request,
                    network: network,
                    continuation: continuation
                )
            }
        }
    }

    func resetSession() {
        // OpenAI is stateless
    }

    // MARK: - Private

    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        return encoder
    }()
}

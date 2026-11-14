import Foundation
import SwiftUI
#if canImport(FoundationModels)
import FoundationModels
#endif

// MARK: - Apple Intelligence Service
@MainActor
final class AppleIntelligenceService: AIServiceProtocol {
    static let shared = AppleIntelligenceService()

    @Published var isAvailable = false
    @Published var isGenerating = false

    private init() {
        Task { await checkAvailability() }
    }

    // MARK: - AIServiceProtocol

    func checkAvailability() async {
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            let availability = SystemLanguageModel.default.availability
            isAvailable = availability == .available
            return
        }
        #endif
        isAvailable = false
    }

    func sendMessage(_ text: String) async -> AppResult<String> {
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            return await sendWithFoundationModels(text)
        }
        #endif
        return .failure(.aiServiceUnavailable)
    }

    func streamMessage(_ text: String) -> AsyncStream<AppResult<String>> {
        AsyncStream { continuation in
            Task { @MainActor in
                #if canImport(FoundationModels)
                if #available(iOS 26.0, *) {
                    await streamWithFoundationModels(text, continuation: continuation)
                    return
                }
                #endif
                continuation.yield(.failure(.aiServiceUnavailable))
                continuation.finish()
            }
        }
    }

    func resetSession() {
        // Session is created per-call
    }

    // MARK: - Private Implementation

    #if canImport(FoundationModels)
    @available(iOS 26.0, *)
    private func sendWithFoundationModels(_ text: String) async -> AppResult<String> {
        isGenerating = true
        defer { isGenerating = false }

        do {
            let session = LanguageModelSession(instructions: L10n.AIServiceConfig.systemPrompt)
            let response = try await session.respond(to: text)
            return .success(response.content)
        } catch {
            return .failure(.aiProcessingFailed(underlying: error))
        }
    }

    @available(iOS 26.0, *)
    private func streamWithFoundationModels(
        _ text: String,
        continuation: AsyncStream<AppResult<String>>.Continuation
    ) async {
        isGenerating = true
        defer { isGenerating = false }

        do {
            let session = LanguageModelSession(instructions: L10n.AIServiceConfig.systemPrompt)
            let stream = session.streamResponse(to: text)

            for try await partial in stream {
                continuation.yield(.success(partial.content))
            }
            continuation.finish()
        } catch {
            continuation.yield(.failure(.aiStreamFailed(underlying: error)))
            continuation.finish()
        }
    }
    #endif
}

import Foundation

// MARK: - Claude Stream Handler
enum ClaudeStreamHandler {
    static func handle(
        request: ClaudeRequest,
        network: NetworkServiceProtocol,
        continuation: AsyncStream<AppResult<String>>.Continuation
    ) async {
        do {
            let data = try encoder.encode(request)
            let stream = network.stream("/v1/messages", method: .post, body: data)

            for await result in stream {
                switch result {
                case .success(let data):
                    processStreamData(data, continuation: continuation)
                case .failure(let error):
                    continuation.yield(.failure(.aiStreamFailed(underlying: error)))
                }
            }

            continuation.finish()
        } catch {
            continuation.yield(.failure(.aiStreamFailed(underlying: error)))
            continuation.finish()
        }
    }

    private static func processStreamData(
        _ data: Data,
        continuation: AsyncStream<AppResult<String>>.Continuation
    ) {
        guard let line = String(data: data, encoding: .utf8),
              line.hasPrefix("data: "),
              let jsonData = line.dropFirst(6).data(using: .utf8) else {
            return
        }

        guard let chunk = try? decoder.decode(ClaudeStreamChunk.self, from: jsonData),
              chunk.delta.type == "content_block_delta" else {
            return
        }

        continuation.yield(.success(chunk.delta.text))
    }

    private static let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        return encoder
    }()

    private static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        return decoder
    }()
}

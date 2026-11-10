import Foundation

// MARK: - Claude Models

struct ClaudeRequest: Codable {
    let model: String
    let messages: [ClaudeMessage]
    let system: String?
    let stream: Bool?

    init(model: String, messages: [ClaudeMessage], system: String? = nil, stream: Bool = false) {
        self.model = model
        self.messages = messages
        self.system = system
        self.stream = stream
    }
}

struct ClaudeMessage: Codable {
    let role: String
    let content: String
}

struct ClaudeResponse: Codable {
    let content: [ClaudeContent]
}

struct ClaudeContent: Codable {
    let type: String
    let text: String?
}

struct ClaudeStreamChunk: Codable {
    let delta: ClaudeDelta
}

struct ClaudeDelta: Codable {
    let type: String
    let text: String
}

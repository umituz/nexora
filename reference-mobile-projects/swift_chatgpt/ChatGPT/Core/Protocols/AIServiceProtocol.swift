import Foundation
import SwiftUI

// MARK: - AI Service Protocol
@MainActor
protocol AIServiceProtocol: ObservableObject {
    var isAvailable: Bool { get }
    var isGenerating: Bool { get }

    func checkAvailability() async
    func sendMessage(_ text: String) async -> AppResult<String>
    func streamMessage(_ text: String) -> AsyncStream<AppResult<String>>
    func resetSession()
}

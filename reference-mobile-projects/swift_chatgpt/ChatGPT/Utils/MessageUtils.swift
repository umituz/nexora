import Foundation

// MARK: - Message Utilities
enum MessageUtils {

    /// Validates if message can be sent (not empty, within limits)
    static func canSend(_ message: String, maxLength: Int = 4000) -> Bool {
        ValidationUtils.isValidContent(message) &&
        !ValidationUtils.exceedsMaxLength(message, max: maxLength)
    }

    /// Cleans message text for processing
    static func clean(_ text: String) -> String {
        StringUtils.trim(text)
    }

    /// Extracts first N sentences from text
    static func extractSentences(from text: String, count: Int) -> String {
        let sentences = text.components(separatedBy: ". ")
        let selected = sentences.prefix(count)
        return selected.joined(separator: ". ")
    }
}

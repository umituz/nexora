import Foundation

// MARK: - String Utilities
enum StringUtils {

    /// Truncates string to maximum length, adding ellipsis if needed
    static func truncate(_ text: String, maxLength: Int) -> String {
        guard text.count > maxLength else { return text }
        return String(text.prefix(maxLength))
    }

    /// Removes leading/trailing whitespace and newlines
    static func trim(_ text: String) -> String {
        text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Checks if string is empty or contains only whitespace
    static func isBlank(_ text: String) -> Bool {
        text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    /// Generates title from text (first N chars, trimmed)
    static func title(from text: String, maxLength: Int = 30) -> String {
        let truncated = truncate(text, maxLength: maxLength)
        let trimmed = trim(truncated)
        return trimmed.isEmpty ? L10n.Conversation.newTitle : trimmed
    }

    /// Masks sensitive string for display (e.g., API keys)
    static func mask(_ text: String, visibleCount: Int = 0) -> String {
        guard text.count > visibleCount else { return text }
        if visibleCount == 0 {
            return String(repeating: "•", count: min(8, text.count))
        }
        let prefix = String(text.prefix(visibleCount))
        let maskedCount = max(0, 8 - visibleCount)
        return prefix + String(repeating: "•", count: maskedCount)
    }
}

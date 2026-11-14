import Foundation

// MARK: - Validation Utilities
enum ValidationUtils {

    // MARK: - String Validation

    /// Checks if string has valid content (not empty, not blank)
    static func isValidContent(_ text: String) -> Bool {
        !StringUtils.isBlank(text)
    }

    /// Checks if string meets minimum length requirement
    static func meetsMinLength(_ text: String, min: Int) -> Bool {
        text.count >= min
    }

    /// Checks if string exceeds maximum length
    static func exceedsMaxLength(_ text: String, max: Int) -> Bool {
        text.count > max
    }

    // MARK: - API Key Validation

    /// Validates OpenAI API key format (sk-...)
    static func isValidOpenAIKey(_ key: String) -> Bool {
        guard !key.isEmpty else { return false }
        return key.hasPrefix("sk-") && key.count > 20
    }

    /// Validates Claude API key format
    static func isValidClaudeKey(_ key: String) -> Bool {
        guard !key.isEmpty else { return false }
        return key.count > 20
    }

    // MARK: - Numeric Validation

    /// Checks if value is within range (inclusive)
    static func isInRange<T: Comparable>(_ value: T, min: T, max: T) -> Bool {
        value >= min && value <= max
    }
}

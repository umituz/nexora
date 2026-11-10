import SwiftUI
import Foundation

// MARK: - Application Constants
enum AppConstants {
    static let maxMessageLength = 4000
}

// MARK: - UI Dimensions
enum LayoutMetrics {
    enum Sidebar {
        static let width: CGFloat = 300
        static let cornerRadius: CGFloat = 14
        static let padding: CGFloat = 16
    }

    enum Avatar {
        static let diameter: CGFloat = 36
    }

    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 28
    }

    enum Animation {
        static let sidebarTransition: CGFloat = 0.25
        static let scrollDuration: CGFloat = 0.2
    }
}

// MARK: - Typography
enum Typography {
    enum FontSize {
        static let tiny: CGFloat = 10
        static let small: CGFloat = 12
        static let regular: CGFloat = 14
        static let medium: CGFloat = 15
        static let large: CGFloat = 16
        static let xlarge: CGFloat = 18
        static let xxlarge: CGFloat = 22
        static let display: CGFloat = 32
    }
}

// MARK: - Colors (Hex)
enum ColorPalette {
    static let primary = "6C5CE7"
    static let secondary = "A855F7"
    static let accent = "6C5CE7"

    // Background colors
    static let paywallTop = "0A0A0A"
    static let paywallBottom = "1A1A2E"

    // UI element colors
    static let userBubble = "F6F6F6"
    static let cardBackground = "F6F6F6"
    static let border = "E5E5EA"
    static let textPrimary = "3B3B43"
    static let textSecondary = "767680"
    static let typingBackground = "F2F2F2"

    static func gradient(from start: String, to end: String) -> [Color] {
        ColorUtils.gradient(from: start, to: end)
    }
}

// MARK: - Storage Keys
enum StorageKeys {
    static let conversations = "cached_conversations"
    static let currentUser = "current_user_profile"
    static let settings = "app_settings"
    static let openAIAPIKey = "openai_api_key"
    static let claudeAPIKey = "claude_api_key"
    static let userPreferences = "user_preferences"
    static let onboardingCompleted = "onboarding_completed"
}

// MARK: - AI Service Configuration
enum AIServiceConfig {
    // Configuration settings only - text strings moved to L10n.AIServiceConfig
}

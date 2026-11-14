import SwiftUI

struct AppTheme {
    // Primary: Deep Electric Indigo — intelligence, depth
    static let primary = Color("Primary", bundle: nil)
    static let primaryGradientStart = Color(hex: "6C5CE7")
    static let primaryGradientEnd = Color(hex: "A855F7")

    // Accent: Vivid Cyan — discovery, tech
    static let accent = Color(hex: "00D2FF")
    static let accentSecondary = Color(hex: "7C3AED")

    // Semantic
    static let success = Color(hex: "10B981")
    static let warning = Color(hex: "F59E0B")
    static let destructive = Color(hex: "EF4444")

    // Surface colors
    static let cardBackground = Color(.systemBackground)
    static let secondaryBackground = Color(.secondarySystemBackground)
    static let tertiaryBackground = Color(.tertiarySystemBackground)

    // Text
    static let textPrimary = Color(.label)
    static let textSecondary = Color(.secondaryLabel)
    static let textTertiary = Color(.tertiaryLabel)

    // Gradients
    static let heroGradient = LinearGradient(
        colors: [primaryGradientStart, primaryGradientEnd],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let subtleGradient = LinearGradient(
        colors: [primaryGradientStart.opacity(0.1), primaryGradientEnd.opacity(0.05)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let cyanGradient = LinearGradient(
        colors: [accent, Color(hex: "0EA5E9")],
        startPoint: .leading,
        endPoint: .trailing
    )
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = ((int >> 24) & 0xFF, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

import SwiftUI

// MARK: - Color Utilities
enum ColorUtils {

    static func from(hex: String) -> Color {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let (a, r, g, b): (UInt64, UInt64, UInt64, UInt64)
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        return Color(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    static func gradient(from startHex: String, to endHex: String) -> LinearGradient {
        LinearGradient(
            colors: [from(hex: startHex), from(hex: endHex)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    static func gradient(from start: String, to end: String) -> [Color] {
        [from(hex: start), from(hex: end)]
    }
}

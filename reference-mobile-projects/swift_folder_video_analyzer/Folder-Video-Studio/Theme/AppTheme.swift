import SwiftUI

enum AppTheme {
    static let accent = Color(red: 0.35, green: 0.45, blue: 1.0)
    static let accentGradient = LinearGradient(
        colors: [Color(red: 0.35, green: 0.45, blue: 1.0), Color(red: 0.6, green: 0.35, blue: 1.0)],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let warmGradient = LinearGradient(
        colors: [Color(red: 1.0, green: 0.45, blue: 0.35), Color(red: 1.0, green: 0.65, blue: 0.2)],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let successGreen = Color(red: 0.2, green: 0.78, blue: 0.45)
    static let warningOrange = Color(red: 1.0, green: 0.6, blue: 0.2)
    static let surface = Color(NSColor.controlBackgroundColor)
    static let secondaryText = Color.secondary

    static func categoryColor(_ name: String) -> Color {
        switch name {
        case "blue": return Color(red: 0.3, green: 0.55, blue: 1.0)
        case "purple": return Color(red: 0.6, green: 0.35, blue: 1.0)
        case "orange": return Color(red: 1.0, green: 0.6, blue: 0.2)
        case "green": return Color(red: 0.2, green: 0.78, blue: 0.45)
        case "pink": return Color(red: 1.0, green: 0.4, blue: 0.55)
        case "red": return Color.red
        case "gray": return Color.gray
        default: return Color.blue
        }
    }
}

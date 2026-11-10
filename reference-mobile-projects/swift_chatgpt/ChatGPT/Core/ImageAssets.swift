import SwiftUI

// MARK: - Image Assets
enum ImageAssets {
    // Navigation
    static let close = "xmark"
    static let settings = "gearshape"
    static let settingsFill = "gearshape.fill"
    static let chevronRight = "chevron.right"
    static let chevronDown = "chevron.down"
    static let checkmark = "checkmark"

    // AI & Intelligence
    static let appleIntelligence = "apple.intelligence"
    static let sparkle = "sparkles"
    static let info = "info.circle"
    static let atom = "atom"

    // Chat & Conversations
    static let chatBubbles = "bubble.left.and.bubble.right"
    static let message = "message"
    static let docOnDoc = "doc.on.doc"

    // Input
    static let plus = "plus"
    static let plusCircleFill = "plus.circle.fill"
    static let micFill = "mic.fill"
    static let arrowUpCircleFill = "arrow.up.circle.fill"
    static let headphones = "headphones"
    static let keyboardChevron = "keyboard.chevron.compact"

    // Actions
    static let squareAndPencil = "square.and.pencil"
    static let xmarkCircleFill = "xmark.circle.fill"
    static let trash = "trash"
    static let ellipsis = "ellipsis"

    // Features
    static let infinity = "infinity"
    static let boltFill = "bolt.fill"
    static let photoStack = "photo.stack"
    static let clockArrowCirclepath = "clock.arrow.circlepath"

    // User
    static let person = "person.crop.circle"
}

// MARK: - SF Symbol Extensions
extension Image {
    static func asset(_ name: String) -> Image {
        Image(systemName: name)
    }

    static func asset(_ name: String, size: CGFloat) -> some View {
        Image(systemName: name)
            .font(.system(size: size))
    }
}

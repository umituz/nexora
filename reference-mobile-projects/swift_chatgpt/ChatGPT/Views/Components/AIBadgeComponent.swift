import SwiftUI

// MARK: - AI Badge Component
struct AIBadgeComponent: View {
    let isAvailable: Bool

    var body: some View {
        let badgeText = isAvailable
            ? L10n.AI.activeStatus
            : L10n.AI.unavailableStatus

        let badgeIcon = isAvailable
            ? ImageAssets.appleIntelligence
            : ImageAssets.info

        let badgeColors = isAvailable
            ? ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary)
            : [Color.gray.opacity(0.5), Color.gray.opacity(0.7)]

        HStack(spacing: LayoutMetrics.Spacing.sm) {
            Image.asset(badgeIcon)
                .font(.system(size: Typography.FontSize.small, weight: .semibold))
            Text(badgeText)
                .font(.system(size: Typography.FontSize.small, weight: .semibold))
        }
        .foregroundColor(.white)
        .padding(.horizontal, LayoutMetrics.Spacing.lg)
        .padding(.vertical, 7)
        .background(LinearGradient(colors: badgeColors, startPoint: .leading, endPoint: .trailing))
        .clipShape(Capsule())
    }
}

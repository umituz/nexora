import SwiftUI

// MARK: - Upgrade Card Component
struct UpgradeCardComponent: View {
    @Binding var showPaywall: Bool

    var body: some View {
        Button { showPaywall = true } label: {
            HStack(spacing: LayoutMetrics.Spacing.md) {
                Image.asset(ImageAssets.sparkle)
                    .font(.system(size: Typography.FontSize.large, weight: .bold))
                    .foregroundColor(.white)

                VStack(alignment: .leading, spacing: LayoutMetrics.Spacing.xs) {
                    Text(L10n.Paywall.upgradeToPro)
                        .font(.system(size: Typography.FontSize.medium, weight: .semibold))
                        .foregroundColor(.white)

                    Text(L10n.Paywall.UpgradeCard.unlockAllFeatures)
                        .font(.system(size: Typography.FontSize.small))
                        .foregroundColor(.white.opacity(0.7))
                }

                Spacer()

                Image.asset(ImageAssets.chevronRight)
                    .font(.system(size: Typography.FontSize.regular, weight: .semibold))
                    .foregroundColor(.white.opacity(0.6))
            }
            .padding(LayoutMetrics.Spacing.lg)
            .background(
                LinearGradient(
                    colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: LayoutMetrics.Sidebar.cornerRadius))
        }
        .padding(.horizontal, LayoutMetrics.Sidebar.padding)
        .padding(.bottom, LayoutMetrics.Spacing.sm)
    }
}

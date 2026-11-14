import SwiftUI

// MARK: - Empty History Component
struct EmptyHistoryComponent: View {
    var body: some View {
        VStack(spacing: LayoutMetrics.Spacing.sm) {
            Spacer()

            Image.asset(ImageAssets.chatBubbles)
                .font(.system(size: Typography.FontSize.display))
                .foregroundColor(.gray.opacity(0.4))

            Text(L10n.Sidebar.emptyHistory)
                .font(.system(size: Typography.FontSize.medium))
                .foregroundColor(.gray)

            Spacer()
        }
        .frame(maxWidth: .infinity)
    }
}

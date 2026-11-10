import SwiftUI

// MARK: - User Footer Component
struct UserFooterComponent: View {
    let userName: String
    let onTapSettings: () -> Void

    var body: some View {
        VStack(spacing: LayoutMetrics.Spacing.md) {
            Divider()

            HStack(spacing: LayoutMetrics.Spacing.md) {
                avatar
                userInfo
                Spacer()
                settingsButton
            }
            .padding(.horizontal, LayoutMetrics.Spacing.xl)
        }
        .padding(.bottom, 40)
    }

    @ViewBuilder
    private var avatar: some View {
        Circle()
            .fill(Color.blue.opacity(0.15))
            .frame(
                width: LayoutMetrics.Avatar.diameter,
                height: LayoutMetrics.Avatar.diameter
            )
            .overlay(
                Text(initials)
                    .font(.system(size: Typography.FontSize.medium, weight: .semibold))
                    .foregroundColor(.blue)
            )
    }

    @ViewBuilder
    private var userInfo: some View {
        VStack(alignment: .leading, spacing: LayoutMetrics.Spacing.xs) {
            Text(userName)
                .font(.system(size: Typography.FontSize.medium, weight: .medium))
                .foregroundColor(.black)
        }
    }

    @ViewBuilder
    private var settingsButton: some View {
        Button {
            onTapSettings()
        } label: {
            Image.asset(ImageAssets.settings)
                .font(.system(size: Typography.FontSize.xlarge))
                .foregroundColor(.gray)
        }
    }

    private var initials: String {
        String(userName.prefix(1)).uppercased()
    }
}

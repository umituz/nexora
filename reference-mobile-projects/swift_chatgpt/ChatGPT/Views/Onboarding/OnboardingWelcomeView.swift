import SwiftUI

// MARK: - Welcome Screen
struct OnboardingWelcomeView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentGradient = LinearGradient(
        colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
        startPoint: .leading, endPoint: .trailing
    )

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            ZStack {
                Circle()
                    .fill(accentGradient)
                    .frame(width: 100, height: 100)
                    .opacity(0.12)

                LogoAnimation()
            }

            VStack(spacing: 12) {
                Text(L10n.Onboarding.Welcome.title)
                    .font(.system(size: 34, weight: .bold))
                    .foregroundColor(.black)

                Text(L10n.Onboarding.Welcome.subtitle)
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: ColorPalette.textSecondary))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }

            featurePreview

            Spacer()

            Button { viewModel.nextStep() } label: {
                Text(L10n.Onboarding.Welcome.cta)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(accentGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
    }

    @ViewBuilder
    private var featurePreview: some View {
        HStack(spacing: 20) {
            featurePill(icon: "bolt.fill", text: L10n.Onboarding.Welcome.fast)
            featurePill(icon: "brain.head.profile", text: L10n.Onboarding.Welcome.smart)
            featurePill(icon: "lock.shield.fill", text: L10n.Onboarding.Welcome.isPrivate)
        }
        .padding(.top, 8)
    }

    private func featurePill(icon: String, text: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(accentGradient)
            Text(text)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: ColorPalette.textPrimary))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color(hex: ColorPalette.cardBackground))
        .clipShape(Capsule())
    }
}
